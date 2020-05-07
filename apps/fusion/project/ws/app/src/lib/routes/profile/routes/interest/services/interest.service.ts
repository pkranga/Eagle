/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// import { WsApiCatalogService } from '@ws-shared/apis/src/lib/ws-api-catalog.service'
// import { WsSharedUtilityService } from '@ws-shared/services'
import { HttpClient } from '@angular/common/http'
import { map } from 'rxjs/operators'
import { ITopic, ITopicRecommended } from '../models/interest.model'
import { NSSearch, TreeCatalogService } from '@ws-widget/collection'
const PROTECTED_SLAG_V8 = `/apis/protected/v8`
const API_END_POINTS = {
  userTopics: `${PROTECTED_SLAG_V8}/user/topics`,
  recommendedTopics: `${PROTECTED_SLAG_V8}/user/topics/suggested`,
  autocompleteTopics: `${PROTECTED_SLAG_V8}/user/topics/autocomplete`,
}
@Injectable({
  providedIn: 'root',
})
export class InterestService {
  constructor(private http: HttpClient, private treeCatalogSvc: TreeCatalogService) {}
  fetchUserInterests(): Observable<string[]> {
    return this.http
      .get<ITopic[]>(`${API_END_POINTS.userTopics}?ts=${new Date().getTime()}`)
      .pipe(map(u => u.map((topic: ITopic) => topic.name)))
  }

  fetchSuggestedInterests(): Observable<string[]> {
    return this.http
      .get<ITopicRecommended[]>(`${API_END_POINTS.recommendedTopics}`)
      .pipe(map(u => u.map((topic: ITopicRecommended) => topic.name)))
  }

  modifyUserInterests(topics: string[]) {
    return this.http.post(API_END_POINTS.userTopics, { topics })
  }

  fetchAutocompleteInterests(): Observable<string[]> {
    const leafNodes: NSSearch.IFilterUnitContent[] = []
    return this.treeCatalogSvc.getFullCatalog().pipe(
      map(catalogDataTree => {
        catalogDataTree.forEach(catalogUnit => {
          leafNodes.push(...this.getLeafNodes(catalogUnit, []))
        })
        return leafNodes.map(unitItem => unitItem.displayName)
      }),
    )
  }
  getLeafNodes<T extends NSSearch.IFilterUnitContent>(node: T, nodes: T[]): T[] {
    if ((node.children || []).length === 0) {
      nodes.push(node)
    } else {
      if (node.children) {
        node.children.forEach(child => {
          this.getLeafNodes(child, nodes)
        })
      }
    }
    return nodes
  }

  // V2 Interest code
  fetchUserInterestsV2(): Observable<string[]> {
    return this.http.get<string[]>(`${API_END_POINTS.userTopics}/v2?ts=${new Date().getTime()}`)
  }

  addUserInterest(interest: string) {
    return this.http.patch(`${API_END_POINTS.userTopics}?interest=${interest}`, {})
  }

  removeUserInterest(interest: string) {
    return this.http.delete(`${API_END_POINTS.userTopics}?interest=${interest}`)
  }

  fetchSuggestedInterestV2(): Observable<string[]> {
    return this.http.get<string[]>(`${API_END_POINTS.recommendedTopics}`)
  }

  fetchAutocompleteInterestsV2(query: string): Observable<string[]> {
    return this.http.get<string[]>(`${API_END_POINTS.autocompleteTopics}?query=${query}`)
  }
}
