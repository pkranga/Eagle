/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Injectable } from '@angular/core'
import { CanActivate, UrlTree, Router } from '@angular/router'
import { Observable } from 'rxjs'
import { ConfigurationsService } from '@ws-widget/utils/src/public-api'

@Injectable({
  providedIn: 'root',
})
export class AnalyticsGuard implements CanActivate {
  constructor(
    private configSvc: ConfigurationsService,
    private router: Router,
  ) {
  }
  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.configSvc.userRoles && (this.configSvc.userRoles.has('analytics') || this.configSvc.userRoles.has('admin'))) {
      return true
    }
    return this.router.parseUrl('/page/home')
  }

}
