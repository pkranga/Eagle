/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivate } from '@angular/router';
import { ConfigService } from '../services/config.service';

@Injectable({
  providedIn: 'root'
})
export class CertificationsGuard implements CanActivate {
  constructor(private configSvc: ConfigService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.configSvc.instanceConfig.features.certificationsLHub.available) {
      this.router.navigate(['certifications-dashboard']);
      return false;
    }
    return true;
  }
}
