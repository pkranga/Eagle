/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Injectable } from '@angular/core'
import { NsAutoComplete, UserAutocompleteService } from '@ws-widget/collection'
import {
  AUTHORING_CONTENT_BASE,
  CONTENT_BASE_COPY,
  CONTENT_CREATE,
  CONTENT_DELETE,
  CONTENT_READ,
  CONTENT_SAVE,
  ORDINALS,
  SEARCH,
  STATUS_CHANGE,
} from '@ws/author/src/lib/constants/apiEndpoints'
import { NSApiResponse } from '@ws/author/src/lib/interface//apiResponse'
import { NSApiRequest } from '@ws/author/src/lib/interface/apiRequest'
import { NSContent } from '@ws/author/src/lib/interface/content'
import { AccessControlService } from '@ws/author/src/lib/modules/shared/services/access-control.service'
import { ApiService } from '@ws/author/src/lib/modules/shared/services/api.service'
import { Observable } from 'rxjs'
import { map, mergeMap, tap } from 'rxjs/operators'

@Injectable()
export class EditorService {

  public ordinals!: any

  constructor(
    private apiService: ApiService,
    private accessService: AccessControlService,
    private userAutoComplete: UserAutocompleteService,
  ) {
  }

  create(meta: NSApiRequest.ICreateMetaRequestGeneral): Observable<string> {
    const requestBody: NSApiRequest.ICreateMetaRequest = {
      content: {
        locale: 'en', ...meta, createdBy: this.accessService.userId,
      },
    }
    return this.apiService.post<NSApiRequest.ICreateMetaRequest>(
      // tslint:disable-next-line:max-line-length
      `${CONTENT_CREATE}${this.accessService.orgRootOrgAsQuery}`, requestBody,
    ).pipe(
      map((data: NSApiResponse.IContentCreateResponse) => {
        return data.identifier
      }),
    )
  }

  readContent(id: string): Observable<NSContent.IContentMeta> {
    return this.apiService.get<NSContent.IContentMeta>(
      `${CONTENT_READ}${id}${this.accessService.orgRootOrgAsQuery}`,
    )
  }

  createAndReadContent(meta: NSApiRequest.ICreateMetaRequestGeneral): Observable<NSContent.IContentMeta> {
    return this.create(meta).pipe(
      mergeMap(data => this.readContent(data)),
    )
  }

  updateContent(meta: NSApiRequest.IContentUpdate): Observable<null> {
    return this.apiService.post<null>(
      `${CONTENT_SAVE}${this.accessService.orgRootOrgAsQuery}`,
      meta,
    )
  }

  fetchEmployeeList(
    data: string,
  ): Observable<any[]> {
    return this.userAutoComplete.fetchAutoComplete(data).pipe(
      map((v: NsAutoComplete.IUserAutoComplete[]) => {
        return v.map(user => {
          return {
            displayName: `${user.first_name || ''} ${user.last_name || ''}`,
            id: user.wid,
            mail: user.email,
          }
        })
      }),
    )
  }

  getOrdinals(): Observable<any> {
    return this.apiService.get<any>(
      `${ORDINALS}${this.accessService.orgRootOrgAsQuery}`,
    ).pipe(
      tap(v => this.ordinals = v),
    )
  }

  checkUrl(url: string): Observable<any> {
    return this.apiService.get<any>(url)
  }

  forwardBackward(meta: NSApiRequest.IForwadBackwardActionGeneral, id: string): Observable<null> {
    const requestBody: NSApiRequest.IForwadBackwardAction = {
      actor: this.accessService.userId, ...meta,
      org: this.accessService.org,
      rootOrg: this.accessService.rootOrg || '',
      appName: this.accessService.appName,
      appUrl: window.location.origin,
    }
    return this.apiService.post<null>(STATUS_CHANGE + id, requestBody)
  }

  readJSON(artifactUrl: string): Observable<any> {
    return this.apiService.get(
      `${AUTHORING_CONTENT_BASE}${encodeURIComponent(artifactUrl)}`,
    )
  }

  searchContent(searchData: any): Observable<any> {
    return this.apiService.post<NSApiResponse.ISearchApiResponse>(SEARCH, searchData).pipe(
      map((data: NSApiResponse.IApiResponse<NSApiResponse.ISearchApiResponse>) => data))
  }

  copy(lexId: string, url: string) {
    // tslint:disable-next-line: max-line-length
    const destination = `${this.accessService.rootOrg.replace(/ /g, '_')}%2F${this.accessService.org.replace(/ /g, '_')}%2FPublic%2F${lexId.replace('.img', '')}`
    const location = url.split('/').slice(4, 8).join('%2F')
    return this.apiService.post(
      CONTENT_BASE_COPY,
      {
        destination,
        location,
      },
      false)
  }

  deleteContent(id: string, isKnowledgeBoard = false): Observable<null> {
    return isKnowledgeBoard ?
      this.apiService.delete(`${CONTENT_DELETE}/${id}/kb${this.accessService.orgRootOrgAsQuery}`) :
      this.apiService.post(`${CONTENT_DELETE}${this.accessService.orgRootOrgAsQuery}`, {
        identifier: id,
        author: this.accessService.userId,
        isAdmin: this.accessService.hasRole(['editor', 'admin']),
      })
  }

}
