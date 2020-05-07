/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ILearningHistory, ILearningHistoryApiResponse } from '../models/learning-history.model';

import { slagV2 } from '../constants/apiEndpoints.constant';

@Injectable()
export class LearningHistoryApiService {
  constructor(private http: HttpClient) {}

  fetchContentProgress(pageNo: number, pageSize: number, status: string, contentType: string): Observable<ILearningHistory> {
    return this.http
      .get<ILearningHistoryApiResponse>(
        slagV2 + `/user` + `/dashboard/course` + `?pageNumber=${pageNo}&pageSize=${pageSize}&status=${status}&contentType=${contentType}`
      )
      .pipe(map(data => data.result.response));
  }

  fetchChildProgress(contentChildren: string[]): Observable<ILearningHistory> {
    return this.http
      .post<ILearningHistoryApiResponse>(slagV2 + `/user/dashboard/course/details`, contentChildren)
      .pipe(map(data => data.result.response));
  }
}
