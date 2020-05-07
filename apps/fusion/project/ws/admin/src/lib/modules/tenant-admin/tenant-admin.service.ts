/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { IResponseAllSources } from './models/userRegistration.model'

const API_ENDPOINTS = {
  getAllSources: '/apis/protected/v8/admin/userRegistration/getAllSources',
  registerUsers: '/apis/protected/v8/admin/userRegistration/register',
}
@Injectable()
export class TenantAdminService {

  constructor(
    private http: HttpClient,
  ) {
  }

  async fetchJson(jsonUrl: string) {
    const json = await this.http.get<any>(jsonUrl).toPromise()
    return json
  }

  async getAllSources(): Promise<IResponseAllSources[]> {
    return await this.http.get<IResponseAllSources[]>(API_ENDPOINTS.getAllSources).toPromise()
  }

  async registerUsers(data: any) {
    return await this.http.post(API_ENDPOINTS.registerUsers, data).toPromise()
  }

}
