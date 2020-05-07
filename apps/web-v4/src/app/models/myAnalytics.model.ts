/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
export interface IAssessment {
  assessment_date: Date;
  assessment_score: number;
  content_name: string;
  lex_id: string;
  max_score: number;
  min_score: number;
  percentile: number;
  type: string;
}

export class TileData {
  learningMin: number;
  learningPoints: number;
  badges: number;
  totalAssessments: number;
  pendingAssessments: number;
  certificates: number;
  nsoProgram: any;
  nsoCertificates: any;
  navigator: any;
  goals: number;
  playlist: number;
  goalsSharedToMe: number;
  goalsSharedByMe: number;
  artifactSharedByMe: number;
  expertsContacted: number;
  playGround: number;
  likes: number;
  search: number;
  catelogue: number;
  infyTV: number;
  infyRadio: number;
  infyLive: number;
}

export interface Assessment {
  myAssessment: number;
  pending: number;
  certificate: number;
  assessmentData: Array<any>;
  otherScore: any;
}
export interface NsoData {
  myNso: number;
  pending: number;
  nsoCertificate: number;
  nsoData: Array<any>;
  nsoList: Array<any>;
}

export interface MyPlans {
  myGoals: number;
  myPlayList: number;
  goalsSharedToMe: number;
  myLearning: Array<any>;
  goals: Array<any>;
  playList: Array<any>;
  certificates: Array<any>;
  badges: Array<any>;
}

export interface MyCollaborations {
  goalsSharedByMe: number;
  artifactsShard: number;
  expertsContacted: number;
  goalsMe: Array<any>;
  goalsToMe: Array<any>;
  artifactsData: Array<any>;
  expertsData: Array<any>;
}

export interface ServiceObj {
  type: string;
  startDate: string;
  endDate: string;
  contentType: string;
  isCompleted: number;
}
export interface IAssessmentResponse {
  assessment: IAssessment[];
  certifications_count: number;
  user_assessment_count_vs_org_wide: number;
  certification_list: ICertificationList[];
}
export interface ICertificationList {
  assessment_date: Date;
  content_name: string;
  lex_id: string;
  max_score: number;
  min_score: number;
  percentile: number;
  type: string;
}
export interface IUserprogressResponse {
  goal_progress: IGoalProgress[];
  goal_shared_by_me: IGoalSharedByMe[];
  goal_shared_to_me: IGoalSharedToMe[];
  learning_history: ILearningHistory[];
  playlist_progress: IPlaylistProgress[];
  playlist_shared_by_me: IPlaylistSharedByMe[];
  playlist_shared_to_me: IPlaylistSharedToMe[];
  top_content_jl: ITopContentJL[];
  top_content_unit: ITopContentUnit[];
}
export interface INsoDataResponse {
  artifacts_shared: IArtifactsShared[];
  content_created: IContentCreated[];
  experts_contacted: IexpertsContacted[];
  feature_usage_stats: {
    feedback_count: number;
    from_leaders_count: number;
    live_count: number;
    marketing_count: number;
    navigator_count: number;
    onboarding_count: number;
    radio_count: number;
    search_count: number;
    tour_count: number;
    tv_count: number;
  };
  likes_detail: ILikesDetail[];
  nso_roles: INsoRoles[];
  total_nso_program_taken: number;
  playground_details: IPlaygroundDetails[];
}
export interface IGoalProgress {
  created_on: Date;
  email_id: string;
  goal_content_id: string;
  goal_duration: string;
  goal_end_date: Date;
  goal_id: string;
  goal_start_date: Date;
  goal_title: string;
  goal_type: string;
  last_updated_on: Date;
  progress: number;
}
export interface IGoalSharedByMe {
  created_on: Date;
  email_id: string;
  goal_id: string;
  goal_title: string;
  goal_type: string;
  last_updated_on: Date;
  progress: number;
  shared_by: string;
  shared_on: Date;
  status: string;
  type: string;
}
export interface IGoalSharedToMe {
  created_on: Date;
  email_id: string;
  goal_id: string;
  goal_title: string;
  goal_type: string;
  last_updated_on: Date;
  progress: number;
  shared_by: string;
  shared_on: Date;
  status: string;
}
export interface ILearningHistory {
  content_name: string;
  last_progress_date: Date;
  lex_id: string;
  progress: number;
}
export interface IPlaylistProgress {
  created_on: Date;
  email_id: string;
  last_updated_on: Date;
  play_list_id: string;
  play_list_title: string;
  progress: number;
  shared_by: string;
  visibility: string;
}
export interface IPlaylistSharedByMe {
  created_on: Date;
  email_id: string;
  play_list_id: string;
  play_list_title: string;
  progress: number;
  resource_id: string;
  shared_by: string;
  type: string;
}
export interface ITopContentJL {
  content_name: string;
  count: number;
  lex_id: string;
  progress_range: [
    {
      doc_count: number;
      key: number;
    }
  ];
}
export interface ITopContentUnit {
  content_name: string;
  count: number;
  lex_id: string;
  progress_range: [
    {
      doc_count: number;
      key: number;
    }
  ];
}
export interface IPlaylistSharedToMe {
  created_on: Date;
  email_id: string;
  play_list_id: string;
  play_list_title: string;
  progress: number;
  resource_id: string;
  shared_by: string;
}

export interface IBadgeDetails {
  badge_id: string;
  badge_name: string;
  badge_type: string;
  content_name: string | null;
  description: string;
  email_id: string;
  first_received_date: Date;
  last_received_date: Date;
  progress: string;
}

export interface IGraphData {
  key: string;
  value: number;
}
export interface IMonthWiseData {
  month_year: string;
  number_of_content_accessed: number;
  timespent_in_mins: number;
  track: string;
}

export interface IPointsAndRanks {
  monthly_points_earned: number;
  org_wide_avg_points_earned: number;
  points_user_vs_org_wide: {
    points_earned_by_user: number;
    points_percent: number;
  };
  rank: number;
  user_points_earned: number;
}

export interface ITimeSpentResponse {
  JL_wise: IGraphData[];
  badges_details: IBadgeDetails[];
  category_wise: IGraphData[];
  date_wise: [
    {
      key: number;
      value: number;
    }
  ];
  last_updated_on: Date;
  org_wide_avg_time_spent: number;
  org_wide_category_time_spent: IGraphData[];
  points_and_ranks: IPointsAndRanks;
  time_spent_by_user: number;
  timespent_user_vs_org_wide: {
    time_spent_by_user: number;
    usage_percent: number;
  };
  total_badges_earned: number;
  track_wise_user_timespent: IMonthWiseData[];
  unit_wise: IGraphData;
}
export interface IArtifactsShared {
  content_id: string;
  content_name: string;
  date_of_use: string;
  email_id: string;
  type: string;
}
export interface IexpertsContacted {
  contact_medium: string;
  contacted: string;
  content_id: string;
  content_name: string;
  date_of_use: Date;
  email_id: string;
  type: string;
}
export interface ILikesDetail {
  content_id: string;
  content_name: string;
  date_of_use: string;
  email_id: string;
  type: string;
}
export interface INsoRoles {
  lex_id: string;
  role_id: string;
  role_name: string;
}
export interface IPlaygroundDetails {
  activity: string;
  contest_Name: string;
  date_of_use: Date;
  email_id: string;
  marks_Obtained: string;
  sub_activity: string;
  type: string;
  video_Proctoring: boolean;
}
export interface IContentCreated {
  content_name: string;
  content_type: string;
  email_id: string;
  last_updated_on: Date;
  lex_id: string;
}
