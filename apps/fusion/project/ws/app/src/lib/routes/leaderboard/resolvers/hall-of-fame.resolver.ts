/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Injectable } from '@angular/core'
import { IHallOfFameItem } from '../models/leaderboard.model'
import { Resolve } from '@angular/router'
import { LeaderboardApiService } from '../apis/leaderboard-api.service'
import { Observable, of } from 'rxjs'
import { IResolveResponse } from '@ws-widget/utils'
import { map, catchError } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class HallOfFameResolver
  implements Resolve<Observable<IResolveResponse<IHallOfFameItem[]>>> {
  constructor(private leaderboardApi: LeaderboardApiService) {}

  resolve(): Observable<IResolveResponse<IHallOfFameItem[]>> {
    try {
      return this.leaderboardApi.getHallOfFameData().pipe(
        map(hof => {
          return {
            data: hof,
            error: null,
          }
        }),
        catchError(() => {
          const result: IResolveResponse<IHallOfFameItem[]> = {
            data: null,
            error: 'HALL_OF_FAME_API_ERROR',
          }

          return of(result)
        }),
      )
    } catch (err) {
      const result: IResolveResponse<IHallOfFameItem[]> = {
        data: null,
        error: 'HALL_OF_FAME_RESOLVER_ERROR',
      }
      return of(result)
    }
  }
}
