/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { getStringifiedQueryParams } from '@ws-widget/utils'
import { NsContentStripMultiple } from './content-strip-multiple.model'

@Injectable({
  providedIn: 'root',
})
export class ContentStripMultipleService {

  constructor(
    private http: HttpClient,
  ) { }

  getContentStripResponseApi(request: NsContentStripMultiple.IStripRequestApi, filters?: { [key: string]: string | undefined }):
    Observable<NsContentStripMultiple.IContentStripResponseApi> {
    let stringifiedQueryParams = ''
    stringifiedQueryParams = getStringifiedQueryParams({
      pageNo: request.queryParams ? request.queryParams.pageNo : undefined,
      pageSize: request.queryParams ? request.queryParams.pageSize : undefined,
      pageState: request.queryParams ? request.queryParams.pageState : undefined,
      filters: filters ? encodeURIComponent(JSON.stringify(filters)) : undefined,
    })
    let url = request.path
    url += stringifiedQueryParams ? `?${stringifiedQueryParams}` : ''
    return this.http.get<NsContentStripMultiple.IContentStripResponseApi>(url)
  }
}
