/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { TncService } from '../services/tnc.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(
    private router: Router,
    private authSvc: AuthService,
    private tncSvc: TncService
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (!this.authSvc.isAuthenticated) {
      return true;
    }
    if (!this.tncSvc.hasAcceptedTnC) {
      return this.router.parseUrl('/tnc');
    }
    if (next.queryParamMap.has('ref')) {
      return this.router.parseUrl(next.queryParamMap.get('ref'));
    }
    return this.router.parseUrl('/home');
  }
}
