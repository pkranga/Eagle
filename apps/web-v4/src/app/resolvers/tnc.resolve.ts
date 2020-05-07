/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ResolveResponse } from '../models/routeResolver.model';
import { ITncFetch } from '../models/user.model';
import { TncService } from '../services/tnc.service';

@Injectable()
export class TncResolve implements Resolve<ResolveResponse<ITncFetch>> {
  constructor(private tncSvc: TncService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<ResolveResponse<ITncFetch>> | ResolveResponse<ITncFetch> {
    return this.tncSvc.getPublicTnc().pipe(
      map(data => ({ data, error: null })),
      catchError(error => of({ data: null, error }))
    );
  }
}
