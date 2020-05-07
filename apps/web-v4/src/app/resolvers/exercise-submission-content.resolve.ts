/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ResolveResponse } from '../models/routeResolver.model';
import { ContentService } from '../services/content.service';

@Injectable()
export class ExerciseSubmissionContentResolve
  implements Resolve<Observable<ResolveResponse<any>> | ResolveResponse<any>> {
  constructor(private contentSvc: ContentService, private http: HttpClient) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<ResolveResponse<any>> {
    const contentId = route.paramMap.get('contentId') ? route.paramMap.get('contentId') : route.queryParamMap.get('contentId')
    return this.contentSvc.fetchContent(contentId).pipe(
      switchMap(content => {
        if (content) {
          return this.http.get(content.artifactUrl).pipe(
            map(data => ({ content, data, error: null })),
            catchError(error => of({ content: content, data: null, error }))
          );
        }
        return of({ data: null, content: null, error: 'invalid_content_id' });
      }),
      catchError<any, Observable<ResolveResponse<any>>>
        (error => of<any>({ data: null, content: null, error: 'fetch_content_failed' + error }))
    );
  }
}
