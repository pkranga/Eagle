/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { IApiResponse } from '../models/apiResponse';
import { ICatalog } from '../models/catalog.model';
import {
  IContent,
  IHierarchyResponse,
  IHomeRecommendationEntity,
  IHomeRecommendationResponse,
  IRecommendResponse,
  IResourceParentFetchResponse,
  IResourceParents,
  IValidResource,
  TContentRecommendationType,
  TContentRequestType,
  TRecommendationGroupType,
  IPostLearnResponse
} from '../models/content.model';
import { ISearchApiResponse, ISearchApiResult, ISearchRequest } from '../models/searchResponse.model';

@Injectable({
  providedIn: 'root'
})
export class ContentApiService {
  API_BASE_V2 = '/clientApi/v2';
  API_BASE_V4 = '/clientApi/v4';
  USER_API = `${this.API_BASE_V2}/user`;

  apiEndpoints = {
    CATALOG: `${this.API_BASE_V2}/catalog`,
    CONTENT: `${this.API_BASE_V2}/content`, // #GET/:contentId[hierarchy]
    CONTENT_MULTIPLE: `${this.API_BASE_V2}/content/multiple`, // #POST body: ids array
    CONTENT_AUTHORED: `${this.API_BASE_V2}/content/authored`, // #POST body: emailIds array
    CONTENT_PARENT: `${this.API_BASE_V2}/content/parents`, // #GET/:contentId[parents]
    CONTENT_META_AUTOCOMPLETE: `${this.API_BASE_V2}/content/autocomplete`, // #GET?q
    CONTENT_ADD_VIEW: `${this.API_BASE_V2}/content/view`, // #PATCH/:contentId
    CONTENT_SEARCH: `${this.API_BASE_V2}/content/search`, // #POST
    CONTENT_SEARCH_V3: `${this.API_BASE_V2}/content/searchv3`, // #POST
    CONTENT_SEARCH_V4: `${this.API_BASE_V2}/content/searchv4`, // #POST
    CONTENT_VALID_RESOURCE_CHECK: `${this.API_BASE_V2}/content/checkvalidresource`, // #POST
    RECOMMENDATIONS: `${this.API_BASE_V2}/recommend/recommendations`, // #GET/:type ## type=trending|new|popular
    RECOMMEND_COURSE: `${this.API_BASE_V2}/recommend/course`, // #GET/:type ## type=trending|new|popular
    RECOMMEND_INTEREST_BASED: `${this.API_BASE_V2}/recommend/interestBased`, // #GET?pageSize:pageNumber
    RECOMMEND_USAGE_BASED: `${this.API_BASE_V2}/recommend/usageBased`, // #GET?pageSize:pageNumber
    USER_SEARCH_AUTOCOMPLETE: `${this.USER_API}/search/autocomplete`, // #GET/?q
    POST_LEARN: `${this.API_BASE_V4}/post-learn`, // GET /:contentId
    // #GET?topicname:query
    // CONCEPT_AUTOCOMPLETE: 'http://kmserver11:3015/api/v1/topicac?topicname='
    CONCEPT_AUTOCOMPLETE: `${this.API_BASE_V2}/concept/get/concepts?topicname=`
  };
  constructor(private http: HttpClient) { }

  // CONTENT
  autocompleteMeta(query: string): Observable<{ name: string; score: number }[]> {
    return this.http.get<{ name: string; score: number }[]>(
      `${this.apiEndpoints.CONTENT_META_AUTOCOMPLETE}?q=${query}`
    );
  }
  autocompleteUserHistory(query: string): Observable<{ name: string; score: number }[]> {
    return this.http.get<{ name: string; score: number }[]>(`${this.apiEndpoints.USER_SEARCH_AUTOCOMPLETE}?q=${query}`);
  }

  autocompleteConcepts(query: string): Observable<{ id: string; name: string }[]> {
    return this.http.get<{ id: string; name: string }[]>(`${this.apiEndpoints.CONCEPT_AUTOCOMPLETE}${query}`);
  }

  fetchContentRecommendations(type: TContentRequestType, pageSize = 15): Observable<IContent[]> {
    let url: string;
    switch (type) {
      case 'latest':
        url = this.apiEndpoints.RECOMMEND_COURSE + '/new';
        break;
      case 'popular':
        url = this.apiEndpoints.RECOMMEND_COURSE + '/popular';
        break;
    }

    url += `?pageSize=${pageSize}&pageNumber=0`;
    return this.http
      .get<IApiResponse<IRecommendResponse>>(url)
      .pipe(
        map(contentResponse => {
          return contentResponse.result.response || [];
        })
      )
      .pipe(
        tap(contents => {
          if (contents) {
            // this.cache.addResources(contents);
            // this.cache.addOtherResource(type, contents.map(u => u.identifier));
          }
        })
      );
  }
  fetchHomeGroupRecommendations(
    recommendationType: TContentRecommendationType = 'org',
    recommendationGroupType: TRecommendationGroupType,
    pageSize: number = 20,
    pageNumber: number = 0
  ): Observable<IContent[]> {
    const subUrl = recommendationGroupType === 'all' ? '' : '/' + recommendationGroupType;
    const url =
      this.apiEndpoints.RECOMMENDATIONS +
      subUrl +
      `?recommendationType=${recommendationType}&pageSize=${pageSize}&pageNumber=${pageNumber}`;
    return this.http.get<IApiResponse<{ response: IContent[] }>>(url).pipe(
      // tap(u => console.log(recommendationGroupType, recommendationType, url, u)),
      map(contentResponse => contentResponse && contentResponse.result && contentResponse.result.response)
    );
  }

  fetchUserHomeRecommendations(type: TContentRequestType, pageSize = 20): Observable<IHomeRecommendationEntity[]> {
    let url: string;
    switch (type) {
      case 'interestRecommended':
        url = this.apiEndpoints.RECOMMEND_INTEREST_BASED;
        break;
      case 'usageRecommended':
        url = this.apiEndpoints.RECOMMEND_USAGE_BASED;
        break;
      case 'trending':
        url = this.apiEndpoints.RECOMMEND_COURSE + '/trending';
        break;
    }
    url += `?pageSize=${pageSize}&pageNumber=0`;
    return this.http
      .get<IApiResponse<IHomeRecommendationResponse>>(url)
      .pipe(
        map(contentResponse => {
          return contentResponse && contentResponse.result && contentResponse.result.response;
        })
      )
      .pipe(
        tap(contents => {
          (contents || []).map(content => {
            // this.cache.addResource(content.course);
          });
        })
      );
  }
  fetchResourceParents(contentId: string): Observable<IResourceParents> {
    return this.http
      .get<IApiResponse<IResourceParentFetchResponse>>(`${this.apiEndpoints.CONTENT_PARENT}/${contentId}`)
      .pipe(map(parents => parents.result.response));
  }
  fetchMultipleAuthored(emailIds: string[]): Observable<IContent[]> {
    return this.http
      .post<IContent[]>(this.apiEndpoints.CONTENT_AUTHORED, {
        emailIds
      })
      .pipe(
        tap(contents => {
          if (contents.length) {
            contents.forEach(content => {
              // this.cache.addHierarchy({ ...content });
            });
          }
        })
      );
  }
  fetchMultipleToc(contentIds: string[]): Observable<IContent[]> {
    // provides limited fields and not all as compared to IContent
    return this.http
      .post<IContent[]>(this.apiEndpoints.CONTENT_MULTIPLE, {
        ids: contentIds
      })
      .pipe(
        tap(contents => {
          if (contents.length) {
            contents.forEach(content => { });
          }
        })
      );
  }

  fetchToc(contentId: string): Observable<IContent> {
    // const content = this.cache.getHierarchy(contentId);
    const content = undefined;
    if (content) {
      return of({ ...content });
    }
    return this.http.get<IApiResponse<IHierarchyResponse>>(this.apiEndpoints.CONTENT + '/' + contentId).pipe(
      map(u => {
        return u.result && u.result.content;
      })
    );
  }

  fetchPostLearnContents(contentId: string): Observable<IContent[]> {
    return this.http.get<IApiResponse<IPostLearnResponse>>(this.apiEndpoints.POST_LEARN + '/' + contentId).pipe(
      map(u => {
        return (u.result && u.result.response) || [];
      })
    );
  }

  addView(contentId: string) {
    return of(contentId);
    // Commented because of failing back end
    // return this.http.patch(
    //   `${this.apiEndpoints.CONTENT_ADD_VIEW}/${contentId}`,
    //   {}
    // );
  }

  fetchCatalog(): Observable<any> {
    const content = undefined;
    if (content) {
      return of(JSON.parse(content as string) as ICatalog);
    }

    return this.http.get<any>(this.apiEndpoints.CATALOG);
  }

  // Search APIs
  searchV2(req: ISearchRequest): Observable<ISearchApiResult> {
    req.userAgent = navigator.userAgent;
    req.query = req.query || '';
    return this.http
      .post<IApiResponse<ISearchApiResponse>>(this.apiEndpoints.CONTENT_SEARCH, { request: req })
      .pipe
      // tap(u => {
      //   this.cache.addResources(u.result.response.result);
      // })
      ()
      .pipe(map(u => u.result.response));
  }
  search(req: ISearchRequest): Observable<ISearchApiResult> {
    req.userAgent = navigator.userAgent;
    req.query = req.query || '';
    return this.http
      .post<IApiResponse<ISearchApiResponse>>(
        // search v3 endpoint
        // this.apiEndpoints.CONTENT_SEARCH_V3,
        // search v4 endpoint
        this.apiEndpoints.CONTENT_SEARCH_V4,
        { request: req }
      )
      .pipe(
        map(u => {
          if (u && u.result && u.result.response) {
            return u.result.response;
          }
          return {
            totalHits: 0,
            filters: [],
            result: [],
            type: []
          };
        })
      );
  }

  checkIfValidResource(data): Observable<IValidResource> {
    return this.http
      .post<IApiResponse<IValidResource>>(this.apiEndpoints.CONTENT_VALID_RESOURCE_CHECK, { request: data })
      .pipe(map(response => response.result));
  }

  // GET API
  fetchDataFromUrl(url: string): Observable<IContent> {
    return this.http.get<IContent>(url);
  }
}
