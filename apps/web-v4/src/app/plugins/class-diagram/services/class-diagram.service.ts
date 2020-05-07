/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { slagV2 } from '../../../constants/apiEndpoints.constant';
import { COMM_STATES, ICommEvent, IClassDiagramTelemetry } from '../../../models/comm-events.model';
import { TelemetryService } from '../../../services/telemetry.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IClassDiagramApiResponse } from '../model/classDiagram.model';

const apiEndpoints = {
  CLASS_DIAGRAM_SUBMIT: `${slagV2}/user/class-diagram/classdiagram/submit/`
};
@Injectable({
  providedIn: 'root'
})
export class ClassDiagramService {
  constructor(private http: HttpClient, private telemetrySvc: TelemetryService) {}

  submitClassDiagram(req): Observable<IClassDiagramApiResponse> {
    const reqBody = {
      user_solution: JSON.stringify({ options: req.userSolution }),
      user_id_type: 'uuid',
      ignore_error: true
    };
    // tslint:disable-next-line:max-line-length
    return this.http
      .post<IClassDiagramApiResponse>(apiEndpoints.CLASS_DIAGRAM_SUBMIT + req.identifier, reqBody)
      .pipe(map(response => response));
  }

  firePlayerTelemetryEvent(
    contentId: string,
    courseId: string,
    mimeType: string,
    state: COMM_STATES,
    isIdeal: boolean,
    isSubmitted: boolean,
    force: boolean = false
  ) {
    const event: ICommEvent<IClassDiagramTelemetry> = {
      app: 'WEB_PLAYER_PLUGIN',
      plugin: 'classdiagram',
      type: 'TELEMETRY',
      state,
      data: {
        identifier: contentId,
        courseId,
        mimeType,
        isSubmitted,
        force,
        isIdeal
      }
    };
    this.telemetrySvc.playerTelemetryEvent(event);
  }
}
