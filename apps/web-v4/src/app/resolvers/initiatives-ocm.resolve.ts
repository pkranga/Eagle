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
import { IBadgeResponse } from '../models/badge.model';
import { BadgesService } from '../services/badges.service';
import { map, catchError } from 'rxjs/operators';
import { ResolveResponse } from '../models/routeResolver.model';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../services/config.service';

@Injectable()
export class InitiativesOcmResolve implements Resolve<any> {
  constructor(private http: HttpClient, private configSvc: ConfigService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<ResolveResponse<any>> | ResolveResponse<any> {
    return this.http
      .get(
        this.configSvc.instanceConfig.features.navigateChange.config.jsonPaths
          .ocmJsonPath
      )
      .pipe(
        map(data => ({ data, error: null })),
        catchError(error => of({ data: null, error }))
      );
  }
}
