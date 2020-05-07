/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { IUserFetchGroupForEducatorResponse } from '../models/exercise-submission.model';
import { ExerciseService } from '../services/exercise-submission.service';

@Injectable({
  providedIn: 'root'
})
export class EducatorGuard implements CanActivate {
  constructor(
    private exerciseService: ExerciseService,
    private router: Router
  ) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.exerciseService.fetchGroupForEducator()
      .pipe(
        map((data: IUserFetchGroupForEducatorResponse[]) => data.length > 0),
        tap(shouldAllow => {
          if (!shouldAllow) {
            this.router.navigateByUrl('/error/forbidden');
          }
        }));
  }
}
