/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Injectable } from '@angular/core'
import { Resolve } from '@angular/router'
import { Observable, of } from 'rxjs'
import { map, catchError } from 'rxjs/operators'

import { FeedbackService, IFeedbackSummary } from '@ws-widget/collection'
import { IResolveResponse } from '@ws-widget/utils'

@Injectable()
export class FeedbackSummaryResolver implements Resolve<IResolveResponse<IFeedbackSummary>> {
  constructor(private feedbackApi: FeedbackService) {}

  resolve(): Observable<IResolveResponse<IFeedbackSummary>> {
    try {
      return this.feedbackApi.getFeedbackSummary().pipe(
        map(summary => {
          return {
            data: summary,
            error: null,
          }
        }),
        catchError(() => {
          const result: IResolveResponse<IFeedbackSummary> = {
            data: null,
            error: 'FEEDBACK_SUMMARY_API_ERROR',
          }

          return of(result)
        }),
      )
    } catch (err) {
      const result: IResolveResponse<IFeedbackSummary> = {
        data: null,
        error: 'FEEDBACK_SUMMARY_RESOLVER_ERROR',
      }
      return of(result)
    }
  }
}
