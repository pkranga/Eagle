/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Injectable } from '@angular/core'
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { Observable, of } from 'rxjs'
import { map, catchError } from 'rxjs/operators'
import { BtnGoalsService, NsGoal } from '@ws-widget/collection'
import { IResolveResponse } from '@ws-widget/utils'

@Injectable()
export class GoalsUserResolve
  implements
    Resolve<Observable<IResolveResponse<NsGoal.IUserGoals>> | IResolveResponse<NsGoal.IUserGoals>> {
  constructor(private goalSvc: BtnGoalsService) {}

  resolve(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot,
  ): Observable<IResolveResponse<NsGoal.IUserGoals>> {
    return this.goalSvc.getUserGoals(NsGoal.EGoalTypes.USER, 'isInIntranet').pipe(
      map(data => ({ data, error: null })),
      catchError(error => of({ error, data: null })),
    )
  }
}
