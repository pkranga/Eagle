/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
export interface IContinueStrip {
  results: IHistory[];
  pageState: string;
  pageSize: string;
}

export type TContentType = 'Learning Path' | 'Course' | 'Collection' | 'Resource' | 'Knowledge Artifact';

export interface IHistory {
  identifier: string;
  artifactUrl: string;
  name: string;
  duration: number;
  appIcon: string;
  contentType: TContentType;
  resourceType: string;
  lastUpdatedOn: string;
  mimeType: string;
  mediaType: string;
  sourceShortName: string;
  description: string;
  complexityLevel: string;
  me_totalSessionsCount: number;
  size?: number;
  resourceCategory?: string[];
  downloadUrl?: string;
  clients?: IClient[];
  continueLearningData: {
    contextualPathId: string;
    resourceId: string;
    data: string;
  };
  // for UI
  reasonPrefix?: string;
  recommendReasons?: string[];
  isLocked?: boolean;
}

interface IClient {
  displayName: string;
  id: string;
  name: string;
}

export type TRecommendationGroupType = 'trending' | 'latest' | 'all';

export type TContentRecommendationType = 'org' | 'account' | 'unit' | 'jl' | 'role';

export type TContentRequestType = 'trending' | 'latest' | 'popular' | 'interestRecommended' | 'usageRecommended';

export interface IContentLite {
  identifier: string;
  artifactUrl: string;
  name: string;
  duration: number;
  appIcon: string;
  contentType: TContentType;
  resourceType: string;
  lastUpdatedOn: string;
  mimeType: string;
  description: string;
  complexityLevel: string;
  me_totalSessionsCount: number;
  resourceCategory?: string[];
  downloadUrl?: string;
  msArtifactDetails?: {
    channelId: string;
    videoId: string;
  };
  isIframeSupported: 'Yes' | 'No' | 'Maybe';
  certificationUrl: string;
  certificationList: IContent[];
  skills: ISkill[];
  topics: IContentTopic[];
  creatorContacts: ICreator[];
  children: IContent[];
  tags: any[];
  proctorUrl?: string;
  learningObjective: string;
  preRequisites: string;
  sourceName: string;
  softwareRequirements?: IResourceDetail[];
  systemRequirements?: string[];
  collections?: IContent[];
  learningMode?: TLearningMode;
  isExternalCourse?: boolean;
  idealScreenSize?: string;
  minLexVersion?: string;
  preContents?: IPrePostContent[];
  postContents?: IPrePostContent[];
  isExternal: 'yes' | 'no' | 'true' | 'false';
  certificationStatus?: 'ongoing' | 'passed' | 'canAttempt' | 'cannotAttempt';
  nextCertificationAttemptDate?: string;
  recentCertificationAttemptScore?: number;
  certificationSubmissionDate?: string;
  subTitles?: ISubtitle[];
  SSOEnabled?: boolean;
  playgroundResources?: Array<IResourcePlayground>;
  playgroundInstructions?: string;
}

export type TLearningMode = 'Self-Paced' | 'Instructor-Led';

export interface IContent extends IHistory {
  msArtifactDetails?: {
    channelId: string;
    videoId: string;
  };
  isIframeSupported: 'Yes' | 'No' | 'Maybe';
  contentUrlAtSource: string;
  certificationUrl: string;
  certificationList: IContent[];
  skills: ISkill[];
  topics: IContentTopic[];
  creatorContacts: ICreator[];
  creatorDetails: ICreator[];
  children: IContent[];
  tags: any[];
  proctorUrl?: string;
  learningObjective: string;
  preRequisites: string;
  sourceName: string;
  softwareRequirements?: IResourceDetail[];
  systemRequirements?: string[];
  track: ITrack[];
  collections?: IContent[];
  learningMode?: TLearningMode;
  isExternalCourse: boolean;
  introductoryVideo?: string;
  introductoryVideoIcon?: string;
  registrationInstructions?: string;
  idealScreenSize?: string;
  minLexVersion?: string;
  preContents?: IPrePostContent[];
  postContents?: IPrePostContent[];
  isExternal: 'yes' | 'no' | 'true' | 'false';
  certificationStatus?: 'ongoing' | 'passed' | 'canAttempt' | 'cannotAttempt';
  nextCertificationAttemptDate?: string;
  recentCertificationAttemptScore?: number;
  certificationSubmissionDate?: string;
  subTitles?: ISubtitle[];
  SSOEnabled?: boolean;
  playgroundResources?: Array<IResourcePlayground>;
  playgroundInstructions?: string;
  exclusiveContent?: boolean;

  // For Learning Hub; for UI only
  trainings?: ITrainingOffering[];
  trainingCount?: number;
  // For SIEMENS demo only
  trainingProgram?: any;

  // For external certifications
  verifiers: {
    name: string;
    email: string;
    id: string;
  }[];
}

interface ISubtitle {
  srclang: string;
  label: string;
  url: string;
}
interface IPrePostContent {
  identifier: string;
  name: string;
}
interface IResourceDetail {
  title?: string;
  url?: string;
}

interface IResourcePlayground {
  appIcon: string;
  artifactUrl: string;
  identifier: string;
  name: string;
}

export interface ICreator {
  id: string;
  name: string;
  email: string;
}
interface ITrack {
  id: string;
  name: string;
  status: string;
  visibility: string;
}
interface ISkill {
  id: string;
  category: string;
  skill: string;
  name: string;
}

export interface IContentTopic {
  identifier: string;
  name: string;
}

export interface IHomeRecommendationEntity {
  score: number;
  course: IContent;
  reasonsForRecommendation?: string[];
}

export interface IHomeRecommendationResponse {
  response: IHomeRecommendationEntity[];
}

export interface IValidResource {
  validIds: IResourceFormat[];
  invalidIds: string[];
}
interface IResourceFormat {
  lex_id: string;
  title: string;
}

// API Based
export interface IHierarchyResponse {
  content: IContent;
}
export interface IRecommendResponse {
  response: IContent[];
}
export interface IPostLearnResponse {
  response: IContent[];
}
export interface IIapAssessmentResponse {
  response: IContent[];
}
export interface IRecentPlaylistResponse {
  response: IContent[];
}
export interface IHomeRecommendationEntity {
  score: number;
  course: IContent;
  reasonsForRecommendation?: string[];
}
export interface IHomeRecommendationResponse {
  response: IHomeRecommendationEntity[];
}

// For Topics
export interface ITopic {
  id: string;
  date_created: string;
  date_modified: string;
  name: string;
  source: string;
  source_id: 0;
  source_source: string;
  source_status: string;
  status: string;
}
export interface ITopicRecommended {
  'concepts.name': string;
  count: number;
  id: string;
}

export interface IRecentPlaylistResponse {
  response: IContent[];
}

export interface IResourceParentFetchResponse {
  response: IResourceParents;
}

export interface IResourceParents {
  parents: {
    courses?: IContent[];
    learningPaths?: IContent[];
    modules?: IContent[];
  };
}

export interface IContact {
  id: string;
  name: string;
  email: string;
}

// For Iap
export interface IIapAssessmentResponse {
  response: IContent[];
}

export interface IIAPResponse {
  output: string;
  code: string;
  memory: string;
  time: string;
  langid: string;
  errors: string;
}

export interface IContentCardHash {
  continueLearning?: string;
  interestRecommendation?: string[];
  usageRecommendation?: string[];
}

// Learning Hub
export interface ITrainingOffering {
  content_id: string; // The course to which this offering belongs
  offering_id: string; // The identifier of the training offering itself
  start_dt: Date; // Start date + time
  end_dt: Date; // End date + time
  location: string; // Location where the training will be held
  slots_available: number; // Number of seats available for booking a slot
  educator: {
    // List of educators
    name: string;
    email: string;
  }[];
  isJIT: boolean; // To check if the offering is a Just-in-Time training.
  isVisibility?: boolean;
  deliveryType: 'Blended Classroom' | 'Virtual Classroom' | 'Classroom';
  hasAssessment: boolean;
  registered: boolean;
  eligible: boolean;
  reason_not_eligible?: string;
  ineligibility_reasons?: string[]; // For UI only
  sessions?: ITrainingSession[]; // For UI only
  time_zone?: string;
  registration_closure_date?: Date;
  content_feedback_required?: boolean;
  instructor_feedback_required?: boolean;
  content_feedback_form?: string;
  instructor_feedback_form?: string;
  submitting?: boolean;
}

export interface ITrainingSession {
  offering_id: string;
  session_id: string;
  start_dt: Date;
  end_dt: Date;
  start_time: string;
  end_time: string;
  building: string;
  classroom: string;
  educator: {
    name: string;
    email: string;
  }[];
}

export interface IJustInTimeTraining {
  raised_by: string;
  track_code: string;
  content_id: string;
  content_name: string;
  start_date: Date;
  no_of_participants: number;
  location_code: string;
  participant_profile: 'Beginner' | 'Intermediate' | 'Expert';
  training_level: 'Advanced' | 'Basic';
  additional_info: string;
  training_by_vendor: boolean;
}

// for UI
export type TFilterCategory = 'all' | 'learn' | 'practice' | 'assess';
