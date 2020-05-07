/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { ConfigurationsService } from '@ws-widget/utils'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { noop, Observable } from 'rxjs'
import { NsContent } from '@ws-widget/collection'

@Injectable({
  providedIn: 'root',
})
export class ViewerUtilService {
  API_ENDPOINTS = {
    setS3Cookie: `/apis/v8/protected/content/setCookie`,
    PROGRESS_UPDATE: `/apis/protected/v8/user/realTimeProgress/update`,
  }
  constructor(
    private http: HttpClient,
    private configservice: ConfigurationsService,
  ) { }

  async fetchManifestFile(url: string) {
    this.setS3Cookie(url)
    const manifestFile = await this.http
      .get<any>(url)
      .toPromise()
      .catch((_err: any) => {
      })
    return manifestFile
  }

  private async setS3Cookie(contentId: string) {
    await this.http.post(this.API_ENDPOINTS.setS3Cookie, { contentId })
      .toPromise()
      .catch((_err: any) => {
      })
    return
  }

  realTimeProgressUpdate(contentId: string, request: any) {
    this.http.post(`${this.API_ENDPOINTS.PROGRESS_UPDATE}/${contentId}`, request)
      .subscribe(noop, noop)
  }

  getContent(contentId: string): Observable<NsContent.IContent> {
    return this.http.get<NsContent.IContent>(
      // tslint:disable-next-line:max-line-length
      `/apis/authApi/action/content/hierarchy/${contentId}?rootOrg=${(this.configservice.rootOrg || 'Infosys')}&org=${(this.configservice.activeOrg || 'Infosys Ltd')}`,
    )
  }
}
