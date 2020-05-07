/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root',
})
export class BtnFeatureService {

  constructor(
    private http: HttpClient,
  ) { }

  getBadgeCount(endpoint: string) {
    return this.http.get<number>(endpoint).toPromise()
  }
}
