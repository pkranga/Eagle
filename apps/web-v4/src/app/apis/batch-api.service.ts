/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IContent } from '../models/content.model';
import { map } from 'rxjs/operators';
import { IApiResponse } from '../models/apiResponse';
import { ICohortsBatchCohorts, ICohortsBatchCohortsApiResponse, ICoursesForYouResponse } from '../models/batch.model';



@Injectable({
  providedIn: 'root'
})
export class BatchService {
  API_BASE = '/clientApi/v3';
  USER_API = `${this.API_BASE}/user`;

  apiEndpoints = {
    FETCH_GENERIC: `${this.USER_API}/batch/generic`,
    FETCH_STREAM: `${this.USER_API}/batch/stream`,
    FETCH_BATCH_COHORTS: `${this.USER_API}/batch`
  };

  constructor(private http: HttpClient) { }

  fetchGenericContent(): Observable<IContent[]> {
    return this.http.get<IApiResponse<ICoursesForYouResponse>>(this.apiEndpoints.FETCH_GENERIC)
      .pipe(map(data => data.result.response));
  }

  fetchStreamContent(): Observable<IContent[]> {
    return this.http.get<IApiResponse<ICoursesForYouResponse>>(this.apiEndpoints.FETCH_STREAM)
      .pipe(map(data => data.result.response));
  }

  fetchBatchCohorts(contentId: string): Observable<ICohortsBatchCohorts[]> {
    return this.http.get<IApiResponse<ICohortsBatchCohortsApiResponse>>
      (`${this.apiEndpoints.FETCH_BATCH_COHORTS}/${contentId}`)
      .pipe(map(data => data.result.response));
  }
}
