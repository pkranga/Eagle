/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
export interface IPredefinedGoalApiResponse {
  response: IPredefinedGoalsGroup[];
}
export interface IPredefinedGoalsGroup {
  goal_group_title: string;
  goals: IPredefinedGoal[];
}
export interface IPredefinedGoal {
  created_on: string;
  goal_desc: string;
  goal_content_id: string[];
  goal_title: string;
  id: string;
  suggestedDuration?: number;
  goal_duration: number;
  goal_type: string;
  goal_group: string;
  // already_added: number
  user_added: number;
  share_added: number;
}

export interface IGoalAddUpdateResponse {
  response: GoalUpdateResponse[];
}
export interface GoalUpdateResponse {
  result: string;
  goal_id: string;
  self_shared?: number;
  user_count?: number;
  already_shared?: string[];
  invalid_users?: string[];
  fail_reason?: string;
}
interface GoalAddUpdateMessage {
  result: string;
  message: string;
}
export interface IGoalAddUpdateRequest {
  goal_data: IUserGoalAddUpdateRequest[];
}
export interface IUserGoalAddUpdateRequest {
  goal_content_id: string[];
  goal_title: string;
  goal_desc: string;
  goal_id?: string;
  goal_type: string;
  user_list?: string[];
  goal_duration: number;
  user_action?: string;
  shared_by?: string;
  goal_end_date?: string;
  goal_start_date?: string;
  status_message?: string;
  is_delete?: number;
  shared_on?: string;
  old_goal_type?: string;
  shared_goal_type?: string;
  user_commongoalid?: string;
}
export interface IUserProgressGoalsApiResponse {
  response: IUserProgressGoals;
}
export interface ISharedGoalProgressCountApiResponse {
  response: ISharedGoalsProgressCount;
}
export interface ISharedGoalProgressDataApiResponse {
  response: ISharedGoalsProgressAccData;
}
export interface IUserProgressGoals {
  goals_in_progress: IUserProgressGoal[];
  completed_goals: IUserProgressGoal[];
}

export interface ISharedGoalResourceProgress {
  resource_progress: number;
  time_left: number;
  pending: number;
  resource_id: string;
  resource_duration: number;
}

export interface ISharedGoalProgressData {
  status_message: string;
  shared_with: string;
  goal_end_date?: number;
  goal_start_date?: number;
  status: number;
  checked?: boolean;
  goal_progress?: number;
  last_updated_on?: number;
  resource_progress_tracker?: ISharedGoalResourceProgress[];
}
export interface ISharedGoalsProgressCount {
  accepted: number;
  rejected: number;
  pending: number;
  goal_id?: string;
}

export interface ISharedGoalsProgressAccData {
  accepted: ISharedGoalProgressData[];
  rejected: ISharedGoalProgressData[];
  pending: ISharedGoalProgressData[];
}
export interface IUserProgressGoal {
  created_on: Date;
  goal_id: string;
  goal_content_id: string[];
  goal_desc: string;
  goalProgress: number;
  goal_type: string;
  goal_title: string;
  last_updated_on: Date;
  resourceMetaData: any; // to be changed
  goal_end_date: string;
  goal_start_date: string;
  goal_duration: number;
  shared_by: string;
  resource_progress: IUserGoalResourceProgress[];
  type?: string;
}
export interface IUserGoalResourceProgress {
  pending: number;
  resource_id: string;
  resource_name: string;
  resource_desc: string;
  resource_progress: number;
  time_spent: number;
  time_left: number;
  total_duration: number;
  contentType: string;
  mimeType: string;
}

export interface IUserGoalRemoveSubsetApiResponse {
  response: IUserGoalRemoveSubset;
}

export interface IUserGoalRemoveSubset {
  resource_list: string[];
  suggested_time: number;
  goal_message: string[];
}
export interface IUserGoalRemoveSubsetRequest {
  goal_content_id: string[];
}

export interface IUserGoalsApiResponse {
  response: IUserGoal[];
}
export interface IUserGoal {
  goal_id: string;
  goal_content_id: string[];
  goal_desc: string;
  goal_type: string;
  goal_title: string;
  shared_by: string;
  goal_duration: number;
  goal_end_date: string;
  goal_start_date: string;
  goalProgress: number;
  resource_progress: any[];
  // below added for UI only
  isChecked: boolean;
}

export interface IGoalRemoveResponse {
  response: string;
}
export interface IUserGoalRemovalApiRequest {
  goal_id: string;
  goal_type: string;
}

export interface IUserSharedGoalDeleteRequest {
  goal_data: IUserGoalDeleteDetails[];
}

export interface IUserGoalDeleteDetails {
  goal_id: string;
  user_list: string[];
  goal_type: string;
  goal_content_id: string[];
  goal_duration: number;
  goal_title: string;
  goal_desc: string;
}

export interface IUserSharedGoalDeleteResponse {
  response: GoalUpdateResponse[];
}

export interface IUserGoalSharedWithResponse {
  response: IUserGoalSharedWith[];
}

export interface IUserGoalSharedWith {
  goal_title: string;
  goal_content_id: string[];
  goal_desc: string;
  shared_with: string;
  goal_id: string;
  shared_on: string;
  goal_type?: string;
  created_on: Date;
  resource: IResourceDetails[];
  shared_by: string;
  goal_duration: number;
  status: number;
}

export interface IUserGoalSharedByResponse {
  response: IUserGoalSharedBy[];
}

export interface IUserGoalSharedBy {
  goal_title: string;
  goal_content_id: string[];
  goal_desc: string;
  goal_id: string;
  goal_duration: number;
  resource: IResourceDetails[];
  shared_with: string;
  goal_progress: number;
  goal_end_date: string;
  goal_start_date: string;
  goal_type?: string;
  status: number;
  shared_users_progress: IUserSharedProgress[];
}

export interface IUserSharedProgress {
  total_read_duration: number;
  shared_with: string;
  goal_progress: number;
  goal_end_date: string;
  goal_start_date: string;
  total_goal_duration: number;
  status: number;
  resource_progress: IResourceProgress[];
}

export interface IResourceProgress {
  resource_id: string;
  time_spent: number;
  time_left: number;
  total_duration: number;
  pending: number;
  resource_name: string;
  resource_desc: string;
  resource_progress: number;
}
export interface IResourceDetails {
  resource_id: string;
  resource_name: string;
  time_duration: Date;
  contentType: string;
  mimeType: string;
}

export interface ICommonGoalsCheckRequest {
  goal_id: string;
  goal_title: string;
  goal_desc: string;
  goal_content_id: string[];
}

export interface ICommonGoalsCheckResponse {
  user_commongoalid: string;
}
