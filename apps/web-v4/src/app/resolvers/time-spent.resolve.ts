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
import { ITimeSpent } from '../models/timeSpent.model';
import { DashboardService } from '../services/dashboard.service';
import { tap, map } from 'rxjs/operators';
export interface ITimeResolveData {
  start: Date;
  end: Date;
  data: ITimeSpent;
}
@Injectable()
export class TimeSpentResolve implements Resolve<ITimeResolveData> {
  constructor(private dashboardSvc: DashboardService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<ITimeResolveData>
    | Promise<ITimeResolveData>
    | ITimeResolveData {
    const singleDay = 24 * 60 * 60 * 1000;
    const now = Date.now();
    let start = new Date(now - 7 * singleDay);
    let end = new Date(now - singleDay);
    if (route.queryParams.start) {
      start = new Date(parseInt(route.queryParams.start, 10));
    }
    if (route.queryParams.end) {
      end = new Date(parseInt(route.queryParams.end, 10));
    }
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    return this.dashboardSvc
      .getDashBoard(
        `${start.getFullYear()}-${start.getMonth() + 1}-${start.getDate()}`,
        `${end.getFullYear()}-${end.getMonth() + 1}-${end.getDate()}`
      )
      .pipe(
        map(data => ({
          start,
          end,
          data
        }))
      );
  }
}
