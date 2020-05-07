/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
export interface IData {
  type: string;
  url: string;
  contentId?: string;
  submissionId?: string;
  isEducator?: boolean;
  emailId: string;
  submissionDate?: string;
  name?: string;
}
export interface IUserExerciseSubmitRequest {
  result_percent?: number;
  total_testcases?: number;
  testcases_passed?: number;
  testcases_failed?: number;
  user_id_type?: string;
  submission_type: string;
  url: string;
}

export interface IUserExerciseSubmitApiResponse {
  result: IUserApiResponse;
}

export interface IUserApiResponse {
  response?: string;
  Error?: string;
}

export interface IUserFetchMySubmissionsApiResponse {
  response: IUserFetchMySubmissionsResponse[];
}

export interface IUserFetchMySubmissionsResponse {
  submission_url: string;
  submission_id: string;
  feedback_url: string;
  testcases_failed: number;
  old_feedback_submission_id: string;
  submission_time: string;
  testcases_passed: number;
  total_testcases: number;
  is_feedback_for_older_sumbission: number;
  result_percent: number;
  feedback_by: string;
  feedback_time: string;
  submitted_by: string;
  submitted_by_email: string;
  submitted_by_name: string;
  submission_type: string;
  feedback_type: string;
  currentRowNumber?: number;
}

export interface IUserFetchSubmissionApiResponse {
  response: IUserFetchSubmissionResponse[];
}

export interface IUserFetchSubmissionResponse {
  submission_url: string;
  submission_id: string;
  feedback_url: string;
  testcases_failed: number;
  submission_time: string;
  testcases_passed: number;
  total_testcases: number;
  result_percent: number;
  feedback_by: string;
  feedback_time: string;
  submission_type: string;
  feedback_type: string;
  submitted_by: string;
  submitted_by_email: string;
}

export interface IUserFetchFeedbackApiResponse {
  result: IUserApiResponse;
}
export interface IUserFetchFeedbackRequest {
  educator_id: string;
  feedback: string;
  rating?: number;
  max_rating?: number;
  user_id_type?: string;
  feedback_type: string;
  url: string;
}

export interface IUserFetchGroupForEducatorApiResponse {
  response?: IUserFetchGroupForEducatorResponse[];
}

export interface IUserFetchGroupForEducatorResponse {
  group_id: string;
  group_name: string;
}

export interface IUserFetchLatestSubmissionsApiResponse {
  response: IUserFetchLatestSubmissionsResponse;
}

export interface IUserFetchLatestSubmissionsResponse {
  submissions: IUserLatestSubmission[];
  feedback_count: number;
  submission_count: number;
}

export interface IUserLatestSubmission {
  submission_url: string;
  submission_id: string;
  feedback_url: string;
  testcases_failed: number;
  old_feedback_submission_id: string;
  submission_time: string;
  testcases_passed: number;
  total_testcases: number;
  is_feedback_for_older_sumbission: number;
  result_percent: number;
  feedback_by: string;
  feedback_time: string;
  submitted_by: string;
  submitted_by_email: string;
  submitted_by_name: string;
  submission_type: string;
  feedback_type: string;
}

export interface IExerciseFeedbackNotificationApiResponse {
  response: IExerciseFeedbackNotificationResponse[];
}

export interface IExerciseFeedbackNotificationResponse {
  content_name: string;
  submission_id: string;
  content_id: string;
  old_feedback_submission_id: string;
  is_feedback_for_older_sumbission: string;
  feedback_by: string;
  feedback_time: string;
}

export interface IContentDirectoryApiResponse {
  code: number;
  message: string;
  contentURL?: string;
  contentUrl?: string;
}
