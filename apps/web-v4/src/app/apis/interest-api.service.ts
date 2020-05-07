/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { slag, slagV2 } from '../constants/apiEndpoints.constant';
import { IApiResponse } from '../models/apiResponse';
import { ITopicRecommended, ITopic } from '../models/content.model';

const apiEndpoints = {
  userTopics: `${slag}/user/topic`, // GET | POST
  recommendedTopics: `${slagV2}/topic/recommend`
};

@Injectable({
  providedIn: 'root'
})
export class InterestApiService {
  constructor(private http: HttpClient) {}

  fetchSuggestedTopics(): Observable<string[]> {
    return this.http
      .get<IApiResponse<{ response: { topics: ITopicRecommended[] } }>>(`${apiEndpoints.recommendedTopics}`)
      .pipe(map(u => u.result.response.topics.map(topic => topic['concepts.name'])));
  }
  fetchUserTopics(): Observable<string[]> {
    return this.http
      .get<IApiResponse<{ response: { topics: ITopic[] } }>>(`${apiEndpoints.userTopics}?ts=${new Date().getTime()}`)
      .pipe(map(u => u.result.response.topics.map(topic => topic.name)));
  }
  modifyUserTopics(topics: string[]) {
    return this.http.post(apiEndpoints.userTopics, { topics });
  }
}
