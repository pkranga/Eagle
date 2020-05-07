/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { IUserFetchMySubmissionsResponse } from '../models/exercise-submission.model';
import { ResolveResponse } from '../models/routeResolver.model';
import { ExerciseService } from '../services/exercise-submission.service';

@Injectable()
export class ExerciseSubmissionResolve
  implements Resolve<Observable<ResolveResponse<any>> | ResolveResponse<any>> {
  constructor(private exerciseSvc: ExerciseService) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<ResolveResponse<IUserFetchMySubmissionsResponse[]>> {
    const contentId = route.queryParamMap.get('contentId');
    const submissionId = route.queryParamMap.get('submissionId');
    const emailId = route.queryParamMap.get('emailId');
    if (!contentId || !submissionId || !emailId) {
      return of({ data: null, error: 'invalid_url' });
    } else {
      return this.exerciseSvc
        .fetchLatestSubmission(
          contentId,
          emailId
        )
        .pipe(
          map(data => ({ data, error: null })),
          catchError(error => of({ data: null, error }))
        );
    }
  }
}
