/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ISearchObj,
  IKhubResult,
  ISearchObjForView,
  IKhubViewResult,
  IKnowGraphVis,
  IKnowledgeGraph,
  ISearchObjForSearch,
  ITopicTaggerAction,
  ITopicTaggerResponse
} from '../models/khub.model';

const API_BASE_1 = '/clientApi/v2/khub/';
const API_BASE_2 = '/clientApi/v2/kgraph/';
// const API_BASE = 'http://kmserver11:3014/api/v1/';
// const API_BASE_2 = 'http://localhost:3016/api/v1/localData';
const apiEndPoints = {
  KHUB_DATA: `${API_BASE_2}post/graphData`,
  KHUB_TIMELINE: `${API_BASE_1}get/search?searchQuery=`,
  KHUB_MORE_RECS: `${API_BASE_1}get/moreLike?category=`,
  KHUB_TOPIC_TAGGER: `${API_BASE_1}post/topic`
};
@Injectable({
  providedIn: 'root'
})
export class KhubApiService {
  constructor(private http: HttpClient) {}

  fetchPersonalizedData(request: ISearchObj): Observable<IKhubResult> {
    return this.http.get<any>(
      `${apiEndPoints.KHUB_TIMELINE}${request.searchQuery}&from=${request.from}&size=${request.size}`
    );
  }
  fetchSearchData(request: ISearchObjForSearch): Observable<IKhubViewResult> {
    return this.http.get<any>(
      `${apiEndPoints.KHUB_TIMELINE}${request.searchQuery}&from=${request.from}&size=${request.size}&category=${
        request.category
      }&filter=${request.filter}`
    );
  }

  fetchViewData(request: ISearchObjForView): Observable<any> {
    return this.http.get<any>(`${apiEndPoints.KHUB_TIMELINE}&filter="itemId":["${request.itemId}"]`);
  }

  fetchMoreRecs(request: ISearchObjForView): Observable<any> {
    const source = request.category === 'promt' ? '' : request.category;
    return this.http.get<any>(
      `${apiEndPoints.KHUB_MORE_RECS}${source}&itemId=${request.itemId}&source=${request.source}`
    );
  }

  fetchVisData(request: IKnowGraphVis): Observable<IKnowledgeGraph> {
    return this.http.post<any>(apiEndPoints.KHUB_DATA, request);
  }

  postTopicTagger(request: ITopicTaggerAction): Observable<ITopicTaggerResponse> {
    return this.http.post<any>(apiEndPoints.KHUB_TOPIC_TAGGER, request);
  }
}
