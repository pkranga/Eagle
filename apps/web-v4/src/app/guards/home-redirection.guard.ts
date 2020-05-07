/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { UtilityService } from '../services/utility.service';
import { ConfigService } from '../services/config.service';

@Injectable({
  providedIn: 'root'
})
export class HomeRedirectionGuard implements CanActivate {
  constructor(
    private authSvc: AuthService,
    private utilSvc: UtilityService,
    private configSvc: ConfigService,
    private router: Router
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.configSvc.instanceConfig.features.siemens.enabled) {
      return this.utilSvc.getDataFromUrl('assets/hardcodings/home-redirection.json').pipe(
        map(userData => {
          if (userData) {
            const userEmail = this.authSvc.userEmail;
            // const userEmail = 'user1@demo.com';
            if (userData[userEmail]) {
              return this.router.parseUrl(userData[userEmail].pageUrl);
            }
          }
          return true;
        }),
        catchError(_ => of(true))
      );
    } else {
      return true;
    }
  }
}
