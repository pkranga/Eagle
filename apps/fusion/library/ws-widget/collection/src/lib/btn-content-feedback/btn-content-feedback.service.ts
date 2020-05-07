/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { NsFeedback } from './btn-content-feedback.model'

const API_END_POINTS = {
  USER_FEEDBACK: `/apis/protected/v8/user/feedback`,
}

@Injectable({
  providedIn: 'root',
})
export class BtnContentFeedbackService {

  constructor(
    private http: HttpClient,
  ) { }

  submitFeedback(data: NsFeedback.IWsFeedbackTypeRequest): Observable<any> {
    // converting rating to string as per API request contract
    if (data.rating) {
      data.rating = data.rating.toString()
    }
    return this.http.post<any>(API_END_POINTS.USER_FEEDBACK, { request: data }).pipe(
      map(response => {
        return response.result
      }),
    )
  }
}
