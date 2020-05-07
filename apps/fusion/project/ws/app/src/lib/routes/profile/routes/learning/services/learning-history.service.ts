/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { NSLearningHistory } from '../models/learning.models'

const PROTECTED_SLAG_V8 = '/apis/protected/v8'
const LH_API_END_POINTS = {
  PROGRESS: `${PROTECTED_SLAG_V8}/user/dashboard/course`,
  PROGRESS_CHILDREN: `${PROTECTED_SLAG_V8}/user/dashboard/course/details`,
  USER_CERTIFICATION: `${PROTECTED_SLAG_V8}/user/certification`,
}

@Injectable({
  providedIn: 'root',
})
export class LearningHistoryService {
  constructor(private http: HttpClient) { }

  fetchContentProgress(
    pageState: number,
    pageSize: number,
    status: string,
    contentType: string,
  ): Observable<NSLearningHistory.ILearningHistory> {
    return this.http
      .get<NSLearningHistory.ILearningHistory>(
        `${LH_API_END_POINTS.PROGRESS}?pageState=${pageState}&pageSize=${pageSize}&status=${status}&contentType=${contentType}`,
      )
      .pipe(map(data => data))
  }

  fetchChildProgress(contentChildren: string[]): Observable<NSLearningHistory.ILearningHistory> {
    return this.http
      .post<NSLearningHistory.ILearningHistory>(
        `${LH_API_END_POINTS.PROGRESS_CHILDREN}`,
        contentChildren,
      )
      .pipe(map(data => data))
  }

  fetchCertification(): Observable<NSLearningHistory.ICertification> {
    return this.http
      .post<NSLearningHistory.ICertification>(`${LH_API_END_POINTS.USER_CERTIFICATION}`, {
        tracks: [],
        sortOrder: 'desc',
      })
      .pipe(map(u => u))
  }
}
