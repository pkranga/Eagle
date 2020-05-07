/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ResolveResponse } from '../models/routeResolver.model';
import { NavigatorService } from '../services/navigator.service';

@Injectable()
export class SuggestedLpResolve
  implements
    Resolve<Observable<ResolveResponse<any>> | ResolveResponse<any>> {
  constructor(private navigatorSvc: NavigatorService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<ResolveResponse<any>> | ResolveResponse<any> {
    return this.navigatorSvc.lp.pipe(
      map(data => ({ data, error: null })),
      catchError(error => of({ data: null, error }))
    );
  }
}
