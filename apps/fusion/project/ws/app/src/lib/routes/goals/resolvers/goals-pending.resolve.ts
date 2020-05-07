/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Injectable } from '@angular/core'
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { Observable, of } from 'rxjs'
import { map, catchError } from 'rxjs/operators'
import { BtnGoalsService } from '@ws-widget/collection'
import { IResolveResponse } from '@ws-widget/utils'

@Injectable()
export class GoalsPendingResolve
  implements Resolve<Observable<IResolveResponse<any[]>> | IResolveResponse<any[]>> {
  constructor(private goalSvc: BtnGoalsService) {}

  resolve(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot,
  ): Observable<IResolveResponse<any[]>> {
    return this.goalSvc.getActionRequiredGoals('isInIntranet').pipe(
      map(data => ({ data, error: null })),
      catchError(error => of({ error, data: null })),
    )
  }
}
