/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
export type TPostKind = 'Blog' | 'Leadership-Blog' | 'Poll' | 'Query' | 'Reply' | 'Comment';
export type TTimelineType =
  | 'all'
  | 'myTimeline'
  | 'people'
  | 'tags'
  | 'groups'
  | 'unanswered'
  | 'myDrafts'
  | 'discussionForum';

export interface ITimelineRequestPartial {
  type: TTimelineType;
  postKind: TPostKind[];
  userId: string;
  sessionId: number;
  pgNo?: number;
  pgSize?: number;
  source?: ITimelinePostSource;
}

export interface ITimelineRequest extends ITimelineRequestPartial {
  org: string;
  rootOrg: string;
}

export interface ITimeline {
  hits: number;
  result: ITimelineResult[];
  newDataCount?: number;
  sessionId?: number;
}

export type TPostStatus = 'Active' | 'Inactive' | 'Draft';

export interface ITimelineResult {
  org: string;
  rootOrg: string;
  id: string;
  postKind: TPostKind;
  dtCreated: string;
  dtPublished: string;
  dtLastModified: string;
  lastEdited: {
    dtLastEdited: string;
    editorId: string;
  };
  activity: IPostActivity;
  activityEndDate: string;
  options: any[];
  postCreator: IPostCreator;
  recipients: any[];
  status: TPostStatus;
  postContent: IPostContent;
  tags: IPostTag[];
  threadContributors: IThreadContributor[];
  hasAcceptedAnswer: boolean;
  acceptedAnswers?: string;
  replyCount: number;
  latestReply: ITimelineResult;
  source: IPostSource;
}

export interface IPostCreator {
  postCreatorId: string;
  name: string;
  emailId: string;
}

export interface IThreadContributor {
  threadContributorId: string;
  name: string;
  emailId: string;
}

export interface IPostPublishRequestPartial {
  postKind: TPostKind;
  postCreator: string;
  postContent: IPostContent;
  tags?: IPostTag[];
  id?: string;
  pgNo?: number;
  pgSize?: number;
  dateCreated?: string;
  source?: IPostSource;
}

export interface IPostPublishRequest extends IPostPublishRequestPartial {
  org: string;
  rootOrg: string;
}

export interface IPostContent {
  title: string;
  abstract: string;
  body: string;
}

export interface IPostTag {
  id: string;
  name: string;
}

export interface IViewConversationRequestPartial {
  postId: string;
  userId: string;
  answerId: string;
  sessionId: number;
  postKind: TPostKind[];
  sortOrder?: TConversationSortOrder;
  pgNo?: number;
  pgSize?: number;
}

export type TConversationSortOrder = 'earliest-asc' | 'earliest-desc' | 'latest-asc' | 'latest-desc';

export interface IViewConversationRequest extends IViewConversationRequestPartial {
  rootOrg: string;
  org: string;
}

export interface IViewConversationResult {
  acceptedAnswer: ITimelineResult;
  idsList: string[];
  postCount: number;
  newPostCount: number;
  mainPost: ITimelineResult;
  replyPost: ITimelineResult[];
}

export interface IPostDeleteRequest {
  rootOrg: string;
  org: string;
  id: string;
  userId: string;
}

export interface IPostAutoComplete {
  query: string;
}

export interface IPostTimeLineQandA {
  status: boolean;
  data: ITimelineResult[];
  message: string;
}
export interface IPostActivity {
  activityData: {
    like: number;
    upVote: number;
    downVote: number;
    flag: number;
  };
  userActivity: {
    like: boolean;
    upVote: boolean;
    downVote: boolean;
    flag: boolean;
  };
}

export type TActivityType = 'downvote' | 'upvote' | 'like' | 'flag';
export interface IPostActivityUpdatePartialRequest {
  id: string;
  userId: string;
  activityType: TActivityType;
}

export type TPostCommentType = 'pre-defined' | 'custom';
export interface IPostFlagActivityUpdatePartialRequest extends IPostActivityUpdatePartialRequest {
  userComments: {
    commentType: TPostCommentType;
    comment: string;
  };
}

export interface IPostUpdateRequestPartial {
  postKind: TPostKind;
  meta: IPostContent;
  editor: string;
  addTags?: IPostTag[];
  removeTags?: IPostTag[];
  id?: string;
}

export interface IPostUpdateRequest extends IPostUpdateRequestPartial {
  rootOrg: string;
  org: string;
}

export interface IPostActivityUpdateRequest extends IPostActivityUpdatePartialRequest {
  rootOrg: string;
  org: string;
}

export interface IPostFlagActivityUpdateRequest extends IPostFlagActivityUpdatePartialRequest {
  rootOrg: string;
  org: string;
}

export type TReplyKind = 'Comment' | 'Reply';

export interface IPostCommentRequestPartial {
  postKind: TReplyKind;
  parentId: string;
  postCreator: string;
  postContent: {
    body: string;
  };
  source?: IPostSource;
}

export interface IPostCommentRequest extends IPostCommentRequestPartial {
  org: string;
  rootOrg: string;
}

export interface IAcceptAnswerPartial {
  acceptedAnswer: string;
  userId: string;
}

export interface IAcceptAnswer extends IAcceptAnswerPartial {
  rootOrg: string;
  org: string;
}

export interface IActivityUsersPartial {
  postId: string;
  activityType: TActivityType;
  pgNo?: number;
  pgSize?: number;
}

export interface IActivityUsers extends IActivityUsersPartial {
  rootOrg: string;
  org: string;
}

export interface IActivityUsersResult {
  total: number;
  users: Array<{ id: string; name: string; email: string }>;
}

export interface IPostSource {
  id: string;
  name: string;
}

export interface ITimelinePostSource {
  contentId: string;
  sourceName: string;
}

export interface IDiscussionForumInput extends ITimelinePostSource {
  initialPostCount?: number;
  title?: string;
  description?: string;
  isLoggedInUserRestricted?: boolean;
}

// MISC
export interface IDialogActivityUsers {
  postId: string;
  activityType: TActivityType;
}

// social search request
export interface IdateModified {
  from: string;
  to: string;
}
export interface ISocialSearchPartialRequest {
  userId: string;
  query: string;
  pageNo: number;
  pageSize: number;
  sessionId: number;
  postKind: TPostKind;
  filters?: {
    hashTags?: string[];
    tags?: string[];
    hasAcceptedAnswer?: boolean[];
    sourceName?: string[];
    sourceId?: string[];
    threadContributors?: string[];
    postCreator?: string[];
    dtLastModified?: IdateModified[];
  };
  locale: string;
  sort?: {}[];
}
export interface ISocialSearchRequest extends ISocialSearchPartialRequest {
  org: string;
  rootOrg: string;
}
export interface ISocialFilterContent {
  displayName: string;
  type: string;
  count: number;
}
export interface ISocialFilters {
  displayName: string;
  type: string;
  content: ISocialFilterContent[];
}
export interface ISocialSearchResultData {
  abstract: string;
  accessPaths: string[];
  activity: IPostActivity;
  activityEndDate: string | null;
  attachments: [];
  body: string;
  dtCreated: string;
  dtLastModified: string;
  dtPublished: string;
  hasAcceptedAnswer: boolean;
  highlight?: {
    tags?: string[];
    title?: string[];
    body?: string[];
  };
  hashTags: string[];
  id: string;
  likes: string;
  options: [];
  org: string;
  postCreator: IPostCreator;
  postKind: TPostKind;
  replyCount: number;
  rootOrg: string;
  source: {
    id: string;
    name: string;
  };
  status: string;
  tags: string[];
  threadContributors: IThreadContributor[];
  thumbnail: string;
  title: string;
  upVoteCount: number;
}
export interface ISocialSearchResult {
  total: number;
  result: ISocialSearchResultData[];
  filters: ISocialFilters[];
}
