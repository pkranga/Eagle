/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Injectable } from '@angular/core'
import { map } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http'
import {
  IWsEmailTextRequest,
  IWsEmailResponse,
  IWsEmailUserId,
  IWsUserFollow,
} from '../model/leadership-email.model'
import { Observable } from 'rxjs'

const RANDOM_ID_PER_USER = 0

export const API_SERVER_BASE = '/apis'
const PROTECTED_SLAG_V8 = `${API_SERVER_BASE}/protected/v8`

const API_END_POINTS = {
  EMAIL_TEXT: `${PROTECTED_SLAG_V8}/user/email/emailText`, // #POST
  EMAIL_TO_USERID: `${PROTECTED_SLAG_V8}/user/emailToUserId`,
  USER_FOLLOW_DATA: `${PROTECTED_SLAG_V8}/user/follow/fetchAll`, // #GET
  USER_FOLLOW: `${PROTECTED_SLAG_V8}/user/follow`, // #POST
  USER_UNFOLLOW: `${PROTECTED_SLAG_V8}/user/follow/unfollow`, // #POST
}

@Injectable({
  providedIn: 'root',
})
export class LeadershipService {
  constructor(private http: HttpClient) {}

  shareTextMail(req: IWsEmailTextRequest): Observable<IWsEmailResponse> {
    return this.http.post<any>(API_END_POINTS.EMAIL_TEXT, req).pipe(map(u => u.result))
  }

  get randomId() {
    return RANDOM_ID_PER_USER + 1
  }

  emailToUserId(email: string): Observable<IWsEmailUserId> {
    return this.http.get<IWsEmailUserId>(`${API_END_POINTS.EMAIL_TO_USERID}/${email}`)
  }

  //  Follow
  fetchUserFollow(userId: string): Observable<IWsUserFollow> {
    return this.http.post<IWsUserFollow>(`${API_END_POINTS.USER_FOLLOW_DATA}`, userId)
  }

  followUser(request: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.USER_FOLLOW, request)
  }
  unFollowUser(request: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.USER_UNFOLLOW, request)
  }
}
