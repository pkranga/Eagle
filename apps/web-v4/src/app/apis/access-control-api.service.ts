/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import { slagV2 } from '../constants/apiEndpoints.constant';
import { HttpClient } from '@angular/common/http';
import { IApiResponse } from '../models/apiResponse';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

const apiEndpoints = {
  content: `${slagV2}/user/accessCheck`
};

@Injectable({
  providedIn: 'root'
})
export class AccessControlApiService {
  constructor(private http: HttpClient) {}

  checkContentAccess(contentIds: string[]): Observable<{ [id: string]: { hasAccess: boolean } }> {
    return this.http
      .post<IApiResponse<{ response: { [id: string]: { hasAccess: boolean } } }>>(apiEndpoints.content, { contentIds })
      .pipe(map(res => res.result.response));
  }
}
