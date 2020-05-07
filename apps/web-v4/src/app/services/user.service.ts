/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { UserApiService } from '../apis/user-api.service';
import { IContent } from '../models/content.model';
import { IUserNotifications } from '../models/notification.model';
import {
  IUserFollow,
  IUserFollowEntity,
  IUserProfileGraph,
  IUserRealTimeProgressUpdateRequest
} from '../models/user.model';
import { IQuizSubmitRequest, IQuizSubmitResponse } from '../modules/plugin-quiz/model/quiz.model';
import { CacheService } from './cache.service';
import { ConfigService } from './config.service';

interface IPlaylistUpdate {
  content: IContent;
  type: string;
}

const apiEndpoints = {
  pref: '/clientApi/v2/user/preference',
  roles: '/clientApi/v2/user/roles'
};

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userRoles: Set<string> = new Set();
  pref: any = null;

  public playlistChangeNotifier = new BehaviorSubject<IPlaylistUpdate>({
    content: {} as IContent,
    type: ''
  });
  private progressHash: BehaviorSubject<{ [id: string]: number }> = null;
  constructor(
    private http: HttpClient,
    private userApiSvc: UserApiService,
    private cacheSvc: CacheService,
    private configSvc: ConfigService
  ) { }

  async updateUserPref() {
    try {
      this.pref = await this.http.get(apiEndpoints.pref).toPromise();
    } catch (error) { }
    return this.pref;
  }

  async updateUserRoles(): Promise<Set<string>> {
    try {
      const userRolesResponse = await this.http.get<any>(apiEndpoints.roles).toPromise();
      const roles = userRolesResponse.result.response;

      // _________ Remember to Remove _____________
      // const roles = userRolesResponse.result.response;
      // console.log(roles);
      // roles.push('social');
      // roles.push('khub');
      // roles.push('infytq-cert-admin');
      // console.log(roles);
      // _________ Remember to Remove _____________

      if (Array.isArray(roles)) {
        this.userRoles = new Set(roles);
      }
    } catch (error) { }
    return this.userRoles;
  }

  getProgressFor(id: string): Observable<number> {
    if (this.progressHash === null) {
      this.progressHash = new BehaviorSubject(null);
      this.updateProgressHash();
    }
    return this.progressHash.pipe(
      filter(hash => hash !== null),
      map(hash => {
        return hash[id];
      })
    );
  }

  getProgressHash(): Observable<{ [id: string]: number }> {
    if (this.progressHash === null) {
      this.progressHash = new BehaviorSubject(null);
      this.updateProgressHash();
    }
    return this.progressHash.pipe(
      filter(hash => hash !== null),
      map(hash => {
        return hash;
      })
    );
  }

  private updateProgressHash() {
    this.fetchUserProgressHash().subscribe(data => {
      this.progressHash.next(data);
    });
  }

  fetchUserProgressHash(email?: string, ids?: string[]): Observable<{ [id: string]: number }> {
    return this.userApiSvc.fetchContentProgressHash(email, ids);
  }

  fetchUserGraphProfile(): Observable<IUserProfileGraph> {
    if (this.cacheSvc.hasCachedCopy('userGraphProfile')) {
      return of(this.cacheSvc.getCachedCopy<IUserProfileGraph>('userGraphProfile'));
    }
    return this.userApiSvc.fetchGraphProfile().pipe(
      tap(data => {
        this.cacheSvc.cacheData('userGraphProfile', data);
      })
    );
  }
  fetchGraphProfileFromUuid(uuid: string): Observable<IUserProfileGraph> {
    return this.userApiSvc.fetchGraphProfileFromUuid(uuid);
  }
  fetchMultipleUserGraphProfile(emails: string[]): Observable<IUserProfileGraph[]> {
    return this.userApiSvc.fetchAuthorGraphProfiles(emails);
  }
  fetchUserRecentPlaylist(): Observable<IContent[]> {
    return this.userApiSvc.fetchRecentPlaylist();
  }
  fetchLikes() {
    return this.userApiSvc.fetchLikes();
  }
  fetchLikesWithUuid(uuid: string) {
    return this.userApiSvc.fetchLikes(uuid);
  }
  fetchUserRecentBadge(): Observable<IUserNotifications> {
    return this.userApiSvc.fetchRecentBadge();
  }
  submitFeedback(request): Observable<any> {
    return this.userApiSvc.feedbackSubmit(request);
  }

  // USER Preferences
  fetchUserPreference(email?: string): Observable<any> {
    return this.userApiSvc.fetchUserPreference(email);
  }
  updateUserPreference(req: any): Observable<any> {
    return this.userApiSvc.updateUserPreference(req);
  }

  // USER FOLLOW
  fetchUserFollowers(userId: string): Observable<IUserFollowEntity[]> {
    return this.userApiSvc.fetchUserFollowers(userId);
  }
  fetchUserFollowing(userId: string): Observable<IUserFollowEntity[]> {
    return this.userApiSvc.fetchUserFollowing(userId);
  }
  fetchUserFollow(userId: string): Observable<IUserFollow> {
    return this.userApiSvc.fetchUserFollow(userId);
  }
  followUser(request): Observable<any> {
    return this.userApiSvc.followUser(request);
  }
  unFollowUser(request): Observable<any> {
    return this.userApiSvc.unFollowUser(request);
  }

  // EMAIL TO UUID
  emailToUserId(email: string) {
    return this.userApiSvc.emailToUserId(email);
  }

  // REAL TIME PROGRESS UPDATE
  realTimeProgressUpdate(contentId: string, request: IUserRealTimeProgressUpdateRequest): Observable<any> {
    return this.userApiSvc.realTimeProgressUpdate(contentId, request);
  }

  // quiz submit v1
  submitQuiz(req: IQuizSubmitRequest): Observable<IQuizSubmitResponse> {
    if (this.configSvc.instanceConfig.platform.updateRealTimeProgress) {
      return this.submitQuizV2(req);
    } else {
      return this.userApiSvc.submitQuiz(req);
    }
  }

  // quiz submit v1
  submitQuizV2(req: IQuizSubmitRequest): Observable<IQuizSubmitResponse> {
    return this.userApiSvc.submitQuizV2(req);
  }

  // user playlist content fetch
  fetchPlaylistContent(playlistId: string): Observable<any> {
    return this.userApiSvc.fetchPlaylistContent(playlistId);
  }
}
