/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// helper imports
import { constants } from '../utils/constant.utils';
import { UtilMethods } from '../utils/util-methods.utils';
import { IProjectEndorsement } from '../../../models/my-skills.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectEndorsementService {
  constructor(private http: HttpClient) { }
  add(projectEndorsementObj: object): Observable<any> {
    try {
      return this.http.post(`${constants.ADD_PROJECT_ENDORSEMENT}`, projectEndorsementObj);
      // , UtilMethods.getAuthHeaders());
    } catch (e) {
      console.error(e);
    }
  }

  getList(type): Observable<IProjectEndorsement> {
    try {
      return this.http.get<any>(`${constants.GET_PROJECT_ENDORSEMENT_REQUEST_LIST}?request_type=${type}`);
      //
    } catch (e) {
      console.error(e);
    }
  }

  get(endorsementId) {
    try {
      return this.http.get(`${constants.GET_PROJECT_ENDORSEMENT_REQUEST}`);
      // , UtilMethods.getAuthHeaders());
    } catch (e) {
      console.error(e);
    }
  }

  endorseRequest(obj) {
    try {
      return this.http.post(`${constants.ENDORSE_REQUEST}?endorse_id=${obj.endorse_id}`, obj);
      // , UtilMethods.getAuthHeaders());
    } catch (e) {
      console.error(e);
    }
  }
}
