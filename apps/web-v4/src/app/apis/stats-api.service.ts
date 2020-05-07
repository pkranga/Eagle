/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IApiResponse } from '../models/apiResponse';
import {
  ICohortsActiveUsers,
  ICohortsActiveUsersApiResponse,
  ICohortsSMEs,
  ICohortsSMEsApiResponse
} from '../models/cohorts.model';

@Injectable({
  providedIn: 'root'
})
export class StatsApiService {
  API_BASE = '/clientApi/v2';

  apiEndpoints = {
    // #GET/:type/:resourceId ## type=sme|activeusers
    COHORTS: `${this.API_BASE}/cohorts`
  };

  constructor(private http: HttpClient) {}

  // Cohorts APIs
  fetchSMEsCohorts(resourceId: string): Observable<ICohortsSMEs> {
    return this.http
      .get<IApiResponse<ICohortsSMEsApiResponse>>(
        `${this.apiEndpoints.COHORTS}/sme/${resourceId}`
      )
      .pipe(map(cohorts => cohorts.result.response));
  }

  fetchActiveUsers(resourceId: string): Observable<ICohortsActiveUsers> {
    return this.http
      .get<IApiResponse<ICohortsActiveUsersApiResponse>>(
        `${this.apiEndpoints.COHORTS}/activeusers/${resourceId}`
      )
      .pipe(map(cohorts => cohorts.result.response));
  }
}
