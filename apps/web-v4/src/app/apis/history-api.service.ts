/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { IContinueStrip } from '../models/content.model';
import { HttpClient } from '@angular/common/http';
import { IViewerContinueLearningRequest } from '../models/playerEvents.model';
import { TelemetryService } from '../services/telemetry.service';

@Injectable({
  providedIn: 'root'
})
export class HistoryApiService {
  API_BASE = '/clientApi/v2';
  USER_API = `${this.API_BASE}/user`;
  apiEndpoints = {
    USER_HISTORY: `${this.USER_API}/history`, // #GET #POST|DELETE/:contentId
    USER_CONTINUE_LEARNING: `${this.USER_API}/history/continue` // #GET #POST
  };
  constructor(
    private http: HttpClient,
    private telemetrySvc: TelemetryService
  ) {}

  fetchContinueLearning(
    pageSize: number,
    pageState?: string,
    email?: string
  ): Observable<IContinueStrip> {
    const url =
      `${this.apiEndpoints.USER_CONTINUE_LEARNING}?pageSize=${pageSize}` +
      (pageState ? `&pageState=${pageState}` : '') +
      (email ? `&email=${email}` : '');
    return this.http.get<IContinueStrip>(url);
  }
  saveContinueLearning(
    content: IViewerContinueLearningRequest,
    contentId: string
  ): Observable<any> {
    const url = this.apiEndpoints.USER_CONTINUE_LEARNING;
    if (!Object.keys(content).length) {
      this.telemetrySvc.errorTelemetryEvent(url, content, contentId);
      return throwError({
        message: 'EMPTY_REQUEST'
      });
    }
    return this.http.post<any>(url, content);
  }
  fetchContentContinueLearning(id: string): Observable<IContinueStrip> {
    return this.http.get<any>(
      `${this.apiEndpoints.USER_CONTINUE_LEARNING}/${id}`
    );
  }
  addHistory(contentId: string): Observable<any> {
    return this.http.post<any>(
      this.apiEndpoints.USER_HISTORY + '/' + contentId,
      {}
    );
  }
  deleteHistory(contentId: string): Observable<any> {
    return this.http.delete<any>(
      this.apiEndpoints.USER_HISTORY + '/' + contentId
    );
  }
}
