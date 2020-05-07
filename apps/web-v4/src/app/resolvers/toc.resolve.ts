/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { IContent } from '../models/content.model';
import { ResolveResponse } from '../models/routeResolver.model';
import { ContentService } from '../services/content.service';

@Injectable()
export class TocResolve
  implements
  Resolve<Observable<ResolveResponse<IContent>> | ResolveResponse<IContent>> {
  constructor(
    private contentSvc: ContentService
  ) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<ResolveResponse<IContent>> {
    return this.contentSvc.fetchContent(route.paramMap.get('contentId')).pipe(
      map(data => ({ data, error: null })),
      catchError(error => of({ data: null, error }))
    );
  }
}
