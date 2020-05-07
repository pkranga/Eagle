/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TelemetryService } from '../../../services/telemetry.service';
import { Observable } from 'rxjs';
import { slagV2 } from '../../../constants/apiEndpoints.constant';
import { map } from 'rxjs/operators';
import { IRdbmsApiResponse } from '../model/rdbms-handson.model';

const apiEndpoints = {
  initializeDb: `${slagV2}/user/rdbms/initializeDb`,
  execute: `${slagV2}/user/rdbms/executeQuery`,
  conceptData: `${slagV2}/user/rdbms/conceptData`,
  composite: `${slagV2}/user/rdbms/compositeQuery`,
  expectedOutput: `${slagV2}/user/rdbms/expectedOutput`,
  verify: `${slagV2}/user/rdbms/verifyExercise`,
  submit: `${slagV2}/user/rdbms/submitExercise`,
  dbStructure: `${slagV2}/user/rdbms/dbStructure`,
  tableRefresh: `${slagV2}/user/rdbms/tableRefresh`,
  playground: `${slagV2}/user/rdbms/playground`,
  compareQuery: `${slagV2}/user/rdbms/compareQuery`,
};
@Injectable({
  providedIn: 'root'
})
export class RdbmsHandsonService {
  constructor(private http: HttpClient,
    // tslint:disable-next-line:align
    private telemetrySvc: TelemetryService) { }

  verifyQuery(req, id): Observable<any> {
    return this.http.post<any>(apiEndpoints.verify + '/' + id, req)
      .pipe(map(response => response));
  }

  submitQuery(req, id): Observable<any> {
    return this.http.post<any>(apiEndpoints.submit + '/' + id, req)
      .pipe(map(response => response));
  }

  runQuery(req): Observable<IRdbmsApiResponse> {
    const reqBody = {
      input_data: req
    };
    return this.http.post<IRdbmsApiResponse>(apiEndpoints.execute, reqBody)
      .pipe(map(response => response));
  }

  compareQuery(originQuery, userQuery): Observable<IRdbmsApiResponse> {
    const reqBody = {
      original_query: originQuery,
      user_query: userQuery
    };
    return this.http.post<IRdbmsApiResponse>(apiEndpoints.compareQuery, reqBody)
      .pipe(map(response => response));
  }

  playground(req): Observable<IRdbmsApiResponse> {
    const reqBody = {
      input_data: req
    };
    return this.http.post<IRdbmsApiResponse>(apiEndpoints.playground, reqBody)
      .pipe(map(response => response));
  }

  compositeQuery(req, type): Observable<IRdbmsApiResponse> {
    const reqBody = {
      input_data: req
    };
    return this.http.post<IRdbmsApiResponse>(apiEndpoints.composite + '/' + type, reqBody)
      .pipe(map(response => response));
  }

  initializeDatabase(id): Observable<IRdbmsApiResponse[]> {
    return this.http.get<IRdbmsApiResponse[]>(apiEndpoints.initializeDb + '/' + id);
  }

  fetchDBStructure(id): Observable<IRdbmsApiResponse> {
    return this.http.get<IRdbmsApiResponse>(apiEndpoints.dbStructure + '/' + id);
  }

  tableRefresh(id): Observable<IRdbmsApiResponse[]> {
    return this.http.get<IRdbmsApiResponse[]>(apiEndpoints.tableRefresh + '/' + id);
  }

  fetchConceptData(id): Observable<IRdbmsApiResponse> {
    return this.http.get<IRdbmsApiResponse>(apiEndpoints.conceptData + '/' + id);
  }

  fetchExpectedOutput(id): Observable<IRdbmsApiResponse> {
    return this.http.get<IRdbmsApiResponse>(apiEndpoints.expectedOutput + '/' + id);
  }
}
