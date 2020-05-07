/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Injectable } from '@angular/core'
import { Resolve, ActivatedRouteSnapshot } from '@angular/router'
import { Observable, of } from 'rxjs'
import { map, catchError } from 'rxjs/operators'

import { IResolveResponse } from '@ws-widget/utils'

import { TrainingApiService } from '../../../apis/training-api.service'

@Injectable()
export class TrainingCountResolver implements Resolve<IResolveResponse<number>> {
  constructor(private trainingApi: TrainingApiService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IResolveResponse<number>> {
    const contentId = route.paramMap.get('contentId')
    if (contentId) {
      return this.trainingApi.getTrainingCount(contentId).pipe(
        map(trainingCount => {
          return {
            data: trainingCount,
            error: null,
          }
        }),
        catchError((error: any) => of({ error, data: null })),
      )
    }
    return of({ error: 'NO_ID', data: null })
  }
}
