/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
// import { map } from 'rxjs/operators'

@Injectable()
export class CertificationService {
  API_ENDPOINTS = {
    USER_CERTIFICATION: ``,
  }
  constructor(private http: HttpClient) { }

  fetchCertifications(request: { tracks: never[]; sortOrder: string; }) {
    return this.http
      .post(this.API_ENDPOINTS.USER_CERTIFICATION, { request })
    // .pipe(map(u => u.result && u.result.resultList))
  }
}
