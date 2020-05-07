/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { IContent } from './content.model';

export interface IJITForm {
  additionalInfo: string;
  contentName: string;
  contentId: string;
  location: string;
  participantCount: number;
  participantProfile: 'Beginner' | 'Intermediate' | 'Expert';
  startDate: Date;
  trainingDescription: string;
  trainingLevel: 'Advanced' | 'Basic';
  track: string;
  trainingByVendor: boolean;
  searchedContent: string;
}

export interface IJITRequest {
  raised_by: string;
  track_code: string;
  content_id: string;
  content_name: string;
  start_date: string;
  no_of_participants: number;
  location_code: string;
  participant_profile: 'Beginner' | 'Intermediate' | 'Expert';
  training_level: 'Advanced' | 'Basic';
  additional_info: string;
  training_by_vendor: boolean;
}

export interface IJITResponse {
  jit_request_id: string;
  raised_by: string;
  status: string;
  track_name: string;
  track_anchor: string;
  track_lead: string;
  content_id: string;
  content_name: string;
  start_date: Date;
  no_of_participants: number;
  location_code: string;
  participant_profile: string;
  training_level: string;
  additional_info: string;
  training_by_vendor: string;
  track_code: string;
}

export interface ITrainingRequest {
  content_id: string;
  content_name: string;
  offering_id: string;
  start_dt: Date;
  end_dt: Date;
  location: string;
  registration_date: Date;
  user: string;
  user_name: string;
  delivery_type: string;
  designation: string;
}

export interface ITrainingRejection {
  manager_id: string;
  reason: string;
}

export interface ITrainingFeedbackOffering {
  offering_id: string;
  content_id: string;
  start_dt: Date;
  end_dt: Date;
  location: string;
  content_feedback_form: string;
  content_feedback_required: boolean;
  content_feedback_given: boolean;
  instructor_feedback_form: string;
  instructor_feedback_required: boolean;
  instructor_feedback_given: boolean;
  educator: {
    name: string;
    email: string;
  };
}

export interface ITrainingFeedbackQuestion {
  question_id: number;
  question: string;
  type: string;
}

export interface ITrainingFeedbackAnswer {
  question_id: number;
  type: string;
  rating: number;
  rating_reason: string;
}

export interface INominateResponse {
  email: string;
  res_code: number;
  res_message: string;
}

export interface ILHResponse {
  res_code: number;
  res_message?: string;
  email?: string;
}

export interface ITrainingFilterForm {
  location: string;
  fromDate: Date;
  toDate: Date;
}

export interface ITrainingLocation {
  name: string;
  code: string;
}

export interface IUserJLData {
  isJL6AndAbove: boolean;
  isJL7AndAbove: boolean;
  manager: string;
}
