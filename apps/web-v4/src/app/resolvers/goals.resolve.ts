/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

import { Observable } from 'rxjs';
import { IUserProgressGoals } from '../models/goal.model';
import { GoalsService } from '../services/goals.service';

@Injectable()
export class GoalsResolve implements Resolve<IUserProgressGoals> {
  constructor(private goalsSvc: GoalsService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<IUserProgressGoals> | Promise<IUserProgressGoals> | IUserProgressGoals {
    return this.goalsSvc.fetchUserProgressGoals();
  }
}
