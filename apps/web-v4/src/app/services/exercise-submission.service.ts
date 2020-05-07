/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ExerciseSubmissionService } from '../apis/exercise-submission-api.service';
import { IContentDirectoryApiResponse, IExerciseFeedbackNotificationResponse, IUserApiResponse, IUserExerciseSubmitRequest, IUserFetchGroupForEducatorResponse, IUserFetchLatestSubmissionsResponse, IUserFetchMySubmissionsResponse } from '../models/exercise-submission.model';
// import { map, switchMap, tap, filter, first } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ExerciseService {

  constructor(private exerciseApi: ExerciseSubmissionService, private http: HttpClient) { }

  createContentDirectory(contentId: string): Observable<IContentDirectoryApiResponse> {
    return this.exerciseApi.createContentDirectory(contentId);
  }

  fileUploadToContentDirectory(formData: FormData, contentId: string): Observable<IContentDirectoryApiResponse> {
    return this.exerciseApi.fileUploadToContentDirectory(formData, contentId);
  }

  // exerciseSubmitCode(req: any, contentId: string): Observable<IUserExerciseSubmitApiResponse> {
  //   return this.exerciseApi.exerciseSubmitCode(req, contentId);
  // }

  exerciseSubmitFile(req: IUserExerciseSubmitRequest, contentId: string): Observable<IUserApiResponse> {
    return this.exerciseApi.exerciseSubmitFile(req, contentId);
  }

  fetchMySubmissions(contentId: string): Observable<IUserFetchMySubmissionsResponse[]> {
    return this.exerciseApi.fetchMySubmissions(contentId);
  }

  fetchLatestSubmission(contentId: string, emailId: string): Observable<IUserFetchMySubmissionsResponse[]> {
    return this.exerciseApi.fetchLatestSubmission(contentId, emailId);
  }

  fetchSubmission(contentId: string, submissionId: string, emailId: string): Observable<IUserFetchMySubmissionsResponse[]> {
    return this.exerciseApi.fetchSubmission(contentId, submissionId, emailId);
  }

  provideFeedback(req: any, contentId: string, submissionId: string, emailId: string): Observable<IUserApiResponse> {
    return this.exerciseApi.provideFeedback(req, contentId, submissionId, emailId);
  }

  fetchGroupForEducator(): Observable<IUserFetchGroupForEducatorResponse[]> {
    return this.exerciseApi.fetchGroupForEducator();
  }

  fetchLearnerSubmissionData(groupId: string, contentId: string): Observable<IUserFetchLatestSubmissionsResponse> {
    return this.exerciseApi.fetchLearnersLatestSubmissions(groupId, contentId);
  }

  fetchExerciseFeedbackNotification(): Observable<IExerciseFeedbackNotificationResponse[]> {
    return this.exerciseApi.fetchExerciseFeedbackNotification();
  }

  fetchFeedbackText(feedbackUrl: string): Observable<string> {
    return this.http.get(feedbackUrl, { responseType: 'text' });
  }
}
