/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';

import { slagV2 } from '../../../constants/apiEndpoints.constant';
import { IHandsOnTelemetry, ICommEvent, COMM_STATES } from '../../../models/comm-events.model';
import { TelemetryService } from '../../../services/telemetry.service';

const apiEndpoints = {
  HANDSON_EXECUTE: `${slagV2}/user/code/execute`,
  HANDSON_VERIFY_FP: `${slagV2}/user/code/fp/verify/`,
  HANDSON_SUBMIT_FP: `${slagV2}/user/code/fp/submit/`,
  HANDSON_VERIFY_CE: `${slagV2}/user/code/ce/verify/`,
  HANDSON_SUBMIT_CE: `${slagV2}/user/code/ce/submit/`,
  HANDSON_VIEW_LAST_SUBMISSION: `${slagV2}/user/code/viewLastSubmission/`,
  HANSON_VIEW_LAST_SUBMISSION_DATA: `${slagV2}/user/code/viewLastSubmissionData/`
};

@Injectable({
  providedIn: 'root'
})
export class HandsOnService {
  constructor(private http: HttpClient, private telemetrySvc: TelemetryService) {}

  execute(exerciseData) {
    return this.http.post(apiEndpoints.HANDSON_EXECUTE, exerciseData);
  }
  verifyFp(lexId, exerciseDataFp) {
    return this.http.post(apiEndpoints.HANDSON_VERIFY_FP + lexId, exerciseDataFp);
  }
  submitFp(lexId, exerciseDataFp) {
    return this.http.post(apiEndpoints.HANDSON_SUBMIT_FP + lexId, exerciseDataFp);
  }
  verifyCe(lexId, exerciseDataCe) {
    return this.http.post(apiEndpoints.HANDSON_VERIFY_CE + lexId, exerciseDataCe);
  }
  submitCe(lexId, exerciseDataCe) {
    return this.http.post(apiEndpoints.HANDSON_SUBMIT_CE + lexId, exerciseDataCe);
  }
  viewLastSubmission(lexId) {
    return this.http.get(apiEndpoints.HANDSON_VIEW_LAST_SUBMISSION + lexId).pipe(
      mergeMap((v: any) => {
        if (v && v.result && v.result.response && v.result.response.length > 0) {
          const viewUrl = v.result.response[0].submission_url;
          const url = '/' + viewUrl.slice(viewUrl.indexOf('content/'));
          return this.http.get(url, { responseType: 'text' });
        } else {
          return ['---no submission found---'];
        }
      })
    );
  }

  firePlayerTelemetryEvent(eventBody: IHandsOnTelemetry, state: COMM_STATES) {
    const event: ICommEvent<IHandsOnTelemetry> = {
      app: 'WEB_PLAYER_PLUGIN',
      plugin: 'quiz',
      type: 'TELEMETRY',
      state,
      data: eventBody
    };
    this.telemetrySvc.playerTelemetryEvent(event);
  }
}
