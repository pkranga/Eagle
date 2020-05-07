/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { HttpHeaders } from '@angular/common/http'
import { AuthInitService } from './../../../../services/init.service'
import { Injectable } from '@angular/core'
import { ApiService } from '@ws/author/src/lib/modules/shared/services/api.service'
import { Observable } from 'rxjs'
import { NSApiResponse } from '@ws/author/src/lib/interface/apiResponse'
import { map, mergeMap } from 'rxjs/operators'
import {
  SEARCH,
  ORDINALS,
  CONTENT_CREATE,
  CONTENT_READ,
  CONTENT_DELETE,
  STATUS_CHANGE,
  UNPUBLISH,
} from '@ws/author/src/lib/constants/apiEndpoints'
import { NSApiRequest } from '@ws/author/src/lib/interface/apiRequest'
import { NSContent } from '@ws/author/src/lib/interface/content'
import { AccessControlService } from '@ws/author/src/lib/modules/shared/services/access-control.service'
import { IFormMeta } from '../../../../interface/form'

@Injectable()
export class MyContentService {
  constructor(
    private authInitService: AuthInitService,
    private apiService: ApiService,
    private accessService: AccessControlService,
  ) { }

  fetchContent(searchData: any): Observable<any> {
    return this.apiService
      .post<NSApiResponse.ISearchApiResponse>(SEARCH, searchData)
      .pipe(map((data: NSApiResponse.IApiResponse<NSApiResponse.ISearchApiResponse>) => data))
  }

  getOrdinals(): Observable<any> {
    return this.apiService.get<any>(`${ORDINALS}${this.accessService.orgRootOrgAsQuery}`)
  }

  deleteContent(id: string, isKnowledgeBoard = false): Observable<null> {
    return isKnowledgeBoard ?
      this.apiService.delete(`${CONTENT_DELETE}/${id}/kb${this.accessService.orgRootOrgAsQuery}`)
      :
      this.apiService.post(`${CONTENT_DELETE}${this.accessService.orgRootOrgAsQuery}`, {
        identifier: id,
        author: this.accessService.userId,
        isAdmin: this.accessService.hasRole(['editor', 'admin']),
      })
  }

  readContent(id: string): Observable<NSContent.IContentMeta> {
    return this.apiService.get<NSContent.IContentMeta>(
      `${CONTENT_READ}${id}${this.accessService.orgRootOrgAsQuery}`,
    )
  }

  createInAnotherLanguage(id: string, lang: string): Observable<string> {
    return this.readContent(id).pipe(
      mergeMap(content => {
        let requestObj: any = {}
        Object.keys(this.authInitService.authConfig)
          .map(
            v =>
              (requestObj[v as any] = content[v as keyof NSContent.IContentMeta]
                ? content[v as keyof NSContent.IContentMeta]
                : JSON.parse(
                  JSON.stringify(
                    this.authInitService.authConfig[v as keyof IFormMeta].defaultValue[content.contentType][0].value,
                  ),
                )),
          )
        requestObj = {
          ...requestObj,
          name: '',
          description: '',
          body: '',
          locale: lang,
          subTitle: '',
          appIcon: '',
          posterImage: '',
          thumbnail: '',
          isTranslationOf: id,
        }
        delete requestObj.identifier
        delete requestObj.status
        delete requestObj.categoryType
        delete requestObj.accessPaths
        return this.create(requestObj)
      }),
    )
  }

  create(meta: any): Observable<string> {
    const requestBody: NSApiRequest.ICreateMetaRequest = {
      content: {
        ...meta,
        createdBy: this.accessService.userId,
        locale: meta.locale ? meta.locale : this.accessService.locale,
      },
    }
    return this.apiService
      .post<NSApiRequest.ICreateMetaRequest>(
        // tslint:disable-next-line:max-line-length
        `${CONTENT_CREATE}${this.accessService.orgRootOrgAsQuery}`,
        requestBody,
      )
      .pipe(
        map((data: NSApiResponse.IContentCreateResponse) => {
          return data.identifier
        }),
      )
  }

  forwardBackward(meta: NSApiRequest.IForwadBackwardActionGeneral, id: string): Observable<null> {
    const requestBody: NSApiRequest.IForwadBackwardAction = {
      actor: this.accessService.userId,
      ...meta,
      org: this.accessService.org,
      rootOrg: this.accessService.rootOrg || '',
      appName: this.accessService.appName,
      appUrl: window.location.origin,
    }
    return this.apiService.post<null>(STATUS_CHANGE + id, requestBody)
  }

  upPublishOrDraft(id: string, unpublish = true): Observable<null> {
    const requestBody = {
      unpublish,
      identifier: id,
    }
    return this.apiService.post<any>(
      `${UNPUBLISH}${this.accessService.orgRootOrgAsQuery}`,
      requestBody,
      true,
      {
        headers: new HttpHeaders({
          Accept: 'text/plain',
        }),
        responseType: 'text',
      },
    )
  }

}
