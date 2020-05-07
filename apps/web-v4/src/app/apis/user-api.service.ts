/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Jsonp } from '@angular/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { tap } from 'rxjs/operators';

import {
  IEmailUserId,
  IUserProfile,
  IProfileResponse,
  IUserProfileGraph,
  IUserProfileGraphResponse,
  IAuthorsProfileGraphResponse,
  IIapUserProfile,
  IUserFollow,
  IUserFollowEntity,
  IUserRealTimeProgressUpdateRequest
} from '../models/user.model';
import { IApiResponse } from '../models/apiResponse';
import { IContent, IIapAssessmentResponse, IIAPResponse, IRecentPlaylistResponse } from '../models/content.model';
import { IEmailRequest, IEmailResponse, IEmailTextRequest } from '../models/email.model';
import { MSToken } from '../models/msToken.model';
import { ICertificationRequest, ICertification, ICertificationResponse } from '../models/certification.model';
import { IUserNotifications, IUserNotificationsApiResponse } from '../models/notification.model';
import {
  IUserCourseProgress,
  IUserCourseChildProgressApiResponse,
  IUserCourseProgressResponse,
  IUserCourseProgressApiResponse
} from '../models/dashboard.model';
import { IQuizSubmitRequest, IQuizSubmitResponse } from '../modules/plugin-quiz/model/quiz.model';
import { IBadgeResponse } from '../models/badge.model';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {
  API_BASE = '/clientApi/v2';
  USER_API = `${this.API_BASE}/user`;
  API_BASE_V4 = '/clientApi/v4';
  USER_API_V4 = `${this.API_BASE_V4}/user`;
  apiEndpoints = {
    // user.badge
    USER_BADGE: `${this.USER_API}/badge`, // #GET?email
    USER_BADGES_UPDATE: `${this.USER_API}/badge/update`,
    USER_BADGE_RECENT: `${this.USER_API}/badge/notification`, // #GET
    // user.bookmark
    USER_BOOKMARK: `${this.USER_API}/bookmark`, // #GET #POST|DELETE/:contentId
    // user.dashboard
    USER_DASHBOARD_COURSE: `${this.USER_API}/dashboard/course`, // #GET?pageNumber,pageSize
    USER_DASHBOARD_COURSE_DETAILS: `${this.USER_API}/dashboard/course/details`,
    // user.feedback
    USER_FEEDBACK: `${this.USER_API}/feedback`, // #POST
    // user.certification
    USER_CERTIFICATION: `${this.USER_API}/certification`, // #POST

    // user.recent playlist
    USER_RECENT_PLAYLIST: `${this.USER_API}/playlist/recentPlaylist`, // #GET
    // user.like
    USER_LIKE: `${this.USER_API}/like`, // #GET #POST|DELETE/:contnetId
    // user.iap-assessments
    USER_IAP_ASSESSMENTS: `${this.USER_API}/iap`,
    // user.profile
    USER_PROFILE: `${this.USER_API}/profile`, // #GET|POST ##GET NOT IMPLEMENTED
    USER_PROFILE_GRAPH: `${this.USER_API}/profile/graph/data/new`, // #GET
    USER_PROFILE_GRAPH_EMAIL: `${this.USER_API}/profile/graph`, // #GET/:emailId #GET?:ids
    USER_PROFILE_GRAPH_UUID: `${this.USER_API}/profile/graph/v2`, // #GET/:uuid #GET?:ids
    // iap.profile
    IAP_USER_PROFILE: `${this.USER_API}/profile/iap`, // #POST
    // user.progress
    USER_PROGRESS: `${this.USER_API}/progress/hash`, // #GET
    // user.share
    USER_SHARE: `${this.USER_API}/share`, // #POST
    USER_SHARE_TEXT: `${this.USER_API}/share/shareText`, // #POST

    // user.token
    USER_SHAREPOINT_TOKEN: `${this.USER_API}/token`, // #GET?:email:code:redirecturi ## email|(code&redirecturi)
    // user.roles
    USER_ROLES: `${this.USER_API}/roles`, // #GET
    // user.userid
    USER_EMAIL_USERID: `${this.USER_API}/emailToUserid`, // #GET /:emailId
    // IAP Compilation
    USER_HANDSON_EXERCISE: `${this.USER_API}/code/execute`,
    // preferences
    USER_PREFERENCE: `${this.USER_API}/preference`, // #GET|POST
    // follow
    USER_FOLLOWERS: `${this.USER_API}/follow/followers`, // #GET
    USER_FOLLOWING: `${this.USER_API}/follow/following`, // #GET
    USER_FOLLOW_DATA: `${this.USER_API}/follow/fetchAll`, // #GET
    USER_FOLLOW: `${this.USER_API}/follow`, // #POST
    USER_UNFOLLOW: `${this.USER_API}/follow/unfollow`, // #POST
    // progress update
    PROGRESS_UPDATE: `${this.USER_API}/realTimeProgress/update`, // #POST
    // quiz submit
    ASSESSMENT_SUBMIT: `${this.USER_API}/evaluate/assessment/submit`, // #POST
    ASSESSMENT_SUBMIT_V2: `${this.USER_API}/evaluate/assessment/submit/v2`, // #POST
    // playlist content fetch
    USER_PLAYLIST_CONTENT_FETCH: `${this.USER_API_V4}/playlist-content` // #GET
    // goal content fetch
  };

  constructor(private http: HttpClient, private jsonp: Jsonp) { }

  emailToUserId(emailId: string): Observable<IEmailUserId> {
    return this.http.get<IEmailUserId>(this.apiEndpoints.USER_EMAIL_USERID + '/' + emailId);
  }
  addProfile(): Observable<IUserProfile> {
    return this.http
      .post<IApiResponse<IProfileResponse>>(this.apiEndpoints.USER_PROFILE, {})
      .pipe(map(u => u.result.response));
  }
  fetchProfile(profileId?: string): Observable<IUserProfile> {
    const url = profileId ? this.apiEndpoints.USER_PROFILE + profileId : this.apiEndpoints.USER_PROFILE;
    return this.http.get<IApiResponse<IProfileResponse>>(url).pipe(map(u => u.result.response));
  }
  fetchGraphProfile(): Observable<IUserProfileGraph> {
    return this.http
      .get<IApiResponse<IUserProfileGraphResponse>>(this.apiEndpoints.USER_PROFILE_GRAPH)
      .pipe(map(res => res.result.response));
  }
  fetchGraphProfileFromEmail(email: string): Observable<IUserProfileGraph> {
    return this.http
      .get<IApiResponse<IUserProfileGraphResponse>>(`${this.apiEndpoints.USER_PROFILE_GRAPH_EMAIL}/${email}`)
      .pipe(map(res => res.result.response));
  }
  fetchGraphProfileFromUuid(uuid: string): Observable<IUserProfileGraph> {
    return this.http
      .get<IApiResponse<IUserProfileGraphResponse>>(`${this.apiEndpoints.USER_PROFILE_GRAPH_UUID}/${uuid}`)
      .pipe(map(res => res.result.response));
  }
  fetchAuthorGraphProfiles(emails: string[]): Observable<IUserProfileGraph[]> {
    return this.http
      .get<IApiResponse<IAuthorsProfileGraphResponse>>(`${this.apiEndpoints.USER_PROFILE_GRAPH_EMAIL}?ids=${emails}`)
      .pipe(map(res => res.result.response));
  }
  // IAP Profile fetch
  fetchUserProfileIap(): Observable<IIapUserProfile> {
    return this.http.get<IIapUserProfile>(this.apiEndpoints.IAP_USER_PROFILE);
  }
  // USER iap assessments
  fetchIapAssessments(): Observable<IContent[]> {
    return this.http.get<IApiResponse<IIapAssessmentResponse>>(this.apiEndpoints.USER_IAP_ASSESSMENTS).pipe(
      map(contentResponse => {
        return contentResponse.result.response;
      })
    );
  }
  // USER code exercises
  handsOnExercise(exerciseData): Observable<IIAPResponse> {
    return this.http.post<IIAPResponse>(this.apiEndpoints.USER_HANDSON_EXERCISE, exerciseData);
  }

  // USER Recent Playlist
  fetchRecentPlaylist(): Observable<IContent[]> {
    return this.http
      .get<IApiResponse<IRecentPlaylistResponse>>(this.apiEndpoints.USER_RECENT_PLAYLIST)
      .pipe(map(u => u.result.response));
  }

  // Badges
  getBadges(email?: string): Observable<IBadgeResponse> {
    return this.http
      .get<IApiResponse<{ response: IBadgeResponse }>>(this.apiEndpoints.USER_BADGE + (email ? `?email=${email}` : ''))
      .pipe(map(res => res.result.response));
  }
  // Badges Update
  updateBadges(): Observable<any> {
    return this.http.patch(this.apiEndpoints.USER_BADGES_UPDATE, {});
  }

  // USER BOOKMARK
  fetchBookmark(): Observable<string[]> {
    // return this.http.get<IContent[]>(`${USER_BOOKMARK}?pageNumber=5&pageSize=0`)
    return this.http
      .get<IContent[]>(this.apiEndpoints.USER_BOOKMARK)
      .pipe(
        tap(contents => {
          // this.cache.addResources(contents);
        })
      )
      .pipe(map(u => u.map(x => x.identifier)));
  }
  addBookmark(contentId: string): Observable<boolean> {
    return this.http.post<boolean>(this.apiEndpoints.USER_BOOKMARK + '/' + contentId, {});
  }
  deleteBookmark(contentId: string): Observable<boolean> {
    return this.http.delete<boolean>(this.apiEndpoints.USER_BOOKMARK + '/' + contentId);
  }
  // USER LIKE
  fetchLikes(userId?: string): Observable<string[]> {
    const url = this.apiEndpoints.USER_LIKE + `?ts=${new Date().getTime()}` + (userId ? `&userId=${userId}` : '');
    return this.http.get<string[]>(url);
  }
  addLike(contentId: string): Observable<boolean> {
    return this.http.post<boolean>(this.apiEndpoints.USER_LIKE + '/' + contentId, {});
  }
  deleteLike(contentId: string): Observable<boolean> {
    return this.http.delete<boolean>(this.apiEndpoints.USER_LIKE + '/' + contentId);
  }
  // USER Share
  addShare(req: IEmailRequest): Observable<IEmailResponse> {
    return this.http.post<any>(this.apiEndpoints.USER_SHARE, req).pipe(map(u => u.result));
  }

  shareTextMail(req: IEmailTextRequest): Observable<IEmailResponse> {
    return this.http.post<any>(this.apiEndpoints.USER_SHARE_TEXT, req).pipe(map(u => u.result));
  }
  // USER Tokens

  getMsToken(email: string) {
    return this.http.get<MSToken>(this.apiEndpoints.USER_SHAREPOINT_TOKEN + `?email=${email}`);
  }
  getMsTokenUsingCode(code) {
    return this.http.get<MSToken>(
      `${this.apiEndpoints.USER_SHAREPOINT_TOKEN}?code=${code}&redirecturi=${location.origin + location.pathname}`
    );
  }

  // USER Content
  fetchUserRoles(): Observable<Set<string>> {
    return this.http.get<IApiResponse<{ response: string[] }>>(this.apiEndpoints.USER_ROLES).pipe(
      map(u => {
        return new Set(u.result.response);
      })
    );
  }
  // User internet or intranet
  checkIfIntranet(): Observable<boolean> {
    const testUrl = 'https://codehub-repo/';
    return Observable.create(observer => {
      const done = (isOnIntranet: boolean) => {
        observer.next(isOnIntranet);
        observer.complete();
      };
      this.jsonp.request(testUrl).subscribe(
        () => {
          done(true);
        },
        error => {
          // console.log(error)
          done(Boolean(error._body));
        }
      );
    });
  }
  // Certification
  fetchCertification(request: ICertificationRequest): Observable<ICertification> {
    return this.http
      .post<IApiResponse<ICertificationResponse>>(this.apiEndpoints.USER_CERTIFICATION, { request })
      .pipe(map(u => u.result && u.result.resultList));
  }

  fetchRecentBadge(): Observable<IUserNotifications> {
    return this.http
      .get<IApiResponse<IUserNotificationsApiResponse>>(this.apiEndpoints.USER_BADGE_RECENT)
      .pipe(map(notifications => notifications.result.response));
  }

  // For Dashboard : Progress Page
  fetchContentProgressHash(email?: string, ids?: string[]): Observable<{ [id: string]: number }> {
    let queryUrl: string;
    if (ids && ids.length > 0) {
      queryUrl = `${this.apiEndpoints.USER_PROGRESS}?contentIds=${ids.join(',')}`;
      if (email) {
        queryUrl += `&email=${email}`;
      }
    } else {
      queryUrl = this.apiEndpoints.USER_PROGRESS;
      if (email) {
        queryUrl += `?email=${email}`;
      }
    }
    return this.http.get<{ [id: string]: number }>(queryUrl);
  }
  fetchContentProgress(contentIds: string[]): Observable<IUserCourseProgress> {
    return this.http
      .post<IUserCourseChildProgressApiResponse>(this.apiEndpoints.USER_DASHBOARD_COURSE_DETAILS, contentIds)
      .pipe(map(data => data.result.response));
  }
  fetchCourseProgress(
    pageNo: number,
    pageSize: number,
    type: string,
    cType: string
  ): Observable<IUserCourseProgressResponse> {
    return this.http
      .get<IUserCourseProgressApiResponse>(
        `${
        this.apiEndpoints.USER_DASHBOARD_COURSE
        }?pageNumber=${pageNo}&pageSize=${pageSize}&status=${type}&contentType=${cType}`
      )
      .pipe(
        map(data => {
          return data.result.response;
        })
      );
  }
  feedbackSubmit(data): Observable<any> {
    // converting rating to string as per API request contract
    if (data.rating) {
      data.rating = data.rating.toString();
    }
    return this.http.post<any>(this.apiEndpoints.USER_FEEDBACK, { request: data }).pipe(
      map(response => {
        return response.result;
      })
    );
  }

  // USER Preferences
  fetchUserPreference(email?: string): Observable<any> {
    return this.http.get<any>(this.apiEndpoints.USER_PREFERENCE + (email ? `/${email}` : ''));
  }

  updateUserPreference(req: any): Observable<any> {
    return this.http.put<any>(this.apiEndpoints.USER_PREFERENCE, {
      preferences: req
    });
  }

  // USER FOLLOW
  fetchUserFollowers(userId: string): Observable<IUserFollowEntity[]> {
    return this.http.get<any>(this.apiEndpoints.USER_FOLLOWERS + '/' + userId);
  }
  fetchUserFollowing(userId: string): Observable<IUserFollowEntity[]> {
    return this.http.get<any>(this.apiEndpoints.USER_FOLLOWING + '/' + userId);
  }
  fetchUserFollow(userId: string): Observable<IUserFollow> {
    return this.http.get<IUserFollow>(this.apiEndpoints.USER_FOLLOW_DATA + '/' + userId);
  }
  followUser(request): Observable<any> {
    return this.http.post<any>(this.apiEndpoints.USER_FOLLOW, request);
  }
  unFollowUser(request): Observable<any> {
    return this.http.post<any>(this.apiEndpoints.USER_UNFOLLOW, request);
  }

  // REAL TIME PROGRESS UPDATE
  realTimeProgressUpdate(contentId: string, request: IUserRealTimeProgressUpdateRequest): Observable<any> {
    return this.http.post(this.apiEndpoints.PROGRESS_UPDATE + '/' + contentId, request);
  }

  // QUIZ SUBMIT API v1
  submitQuiz(req: IQuizSubmitRequest): Observable<IQuizSubmitResponse> {
    return this.http
      .post<IApiResponse<{ response: IQuizSubmitResponse }>>(this.apiEndpoints.ASSESSMENT_SUBMIT, { request: req })
      .pipe(map(res => res.result.response));
  }

  // QUIZ SUBMIT API v2
  submitQuizV2(req: IQuizSubmitRequest): Observable<IQuizSubmitResponse> {
    return this.http.post<IQuizSubmitResponse>(this.apiEndpoints.ASSESSMENT_SUBMIT_V2, req);
  }

  // GOALS CONTENT FETCH
  fetchGoalContent(goalId: string) {
    return this.http.get<any>(this.apiEndpoints.USER_FOLLOWERS + '/' + goalId);
  }
  // PLAYLISTS CONTENT FETCH
  fetchPlaylistContent(playlistId: string) {
    return this.http.get<any>(this.apiEndpoints.USER_PLAYLIST_CONTENT_FETCH + '/' + playlistId);
  }
}
