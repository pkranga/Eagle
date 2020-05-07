/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

const END_POINT_BASE = 'apis/protected/v8/admin/userRegistration'
const API_END_POINTS = {
  listAllUsers: (source: string) => `${END_POINT_BASE}/listUsers/${source}`,
  deregisterUsers: (source: string) => `${END_POINT_BASE}//deregisterUsers/${source}`,
}
@Injectable({
  providedIn: 'root',
})
export class RegisteredUsersService {

  constructor(
    private http: HttpClient,
  ) { }

  listAllUsers(source: string) {
    return this.http.get<any[]>(API_END_POINTS.listAllUsers(source)).toPromise()
  }

  deregisterUsers(req: { source: string, users: string[] }) {
    return this.http.post(API_END_POINTS.deregisterUsers(req.source), req.users).toPromise()
  }
}
