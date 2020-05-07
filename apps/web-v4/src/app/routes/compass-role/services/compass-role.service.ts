/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CompassRoleService {
  constructor(private http: HttpClient) {}
  getRoles(roleId): Observable<any> {
    try {
      return this.http.get(`/LA1/api/nso/getCourseAndProgress?role_id=${roleId}`);
      // return this.http.get(`http://kmserver11:7001/api/nso/getCourseAndProgress?role_id=${roleId}&email_id=${emailId}`);
    } catch (e) {
      console.error(e);
    }
  }
}
