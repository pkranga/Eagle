/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { AccessControlService } from '../services/access-control.service';

@Injectable({
  providedIn: 'root'
})
export class ContentAccessGuard implements CanActivate {
  constructor(private router: Router, private accessControlSvc: AccessControlService) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const ids: string[] = [];
    const contentId = next.queryParamMap.get('contentId');
    if (next.data && Array.isArray(next.data.contentAccessKeys) && next.data.contentAccessKeys.length) {
      for (const key of next.data.contentAccessKeys) {
        if (next.paramMap.get(key)) {
          ids.push(next.paramMap.get(key));
        }
      }
    } else {
      ids.push(contentId);
    }
    if (ids.includes('INTERACTIVE_VIDEO')) {
      return true;
    }
    return this.accessControlSvc.checkContentAccess(ids).pipe(
      map(accessHash => {
        const hasAccess = ids.every(id => accessHash[id] && accessHash[id].hasAccess);
        if (hasAccess) {
          return true;
        } else {
          this.router.navigateByUrl('/error/forbidden');
          return false;
        }
      })
    );
  }
}
