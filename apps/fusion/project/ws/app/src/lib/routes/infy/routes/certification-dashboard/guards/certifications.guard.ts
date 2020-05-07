/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router'

import { ConfigurationsService } from '@ws-widget/utils'

@Injectable()
export class CertificationsGuard implements CanActivate {
  constructor(private configSvc: ConfigurationsService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot) {
    const requiredFeatures: string[] = (next.data && next.data.requiredFeatures) || []

    if (requiredFeatures && requiredFeatures.length && this.configSvc.restrictedFeatures) {
      const requiredFeaturesMissing = requiredFeatures.some(item =>
        (this.configSvc.restrictedFeatures || new Set()).has(item),
      )

      if (requiredFeaturesMissing) {
        this.router.navigate(['/app/profile/assess/certification'])
        return false
      }
    }

    return true
  }
}
