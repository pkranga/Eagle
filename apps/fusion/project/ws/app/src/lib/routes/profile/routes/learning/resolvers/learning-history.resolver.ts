/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Injectable } from '@angular/core'
import { Resolve } from '@angular/router'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { IResolveResponse } from '@ws-widget/utils'
import { NSLearningHistory } from '../models/learning.models'
import { LearningHistoryService } from '../services/learning-history.service'

@Injectable()
export class LearningHistoryResolver
  implements
    Resolve<
      | Observable<IResolveResponse<{ response: NSLearningHistory.ILearningHistory }>>
      | IResolveResponse<NSLearningHistory.ILearningHistory>
    > {
  constructor(private learnHistorySvc: LearningHistoryService) {}
  pageState = -1
  pageSize = 10
  status = 'inprogress'
  contentType = 'Learning path'

  resolve():
    | Observable<IResolveResponse<NSLearningHistory.ILearningHistory>>
    | IResolveResponse<NSLearningHistory.ILearningHistory> {
    return this.learnHistorySvc
      .fetchContentProgress(this.pageState, this.pageSize, this.status, this.contentType)
      .pipe(
        map(data => ({ data, error: null })),
        catchError(() => of({ data: null, error: null })),
      )
  }
}
