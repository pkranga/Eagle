/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SocialApiService } from '../apis/social-api.service';
import {
  ITimeline,
  ITimelineRequestPartial,
  ITimelineRequest,
  IViewConversationRequestPartial,
  IViewConversationResult,
  IViewConversationRequest,
  IPostPublishRequestPartial,
  IPostPublishRequest,
  IPostDeleteRequest,
  IPostAutoComplete,
  IPostActivityUpdatePartialRequest,
  IPostFlagActivityUpdatePartialRequest,
  IPostActivityUpdateRequest,
  IPostFlagActivityUpdateRequest,
  IPostCommentRequest,
  IPostCommentRequestPartial,
  IPostUpdateRequestPartial,
  IPostUpdateRequest,
  IPostTag,
  IAcceptAnswerPartial,
  IAcceptAnswer,
  IActivityUsersPartial,
  IActivityUsers,
  IActivityUsersResult,
  ISocialSearchPartialRequest,
  ISocialSearchRequest
} from '../models/social.model';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class SocialService {
  constructor(private socialApiSvc: SocialApiService, private configSvc: ConfigService) {}

  fetchTimelineData(request: ITimelineRequestPartial): Observable<ITimeline> {
    const req: ITimelineRequest = {
      ...request,
      org: this.configSvc.instanceConfig.platform.org,
      rootOrg: this.configSvc.instanceConfig.platform.rootOrg
    };
    return this.socialApiSvc.fetchTimelineData(req);
  }

  fetchConversationData(request: IViewConversationRequestPartial): Observable<IViewConversationResult> {
    const req: IViewConversationRequest = {
      ...request,
      org: this.configSvc.instanceConfig.platform.org,
      rootOrg: this.configSvc.instanceConfig.platform.rootOrg
    };
    return this.socialApiSvc.fetchPost(req);
  }

  publishPost(request: IPostPublishRequestPartial): Observable<any> {
    const req: IPostPublishRequest = {
      ...request,
      org: this.configSvc.instanceConfig.platform.org,
      rootOrg: this.configSvc.instanceConfig.platform.rootOrg
    };
    return this.socialApiSvc.createPost(req);
  }

  updatePost(request: IPostUpdateRequestPartial): Observable<any> {
    const req: IPostUpdateRequest = {
      ...request,
      org: this.configSvc.instanceConfig.platform.org,
      rootOrg: this.configSvc.instanceConfig.platform.rootOrg
    };
    return this.socialApiSvc.updatePost(req);
  }

  draftPost(request: IPostPublishRequestPartial): Observable<any> {
    const req: IPostPublishRequest = {
      ...request,
      org: this.configSvc.instanceConfig.platform.org,
      rootOrg: this.configSvc.instanceConfig.platform.rootOrg
    };
    return this.socialApiSvc.draftPost(req);
  }

  deletePost(postId: string, userId: string): Observable<any> {
    const req: IPostDeleteRequest = {
      org: this.configSvc.instanceConfig.platform.org,
      rootOrg: this.configSvc.instanceConfig.platform.rootOrg,
      id: postId,
      userId
    };
    return this.socialApiSvc.deletePost(req);
  }

  updateActivity(request: IPostActivityUpdatePartialRequest | IPostFlagActivityUpdatePartialRequest) {
    const req: IPostActivityUpdateRequest | IPostFlagActivityUpdateRequest = {
      org: this.configSvc.instanceConfig.platform.org,
      rootOrg: this.configSvc.instanceConfig.platform.rootOrg,
      ...request
    };
    return this.socialApiSvc.updateActivity(req);
  }

  fetchAutoComplete(queryStr: string): Observable<IPostTag[]> {
    const req: IPostAutoComplete = {
      query: queryStr
    };
    return this.socialApiSvc.fetchAutoComplete(req);
  }

  postReplyOrComment(request: IPostCommentRequestPartial): Observable<any> {
    const req: IPostCommentRequest = {
      org: this.configSvc.instanceConfig.platform.org,
      rootOrg: this.configSvc.instanceConfig.platform.rootOrg,
      ...request
    };
    return this.socialApiSvc.createPost(req);
  }

  acceptAnswer(request: IAcceptAnswerPartial): Observable<any> {
    const req: IAcceptAnswer = {
      org: this.configSvc.instanceConfig.platform.org,
      rootOrg: this.configSvc.instanceConfig.platform.rootOrg,
      ...request
    };
    return this.socialApiSvc.acceptAnswer(req);
  }

  fetchActivityUsers(request: IActivityUsersPartial): Observable<IActivityUsersResult> {
    const req: IActivityUsers = {
      org: this.configSvc.instanceConfig.platform.org,
      rootOrg: this.configSvc.instanceConfig.platform.rootOrg,
      ...request
    };
    return this.socialApiSvc.fetchActivityUsers(req);
  }

  fetchSocialSearchUsers(request: ISocialSearchPartialRequest) {
    const req: ISocialSearchRequest = {
      org: this.configSvc.instanceConfig.platform.org,
      rootOrg: this.configSvc.instanceConfig.platform.rootOrg,
      ...request
    };
    return this.socialApiSvc.getSearchResults(req);
  }
}
