/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  ITimeline,
  ITimelineRequest,
  IViewConversationRequest,
  IViewConversationResult,
  IPostPublishRequest,
  IPostDeleteRequest,
  IPostAutoComplete,
  IPostFlagActivityUpdateRequest,
  IPostActivityUpdateRequest,
  IPostCommentRequest,
  IPostUpdateRequest,
  IPostTag,
  IActivityUsers,
  IActivityUsersResult,
  ISocialSearchRequest,
  ISocialSearchResult
} from '../models/social.model';
import { Observable } from 'rxjs';

const API_BASE = '/clientApi/v2/social';

const apiEndPoints = {
  SOCIAL_TIMELINE: `${API_BASE}/post/timeline`,
  SOCIAL_VIEW_CONVERSATION: `${API_BASE}/post/viewConversation`,
  SOCIAL_POST_PUBLISH: `${API_BASE}/post/publish`,
  SOCIAL_POST_DRAFT: `${API_BASE}/post/draft`,
  SOCIAL_POST_UPDATE: `${API_BASE}/edit/meta`,
  SOCIAL_POST_DELETE: `${API_BASE}/post/delete`,
  SOCIAL_POST_ACTIVITY_UPDATE: `${API_BASE}/post/activity/create`,
  SOCIAL_POST_AUTOCOMPLETE: `${API_BASE}/post/autocomplete?pgno=0&pgsize=20`,
  SOCIAL_POST_ACCEPT_ANSWER: `${API_BASE}/post/acceptAnswer`,
  SOCIAL_POST_ACTIVITY_USERS: `${API_BASE}/post/activity/users`,
  SOCIAL_VIEW_SEARCH_RESULT: `${API_BASE}/post/search`
};

@Injectable({
  providedIn: 'root'
})
export class SocialApiService {
  constructor(private http: HttpClient) {}

  fetchTimelineData(request: ITimelineRequest): Observable<ITimeline> {
    return this.http.post<ITimeline>(apiEndPoints.SOCIAL_TIMELINE, request);
  }

  fetchPost(request: IViewConversationRequest): Observable<IViewConversationResult> {
    return this.http.post<IViewConversationResult>(apiEndPoints.SOCIAL_VIEW_CONVERSATION, request);
  }

  createPost(request: IPostPublishRequest | IPostCommentRequest) {
    return this.http.post<any>(apiEndPoints.SOCIAL_POST_PUBLISH, request);
  }

  updatePost(request: IPostUpdateRequest) {
    return this.http.put<any>(apiEndPoints.SOCIAL_POST_UPDATE, request);
  }

  draftPost(request: IPostPublishRequest) {
    return this.http.post<any>(apiEndPoints.SOCIAL_POST_DRAFT, request);
  }

  deletePost(request: IPostDeleteRequest): Observable<any> {
    return this.http.post<any>(apiEndPoints.SOCIAL_POST_DELETE, request);
  }

  updateActivity(request: IPostActivityUpdateRequest | IPostFlagActivityUpdateRequest): Observable<any> {
    return this.http.post<any>(apiEndPoints.SOCIAL_POST_ACTIVITY_UPDATE, request);
  }

  fetchActivityUsers(request: IActivityUsers): Observable<IActivityUsersResult> {
    return this.http.post<IActivityUsersResult>(apiEndPoints.SOCIAL_POST_ACTIVITY_USERS, request);
  }

  fetchAutoComplete(request: IPostAutoComplete): Observable<IPostTag[]> {
    return this.http.post<IPostTag[]>(apiEndPoints.SOCIAL_POST_AUTOCOMPLETE, request);
  }

  acceptAnswer(request): Observable<any> {
    return this.http.post<any>(apiEndPoints.SOCIAL_POST_ACCEPT_ANSWER, request);
  }

  getSearchResults(request: ISocialSearchRequest): Observable<ISocialSearchResult> {
    return this.http.post<any>(apiEndPoints.SOCIAL_VIEW_SEARCH_RESULT, request);
  }
}
