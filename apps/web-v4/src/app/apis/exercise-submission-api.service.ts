/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IApiResponseResultResponse } from '../models/apiResponse';
import { IContentDirectoryApiResponse, IExerciseFeedbackNotificationResponse, IUserApiResponse, IUserExerciseSubmitRequest, IUserFetchGroupForEducatorResponse, IUserFetchLatestSubmissionsResponse, IUserFetchMySubmissionsResponse } from '../models/exercise-submission.model';


@Injectable({
  providedIn: 'root'
})
export class ExerciseSubmissionService {
  constructor(private http: HttpClient) { }

  API_BASE = '/clientApi/v2';
  USER_API = `${this.API_BASE}/user`;

  apiEndpoints = {
    EXERCISE_CODE_SUBMIT: `${this.USER_API}/exercise/submitCode`,
    EXERCISE_FILE_SUBMIT: `${this.USER_API}/exercise/submitFile`,
    FETCH_ALL_MY_SUBMISSIONS: `${this.USER_API}/exercise/getMySubmissions`,
    FETCH_LATEST_SUBMISSION: `${this.USER_API}/exercise/getLatestSubmission`,
    FETCH_SUBMISSION: `${this.USER_API}/exercise/getSubmission`,
    PROVIDE_FEEBACK_SUBMITTED: `${this.USER_API}/exercise/provideFeedback`,
    FETCH_GROUP_FOR_EDUCATOR: `${this.USER_API}/exercise/getGroupForEducator`,
    FETCH_LEARNERS_LATEST_SUBMISSIONS: `${this.USER_API}/exercise/getLearnersLatestSubmissions`,
    FETCH_EXERCISE_FEEDBACK_NOTIFICATION: `${this.USER_API}/exercise/getExerciseFeedbackNotification`,
    CREATE_CONTENT_DIRECTORY: `${this.USER_API}/exercise/createContentDirectory`,
    FILE_UPLOAD: `${this.USER_API}/exercise/fileUpload`
  };



  createContentDirectory(contentId: string): Observable<IContentDirectoryApiResponse> {
    return this.http.post<any>
      (`${this.apiEndpoints.CREATE_CONTENT_DIRECTORY}/${contentId}`, null).pipe();
  }

  fileUploadToContentDirectory(
    formData: FormData,
    contentId: string
  ): Observable<IContentDirectoryApiResponse> {
    console.log('file:', formData);
    return this.http.post<any>
      (`${this.apiEndpoints.FILE_UPLOAD}/${contentId}`,
      formData
      ).pipe();
  }

  // exerciseSubmitCode(
  //   req: FormData,
  //   contentId: string
  // ): Observable<IUserExerciseSubmitApiResponse> {
  //   console.log('request in servce:', req);
  //   return this.http
  //     .post<IApiResponse<IUserExerciseSubmitApiResponse>>(
  //       `${this.apiEndpoints.EXERCISE_CODE_SUBMIT}/${contentId}`,
  //       req
  //     )
  //     .pipe(map(response => response.result));
  // }

  exerciseSubmitFile(
    req: IUserExerciseSubmitRequest,
    contentId: string
  ): Observable<IUserApiResponse> {
    console.log(
      req
    );
    return this.http
      .post<IApiResponseResultResponse<IUserApiResponse>>(
        `${this.apiEndpoints.EXERCISE_FILE_SUBMIT}/${contentId}`,
        req,
    )
      .pipe(map(response => response.response));
  }

  fetchMySubmissions(contentId: string): Observable<IUserFetchMySubmissionsResponse[]> {
    return this.http
      .get<IApiResponseResultResponse<IUserFetchMySubmissionsResponse[]>>(
        `${this.apiEndpoints.FETCH_ALL_MY_SUBMISSIONS}/${contentId}`
      )
      .pipe(map(response => response.response));
  }

  fetchLatestSubmission(
    contentId: string,
    emailId: string
  ): Observable<IUserFetchMySubmissionsResponse[]> {
    return this.http
      .get<IApiResponseResultResponse<IUserFetchMySubmissionsResponse[]>>(
        `${this.apiEndpoints.FETCH_LATEST_SUBMISSION}/${contentId}/${emailId}`
      )
      .pipe(map(response => response.response));
  }

  fetchSubmission(
    contentId: string,
    submissionId: string,
    emailId: string
  ): Observable<IUserFetchMySubmissionsResponse[]> {
    return this.http
      .get<IApiResponseResultResponse<IUserFetchMySubmissionsResponse[]>>(
        `${
        this.apiEndpoints.FETCH_SUBMISSION
        }/${contentId}/${submissionId}/${emailId}`
      )
      .pipe(map(response => response.response));
  }

  provideFeedback(
    req: FormData,
    contentId: string,
    submissionId: string,
    emailId: string
  ): Observable<IUserApiResponse> {
    console.log('request in servce:', req);
    return this.http
      .post<IApiResponseResultResponse<IUserApiResponse>>(
        `${
        this.apiEndpoints.PROVIDE_FEEBACK_SUBMITTED
        }/${contentId}/${submissionId}/${emailId}`,
        req
      )
      .pipe(map(response => response.response));
  }
  fetchGroupForEducator(): Observable<IUserFetchGroupForEducatorResponse[]> {
    return this.http
      .get<IApiResponseResultResponse<IUserFetchGroupForEducatorResponse[]>>(
        `${this.apiEndpoints.FETCH_GROUP_FOR_EDUCATOR}`
      )
      .pipe(map(response => response.response));
  }

  fetchExerciseFeedbackNotification(): Observable<IExerciseFeedbackNotificationResponse[]> {
    return this.http
      .get<IApiResponseResultResponse<IExerciseFeedbackNotificationResponse[]>>(
        `${this.apiEndpoints.FETCH_EXERCISE_FEEDBACK_NOTIFICATION}`
      )
      .pipe(map(response => response.response));
  }

  fetchLearnersLatestSubmissions(
    groupId: string,
    contentId: string
  ): Observable<IUserFetchLatestSubmissionsResponse> {
    return this.http
      .get<IApiResponseResultResponse<IUserFetchLatestSubmissionsResponse>>(
        `${
        this.apiEndpoints.FETCH_LEARNERS_LATEST_SUBMISSIONS
        }/${groupId}/${contentId}`
      )
      .pipe(map(response => response.response));
  }
}
