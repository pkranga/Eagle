/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { NSAnalyticsData } from '../models/analytics.model'
import { ConfigurationsService } from '@ws-widget/utils'
import { NSCompetency } from '../../competency/models/competency.model'

const LA_API = `/LA1/api`
const LA_API_END_POINTS = {
  TIME_SPENT: `${LA_API}/timespent`,
  NSO_PROGRESS: `${LA_API}/nsoArtifactsAndCollaborators`,
  USER_PROGRESS: `${LA_API}/userprogress`,
  ASSESSMENTS: `${LA_API}/assessment`,
  GET_ASSESSMENTS: `${LA_API}/v1/assessment`,
  CERTIFICATES: `${LA_API}/v1/certification`,
}

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  httpOptions = {
    headers: new HttpHeaders({
      validator_URL: `https://${this.configSvc.hostPath}/apis/protected/v8/user/validate`,
    }),
  }
  constructor(private http: HttpClient, private configSvc: ConfigurationsService) { }
  timeSpent(
    startDate: string,
    endDate: string,
    contentType: string,
    isCompleted: number,
  ): Observable<NSAnalyticsData.ITimeSpentResponse> {
    return this.http.get<NSAnalyticsData.ITimeSpentResponse>(
      `${LA_API_END_POINTS.TIME_SPENT}?startDate=${startDate}&endDate=${endDate}&isCompleted=${isCompleted}&contentType=${contentType}`,
      this.httpOptions,
    )
  }

  nsoArtifacts(
    startDate: string,
    endDate: string,
    contentType: string,
    isCompleted: number,
  ): Observable<NSAnalyticsData.INsoResponse> {
    return this.http.get<NSAnalyticsData.INsoResponse>(
      `${LA_API_END_POINTS.NSO_PROGRESS}?startDate=${startDate}&endDate=${endDate}&isCompleted=${isCompleted}&contentType=${contentType}`,
      this.httpOptions,
    )
  }
  userProgress(
    startDate: string,
    endDate: string,
    contentType: string,
    isCompleted: number,
  ): Observable<NSAnalyticsData.IUserProgressResponse> {
    return this.http.get<NSAnalyticsData.IUserProgressResponse>(
      `${LA_API_END_POINTS.USER_PROGRESS}?startDate=${startDate}&endDate=${endDate}&isCompleted=${isCompleted}&contentType=${contentType}`,
      this.httpOptions,
    )
  }
  assessments(
    startDate: string,
    endDate: string,
    contentType: string,
    isCompleted: number,
  ): Observable<NSAnalyticsData.IAssessmentResponse> {
    return this.http.get<NSAnalyticsData.IAssessmentResponse>(
      `${LA_API_END_POINTS.ASSESSMENTS}?startDate=${startDate}&endDate=${endDate}&isCompleted=${isCompleted}&contentType=${contentType}`,
      this.httpOptions,
    )
  }
  fetchAssessments(startDate: string, endDate: string): Observable<NSCompetency.IAchievementsRes> {
    return this.http
      .get<NSCompetency.IAchievementsRes>(
        `${LA_API_END_POINTS.GET_ASSESSMENTS}?startDate=${startDate}&endDate=${endDate}`,
        this.httpOptions,
      )
  }
  fetchCertificates(startDate: string, endDate: string): Observable<NSCompetency.IAchievementsRes> {
    return this.http
      .get<NSCompetency.IAchievementsRes>(
        `${LA_API_END_POINTS.CERTIFICATES}?startDate=${startDate}&endDate=${endDate}`,
        this.httpOptions,
      )
  }

}
