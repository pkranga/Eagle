/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivate,
  Router,
  UrlTree,
} from '@angular/router'

@Injectable({
  providedIn: 'root',
})
export class ChannelsGuard implements CanActivate {
  constructor(private router: Router) {}
  canActivate(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): UrlTree {
    try {
      if (route.parent && route.parent.data) {
        return this.router.parseUrl(
          route.parent.data.channelsData.data.tabs[0].tabDetails.routerLink,
        )
      }
    } catch (err) {}
    return this.router.parseUrl('/error/not-found')
  }
}
