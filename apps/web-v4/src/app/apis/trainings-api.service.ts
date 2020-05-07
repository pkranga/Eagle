/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { slagV2 } from '../constants/apiEndpoints.constant';
import { ITrainingOffering, ITrainingSession } from '../models/content.model';
import { AuthService } from '../services/auth.service';
import {
  IJITRequest,
  ITrainingRequest,
  IJITResponse,
  ITrainingRejection,
  ITrainingFeedbackQuestion,
  ITrainingFeedbackAnswer,
  ITrainingFeedbackOffering,
  INominateResponse,
  ITrainingLocation,
  ILHResponse
} from '../models/training.model';

const LH_BASE = `${slagV2}/learninghub`;
const ASSETS_TRAINING = `/public-assets/common/training`;

@Injectable({
  providedIn: 'root'
})
export class TrainingsApiService {
  constructor(private http: HttpClient, private authSvc: AuthService) {}

  getTrainingCounts(identifiers: string[]): Observable<{ [type: string]: number }> {
    return this.http
      .post<{ [type: string]: number }>(`${LH_BASE}/offerings/count`, { identifiers })
      .pipe(catchError(err => throwError(err)));
  }

  // FOR SIEMENS DEMO ONLY
  getProgramTrainingCounts(identifiers: string[]): Observable<{ [type: string]: number }> {
    return this.http.get<{ [type: string]: number }>('/public-assets/common/siemens/trainings/training_count.json');
  }

  getTrainings(
    identifier: string,
    email: string,
    startDate: string,
    endDate: string,
    location?: string
  ): Observable<ITrainingOffering[]> {
    return this.http
      .get<ITrainingOffering[]>(
        `${LH_BASE}/content/${identifier}/trainings?email=${email}&start_dt=${startDate}&end_dt=${endDate}${
          location ? '&location=' + location : ''
        }`
      )
      .pipe(catchError(err => throwError(err)));
  }

  getTrainingSessions(trainingId: string): Observable<Array<ITrainingSession>> {
    return this.http
      .get<Array<ITrainingSession>>(`${LH_BASE}/offerings/${trainingId}/sessions`)
      .pipe(catchError(err => throwError(err)));
  }

  register(offeringId: string, email: string): Observable<ILHResponse> {
    return this.http.post<ILHResponse>(`${LH_BASE}/offerings/${offeringId}/users/${email}`, {});
  }

  deregister(offeringId: string, email: string): Observable<ILHResponse> {
    return this.http.delete<ILHResponse>(`${LH_BASE}/offerings/${offeringId}/users/${email}`);
  }

  addToWatchlist(identifier: string, email: string): Observable<any> {
    return this.http
      .post(`${LH_BASE}/content/${identifier}/users/${email}`, {})
      .pipe(catchError(err => throwError(err)));
  }

  removeFromWatchlist(identifier: string, email: string): Observable<any> {
    return this.http
      .delete(`${LH_BASE}/content/${identifier}/users/${email}`, {})
      .pipe(catchError(err => throwError(err)));
  }

  getWatchlist(email: string): Observable<Array<string>> {
    return this.http.get<Array<string>>(`${LH_BASE}/users/${email}/watchlist`).pipe(catchError(err => throwError(err)));
  }

  getUserJL6Status(email: string): Observable<any> {
    return this.http.get(`${LH_BASE}/users/${email}`).pipe(catchError(err => throwError(err)));
  }

  nominateUsers(manager: string, nominees: string[], offeringId: string): Observable<INominateResponse[]> {
    return this.http
      .post<INominateResponse[]>(`${LH_BASE}/offerings/${offeringId}/users`, { manager, nominees })
      .pipe(catchError(err => throwError(err)));
  }

  sendJITRequest(jitRequest: IJITRequest) {
    return this.http.post(`${LH_BASE}/jit`, jitRequest).pipe(catchError(err => throwError(err)));
  }

  getJITRequests(email: string): Observable<IJITResponse[]> {
    return this.http.get<IJITResponse[]>(`${LH_BASE}/users/${email}/jit`).pipe(catchError(err => throwError(err)));
  }

  getTrainingRequests(email: string): Observable<ITrainingRequest[]> {
    return this.http
      .get<ITrainingRequest[]>(`${LH_BASE}/manager/${email}/offerings`)
      .pipe(catchError(err => throwError(err)));
  }

  rejectTrainingRequest(rejection: ITrainingRejection, offeringId: string, email: string): Observable<any> {
    return this.http
      .patch(`${LH_BASE}/offerings/${offeringId}/users/${email}`, rejection)
      .pipe(catchError(err => throwError(err)));
  }

  shareTraining(offeringId: string, sharedBy: string, sharedWith: string[]): Observable<any> {
    return this.http
      .post(`${LH_BASE}/offerings/${offeringId}/share`, {
        sharedBy,
        shared_with: sharedWith
      })
      .pipe(catchError(err => throwError(err)));
  }

  getTrainingsForFeedback(email: string): Observable<ITrainingFeedbackOffering[]> {
    return this.http
      .get<ITrainingFeedbackOffering[]>(`${LH_BASE}/users/${email}/offerings/feedback`)
      .pipe(catchError(err => throwError(err)));
  }

  getTrainingFeedbackForm(formId: string): Observable<ITrainingFeedbackQuestion[]> {
    return this.http
      .get<ITrainingFeedbackQuestion[]>(`${LH_BASE}/feedback/${formId}`)
      .pipe(catchError(err => throwError(err)));
  }

  submitTrainingFeedback(
    offeringId: string,
    email: string,
    formId: string,
    answers: ITrainingFeedbackAnswer[]
  ): Observable<any> {
    return this.http
      .post(`${LH_BASE}/offerings/${offeringId}/users/${email}/feedback?template=${formId}`, answers)
      .pipe(catchError(err => throwError(err)));
  }

  // GET hardcoded values

  getTrainingLocations(): Observable<Array<ITrainingLocation>> {
    return this.http
      .get<Array<ITrainingLocation>>(`${ASSETS_TRAINING}/training_locations.json`)
      .pipe(catchError(() => []));
  }

  getTrainingTracks(): Observable<Array<any>> {
    return this.http.get<Array<any>>(`${ASSETS_TRAINING}/training_tracks.json`).pipe(
      map(tracks => {
        return tracks.filter(track => track.flgJIT);
      }),
      catchError(() => [])
    );
  }

  // TO BE REMOVED
  getProgramTrainings(programId: string) {
    return this.http
      .get('/public-assets/common/siemens/trainings/trainings.json')
      .pipe(map((allPrograms: any[]) => allPrograms.find(program => program.program_id === programId)));
  }
}
