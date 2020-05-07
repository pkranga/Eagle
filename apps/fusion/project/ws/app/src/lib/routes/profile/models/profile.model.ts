/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { IWidgetGraphData, NsContent } from '@ws-widget/collection'

export namespace NSProfileData {
  export interface ITimeSpentResponse {
    JL_wise: IPieCharts[]
    badges_details: IBadgeDetails[]
    category_wise: IPieCharts[]
    date_wise: IProfileData[]
    last_updated_on: Date
    org_wide_avg_time_spent: number
    org_wide_category_time_spent: IPieCharts[]
    points_and_ranks: IPointsAndRanks
    time_spent_by_user: number
    timespent_user_vs_org_wide: {
      time_spent_by_user: number;
      usage_percent: number;
    }
    total_badges_earned: number
    track_wise_user_timespent: ITrackWiseData
    unit_wise: IPieCharts[]
  }

  export interface IProfileData {
    key: number
    key_as_string?: string
    value: number
  }

  export interface IPieCharts {
    key: string
    value: number
  }

  export interface IBadgeDetails {
    badge_id: string
    badge_name: string
    badge_type: string
    content_name: string | null
    description: string
    email_id: string
    first_received_date: Date
    last_received_date: Date
    progress: string
  }
  export interface ICardSkill {
    category?: string
    certificationCount?: number
    courseCount?: number
    horizon?: string
    group?: string
    level?: string
    user_level?: string
    id: string
    imageUrl: string
    navigationUrl: string
    title: string
    recommendedBy?: string
    progress?: string
    skills?: string[]
  }
  export interface IPointsAndRanks {
    monthly_points_earned: number
    org_wide_avg_points_earned: number
    points_user_vs_org_wide: IPointsANdRanksOrgWide
    rank: number
    user_points_earned: number
  }

  export interface IPointsANdRanksOrgWide {
    points_earned_by_user: number
    points_percent: number
  }

  export interface ITrackWiseData {
    [key: string]: IMonthWiseData[]
  }

  export interface IMonthWiseData {
    month_year: string
    number_of_content_accessed: number
    timespent_in_mins: number
    track: string
  }

  export interface INsoResponse {
    artifacts_shared: IArtifactsShared[]
    content_created: IContentCreated[]
    experts_contacted: IExpertsContacted[]
    feature_usage_stats: IFeatureUsageStatistics
    likes_detail: IArtifactsShared[]
    nso_content_progress: INsoContentProgress
    nso_roles: INsoRoles[]
    playground_details: IPlayGroundDetails[]
    total_nso_program_taken: number
  }

  export interface INsoContentProgress {
    role_name: string
  }
  export interface INsoRoles {
    lex_id: string
    role_id: string
    role_name: string
  }
  export interface IPlayGroundDetails {
    activity: string
    contest_Name: string
    date_of_use: string
    email_id: string
    marks_Obtained: string
    sub_activity: string
    type: string
    video_Proctoring: boolean
  }

  export interface IContentCreated {
    app_icon: string
    content_name: string
    content_type: string
    email_id: string
    last_updated_on: string
    lex_id: string
  }

  export interface IArtifactsShared {
    content_id: string
    content_name: string
    date_of_use: string
    email_id: string
    type: string
  }
  export interface IExpertsContacted {
    contact_medium: string
    contacted: string
    content_id: string
    content_name: string
    date_of_use: string
    email_id: string
    type: string
  }
  export interface IFeatureUsageStatistics {
    feedback_count: number
    from_leaders_count: number
    live_count: number
    marketing_count: number
    navigator_count: number
    onboarding_count: number
    radio_count: number
    search_count: number
    tour_count: number
    tv_count: number
  }
 export interface IBubbleChart {
   x: string
   y: number
   r: number
   actual: number
   text: string
 }
  export interface IGraphWidget {
    widgetType: string
    widgetSubType: string
    widgetData: IWidgetGraphData
  }

  // type TContentTypes =
  //   | 'Learning Path'
  //   | 'Course'
  //   | 'Collection'
  //   | 'Resource'
  //   | 'Knowledge Artifact'
  //   | 'Knowledge Board'
  //   | 'Channel'
  //   | 'Learning Journeys'
  //   | 'Playlist'
  //   | 'person'
  //   | 'tags'

  // const SERVICES: Record<string, string> = {
  //   doorToDoor: 'delivery at door',
  //   airDelivery: 'flying in',
  //   specialDelivery: 'special delivery',
  //   inStore: 'in-store pickup',
  // }
  export interface IFollowing {
    'Knowledge Board': NsContent.IContentMinimal[]
    Channel: NsContent.IContentMinimal[]
  }
}
