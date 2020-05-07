/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { NsDiscussionForum } from '@ws-widget/collection'
import { NsSocial } from '../models/social.model'

const PROTECTED_SLAG_V8 = '/apis/protected/v8'

const API_END_POINTS = {
  SOCIAL_POST_DRAFT: `${PROTECTED_SLAG_V8}/social/post/draft`,
  SOCIAL_POST_AUTOCOMPLETE: `${PROTECTED_SLAG_V8}/social/post/autocomplete?pgno=0&pgsize=10`,
  SOCIAL_POST_ACCEPT_ANSWER: `${PROTECTED_SLAG_V8}/social/post/acceptAnswer`,
}

@Injectable({
  providedIn: 'root',
})
export class WsSocialService {
  constructor(private http: HttpClient) { }

  fetchAutoComplete(queryStr: string): Observable<NsDiscussionForum.IPostTag[]> {
    const req: NsSocial.IPostAutoComplete = {
      query: queryStr,
    }
    return this.http.post<NsDiscussionForum.IPostTag[]>(API_END_POINTS.SOCIAL_POST_AUTOCOMPLETE, req)
  }
  draftPost(request: NsDiscussionForum.IPostPublishRequest) {
    return this.http.post(API_END_POINTS.SOCIAL_POST_DRAFT, request)
  }
  acceptAnswer(request: NsSocial.IAcceptAnswer): Observable<any> {
    return this.http.post<any>(API_END_POINTS.SOCIAL_POST_ACCEPT_ANSWER, request)
  }
}
