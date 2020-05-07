/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { IReqMarkAsComplete } from './mark-as-complete.model'
const PROTECTED_SLAG_V8 = '/apis/protected/v8'
const API_END_POINTS = {
  markAsComplete: `${PROTECTED_SLAG_V8}/user/realTimeProgress/markAsComplete`,
}

@Injectable({
  providedIn: 'root',
})
export class MarkAsCompleteService {

  constructor(
    private http: HttpClient,
  ) { }

  markAsComplete(req: IReqMarkAsComplete, contentId: string) {
    return this.http.post(
      `${API_END_POINTS.markAsComplete}/${contentId}`,
      req,
    ).toPromise()
  }
}
