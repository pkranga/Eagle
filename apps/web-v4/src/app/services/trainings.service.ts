/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import { addMonths, format as formatDate } from 'date-fns';
import { noop, Observable, of, throwError, config } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { TrainingsApiService } from '../apis/trainings-api.service';
import { IContent, ITrainingOffering, TContentType } from '../models/content.model';
import { ResolveResponse } from '../models/routeResolver.model';
import { ISearchApiResult } from '../models/searchResponse.model';
import {
  IJITForm,
  IJITRequest,
  IJITResponse,
  ILHResponse,
  INominateResponse,
  ITrainingFeedbackAnswer,
  ITrainingFeedbackOffering,
  ITrainingFeedbackQuestion,
  ITrainingRejection,
  IUserJLData
} from '../models/training.model';
import { AuthService } from './auth.service';
import { ConfigService } from './config.service';
import { ContentService } from './content.service';

@Injectable({
  providedIn: 'root'
})
export class TrainingsService {
  constructor(
    private trainingsApi: TrainingsApiService,
    private authSvc: AuthService,
    private configSvc: ConfigService,
    private contentSvc: ContentService
  ) {}

  getTrainings(content: IContent, fromDate?: Date, toDate?: Date, location?: string): Observable<ITrainingOffering[]> {
    if (!(this.configSvc.instanceConfig.features.learningHub.available && this.isValidTrainingContent(content))) {
      return of([]);
    }

    const email = this.getEmailPrefix(this.authSvc.userEmail);
    let startDate: string;
    let endDate: string;
    if (!fromDate) {
      startDate = formatDate(new Date(), 'DD MMM YYYY');
    } else {
      startDate = formatDate(fromDate, 'DD MMM YYYY');
    }

    if (!toDate) {
      endDate = formatDate(addMonths(new Date(), 6), 'DD MMM YYYY');
    } else {
      endDate = formatDate(toDate, 'DD MMM YYYY');
    }

    return this.trainingsApi.getTrainings(content.identifier, email, startDate, endDate, location).pipe(
      map(trainings => {
        trainings.forEach(training => {
          if (!training.eligible) {
            training.ineligibility_reasons = training.reason_not_eligible.split(',');
          }
        });
        return trainings;
      }),
      catchError(() => of([]))
    );
  }

  getTrainingsForTOC(resolveResponse: ResolveResponse<IContent>): Observable<ResolveResponse<IContent>> {
    const content = resolveResponse.data;

    if (!this.configSvc.instanceConfig.features.learningHub.available || content.trainings) {
      return of(resolveResponse);
    }

    if (this.isValidTrainingContent(resolveResponse.content)) {
      const response: ResolveResponse<IContent> = {
        ...resolveResponse
      };

      return this.getTrainings(resolveResponse.data).pipe(
        map((trainings: ITrainingOffering[]) => {
          response.data.trainings = trainings;
          return response;
        }),
        catchError(err => {
          response.data.trainings = [];
          return of(response);
        })
      );
    } else {
      return of(resolveResponse);
    }
  }

  getTrainingCountsForSearchResults(searchResults: ISearchApiResult) {
    if (!this.configSvc.instanceConfig.features.learningHub.available) {
      return;
    }

    // FOR SIEMENS DEMO
    if (this.configSvc.instanceConfig.features.siemens.enabled) {
      this.getProgramTrainingCounts(searchResults);
      return;
    }

    const identifiers: string[] = searchResults.result
      .filter(content => this.isValidTrainingContent(content))
      .map<string>(course => course.identifier);

    if (!identifiers.length) {
      return;
    }

    this.trainingsApi.getTrainingCounts(identifiers).subscribe((trainingCounts: { [type: string]: number }) => {
      searchResults.result.forEach(content => {
        if (trainingCounts[content.identifier]) {
          content.trainingCount = trainingCounts[content.identifier];
        }
      });
    }, noop);
  }

  // FOR SIEMENS DEMO
  getProgramTrainingCounts(searchResults: ISearchApiResult) {
    const identifiers: string[] = searchResults.result
      .filter(content => content.contentType === 'Course')
      .map<string>(course => course.identifier);

    this.trainingsApi.getProgramTrainingCounts(identifiers).subscribe((trainingCounts: { [type: string]: number }) => {
      searchResults.result.forEach(content => {
        if (trainingCounts[content.identifier]) {
          content.trainingCount = trainingCounts[content.identifier];
        }
      });
    }, noop);
  }

  getTrainingSessions(offerings: ITrainingOffering[]) {
    offerings.forEach(offering => {
      const sessionSubscription = this.trainingsApi.getTrainingSessions(offering.offering_id).subscribe(
        session => {
          offering.sessions = session;
        },
        err => {
          offering.sessions = [];
        },
        () => {
          sessionSubscription.unsubscribe();
        }
      );
    });
  }

  registerForTraining(offering: ITrainingOffering): Observable<ILHResponse> {
    const email = this.getEmailPrefix(this.authSvc.userEmail);

    return this.trainingsApi.register(offering.offering_id, email).pipe(
      tap(() => {
        offering.registered = true;
        offering.slots_available--;
      }),
      catchError((err, caught) => throwError(caught))
    );
  }

  deregisterFromTraining(offering: ITrainingOffering): Observable<ILHResponse> {
    const email = this.getEmailPrefix(this.authSvc.userEmail);

    return this.trainingsApi.deregister(offering.offering_id, email).pipe(
      tap(() => {
        offering.registered = false;
        offering.slots_available++;
      }),
      catchError((err, caught) => throwError(caught))
    );
  }

  addToWatchlist(contentId: string) {
    const email = this.getEmailPrefix(this.authSvc.userEmail);

    return this.trainingsApi.addToWatchlist(contentId, email).pipe(catchError(err => throwError(err)));
  }

  removeFromWatchlist(contentId: string) {
    const email = this.getEmailPrefix(this.authSvc.userEmail);

    return this.trainingsApi.removeFromWatchlist(contentId, email).pipe(catchError(err => throwError(err)));
  }

  getWatchlist() {
    const email = this.getEmailPrefix(this.authSvc.userEmail);

    return this.trainingsApi.getWatchlist(email).pipe(catchError(err => throwError(err)));
  }

  nominateUsers(nominees: string[], offeringId: string): Observable<INominateResponse[]> {
    const managerEmail = this.getEmailPrefix(this.authSvc.userEmail);

    return this.trainingsApi.nominateUsers(managerEmail, nominees, offeringId).pipe(catchError(err => throwError(err)));
  }

  sendJITRequest(jitForm: IJITForm) {
    const email = this.getEmailPrefix(this.authSvc.userEmail);
    const contentName = jitForm.contentName || jitForm.searchedContent;

    const jitRequest: IJITRequest = {
      additional_info: jitForm.additionalInfo,
      content_id: jitForm.contentId,
      content_name: contentName,
      location_code: jitForm.location,
      no_of_participants: jitForm.participantCount,
      participant_profile: jitForm.participantProfile,
      raised_by: email,
      start_date: formatDate(jitForm.startDate, 'DD MMM YYYY'),
      track_code: jitForm.track,
      training_by_vendor: jitForm.trainingByVendor,
      training_level: jitForm.trainingLevel
    };

    return this.trainingsApi.sendJITRequest(jitRequest).pipe(catchError(err => throwError(err)));
  }

  getJITRequests(): Observable<IJITResponse[]> {
    const email = this.getEmailPrefix(this.authSvc.userEmail);

    return this.trainingsApi.getJITRequests(email).pipe(catchError(err => throwError(err)));
  }

  getTrainingRequests() {
    const email = this.getEmailPrefix(this.authSvc.userEmail);

    return this.trainingsApi.getTrainingRequests(email).pipe(catchError(err => throwError(err)));
  }

  getUserJL6Status(): Observable<boolean> {
    const email = this.getEmailPrefix(this.authSvc.userEmail);

    return this.trainingsApi.getUserJL6Status(email).pipe(
      map((result: { isJL6AndAbove: boolean }) => {
        return result.isJL6AndAbove;
      }),
      catchError(() => of(false))
    );
  }

  getUserJLData(): Observable<IUserJLData> {
    const email = this.getEmailPrefix(this.authSvc.userEmail);

    return this.trainingsApi.getUserJL6Status(email);
  }

  rejectTrainingRequest(reason: string, offeringId: string): Observable<any> {
    const email = this.getEmailPrefix(this.authSvc.userEmail);
    const rejection: ITrainingRejection = {
      manager_id: email,
      reason
    };

    return this.trainingsApi
      .rejectTrainingRequest(rejection, offeringId, email)
      .pipe(catchError(err => throwError(err)));
  }

  shareTraining(offeringId: string, sharedWith: string[]): Observable<any> {
    const sharedBy = this.getEmailPrefix(this.authSvc.userEmail);

    return this.trainingsApi.shareTraining(offeringId, sharedBy, sharedWith).pipe(catchError(err => throwError(err)));
  }

  getTrainingsForFeedback(): Observable<ITrainingFeedbackOffering[]> {
    const email = this.getEmailPrefix(this.authSvc.userEmail);

    return this.trainingsApi.getTrainingsForFeedback(email);
  }

  getTrainingFeedbackForm(formId: string): Observable<ITrainingFeedbackQuestion[]> {
    return this.trainingsApi.getTrainingFeedbackForm(formId).pipe(catchError(err => throwError(err)));
  }

  submitTrainingFeedback(offeringId: string, formId: string, answers: ITrainingFeedbackAnswer[]) {
    const email = this.getEmailPrefix(this.authSvc.userEmail);

    return this.trainingsApi
      .submitTrainingFeedback(offeringId, email, formId, answers)
      .pipe(catchError(err => throwError(err)));
  }

  getJITEligibleContent(query: string): Observable<IContent[]> {
    return this.contentSvc
      .search({
        filters: {
          contentType: Object.keys(
            this.configSvc.instanceConfig.features.learningHub.config.contentTypes
          ) as TContentType[]
        },
        pageNo: 0,
        pageSize: 5,
        query
      })
      .pipe(map((searchResult: ISearchApiResult) => searchResult.result.filter(content => this.isValidTrainingContent(content))));
  }

  // Utility methods

  private getEmailPrefix(emailId: string): string {
    try {
      const atIndex = emailId.indexOf('@');
      if (atIndex === -1) {
        return emailId;
      }

      return emailId.substring(0, atIndex);
    } catch (e) {
      return emailId;
    }
  }

  isValidTrainingContent(content: IContent): boolean {
    try {
      const config = this.configSvc.instanceConfig.features.learningHub.config;
      const contentTypeConfig = config.contentTypes[content.contentType];

      if (!contentTypeConfig) {
        return false;
      }

      let result = true;
      contentTypeConfig.boolProps.forEach(boolProp => {
        if (!result) {
          return;
        }

        result = result && (boolProp.shouldBeTrue ? content[boolProp.propName] : !content[boolProp.propName]);
      });

      return result;
    } catch (e) {
      return false;
    }
  }
}
