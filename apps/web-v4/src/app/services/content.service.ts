/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ContentApiService } from '../apis/content-api.service';
import { ValidAssessmentResources, ValidPracticeResources } from '../constants/content.constants';
import {
  IContent,
  IHomeRecommendationEntity,
  IResourceParents,
  IValidResource,
  TContentRecommendationType,
  TContentRequestType,
  TRecommendationGroupType
} from '../models/content.model';
import { ISearchApiResult, ISearchRequest } from '../models/searchResponse.model';
import { CacheService } from './cache.service';
import { ValuesService } from './values.service';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  constructor(
    private contentApiSvc: ContentApiService,
    private cacheSvc: CacheService,
    private valueSvc: ValuesService
  ) { }

  fetchContent(contentId: string): Observable<IContent> {
    const content = this.cacheSvc.getContent(contentId);
    if (content) {
      return of(content);
    }
    return this.contentApiSvc.fetchToc(contentId).pipe(
      tap(contentResponse => {
        if (contentResponse) {
          this.transformToSensibleContent(contentResponse);
          this.cacheSvc.cacheTocContent(contentResponse);
        }
      })
    );
  }

  fetchMultipleContent(contentIds: string[]): Observable<IContent[]> {
    if (!contentIds || !contentIds.length) {
      return of([]);
    }
    return this.contentApiSvc.fetchMultipleToc(contentIds).pipe(
      tap(contentsResponse => {
        if (contentsResponse && contentsResponse.length) {
          contentsResponse.forEach(content => {
            this.transformToSensibleContent(content);
          });
        }
      }),
      map(contentsResponse =>
        contentsResponse.sort((a, b) => {
          if (a && b) {
            return contentIds.indexOf(a.identifier) - contentIds.indexOf(b.identifier);
          }
          return -1;
        })
      )
    );
  }

  fetchContentParents(contentId: string): Observable<IResourceParents> {
    return this.contentApiSvc.fetchResourceParents(contentId);
  }

  fetchPostLearnContents(contentId: string): Observable<IContent[]> {
    return this.contentApiSvc.fetchPostLearnContents(contentId);
  }

  search(req: ISearchRequest, version = 3): Observable<ISearchApiResult> {
    if (version === 2) {
      return this.contentApiSvc.searchV2(req);
    } else if (version === 3) {
      return this.contentApiSvc.search(req);
    }
  }

  fetchHomeGroupRecommendations(
    recommendationType: TContentRecommendationType = 'org',
    recommendationGroupType: TRecommendationGroupType,
    pageSize = 20,
    pageNumber = 0
  ): Observable<IContent[]> {
    return this.contentApiSvc.fetchHomeGroupRecommendations(recommendationType, recommendationGroupType, pageSize, pageNumber);
    // .pipe(tap(u => console.log(recommendationType, recommendationGroupType, u)));
  }

  fetchUserHomeRecommendations(type: TContentRequestType, pageSize = 20): Observable<IHomeRecommendationEntity[]> {
    return this.contentApiSvc.fetchUserHomeRecommendations(type, pageSize);
  }

  fetchContentRecommendations(type: TContentRequestType, pageSize = 20): Observable<IContent[]> {
    return this.contentApiSvc.fetchContentRecommendations(type, pageSize);
  }

  autocomplete(query: string): Observable<string[]> {
    return forkJoin(this.contentApiSvc.autocompleteMeta(query), this.contentApiSvc.autocompleteUserHistory(query)).pipe(
      map(([contentAutoComplete, historyAutoComplete]) => {
        const all = [...historyAutoComplete, ...contentAutoComplete];
        all.sort((a, b) => b.score - a.score);
        return all.map(u => u.name);
      })
    );
  }

  conceptGraphAutoComplete(query: string): Observable<{ id: string; name: string }[]> {
    return this.contentApiSvc.autocompleteConcepts(query);
  }

  updateViewCount(contentId: string) {
    return this.contentApiSvc.addView(contentId);
  }

  validResourceCheck(data): Observable<IValidResource> {
    return this.contentApiSvc.checkIfValidResource(data);
  }

  filterLearningContent(
    resources: IContent[],
    resourceTypeFilter: 'all' | 'learn' | 'practice' | 'assess' = 'all'
  ): IContent[] {
    switch (resourceTypeFilter) {
      case 'all':
        return resources;
      case 'learn':
        return resources.filter(
          resource =>
            !ValidPracticeResources.has(resource.resourceType) && !ValidAssessmentResources.has(resource.resourceType)
        );
      case 'practice':
        return resources.filter(resource => ValidPracticeResources.has(resource.resourceType));
      case 'assess':
        return resources.filter(resource => ValidAssessmentResources.has(resource.resourceType));
      default:
        return resources;
    }
  }

  private transformToSensibleContent(content: IContent) {
    if (content) {
      content.artifactUrl = (content.artifactUrl || '').replace(this.valueSvc.CONTENT_URL_PREFIX_REGEX, '');
      content.appIcon = (content.appIcon || '').replace(this.valueSvc.CONTENT_URL_PREFIX_REGEX, '');
      content.introductoryVideo = (content.introductoryVideo || '').replace(this.valueSvc.CONTENT_URL_PREFIX_REGEX, '');
      content.introductoryVideoIcon = (content.introductoryVideoIcon || '').replace(
        this.valueSvc.CONTENT_URL_PREFIX_REGEX,
        ''
      );
      content.subTitles = (content.subTitles || []).map(subtitle => {
        subtitle.url = subtitle.url.replace(this.valueSvc.CONTENT_URL_PREFIX_REGEX, '');
        return subtitle;
      });
      content.playgroundResources = (content.playgroundResources || []).map(playground => {
        playground.artifactUrl = playground.artifactUrl.replace(this.valueSvc.CONTENT_URL_PREFIX_REGEX, '');
        return playground;
      });
      // content.posterImage = content.artifactUrl.replace(this.valueSvc.CONTENT_URL_PREFIX_REGEX, '');
      if (content.children && content.children.length) {
        content.children.forEach(child => {
          this.transformToSensibleContent(child);
        });
      }
    }
  }

  // DUMMY
  fetchDataFromUrl(url: string): Observable<any> {
    return this.contentApiSvc.fetchDataFromUrl(url).pipe(
      tap(contentResponse => {
        this.transformToSensibleContent(contentResponse);
        this.cacheSvc.cacheTocContent(contentResponse);
      })
    );
  }
}
