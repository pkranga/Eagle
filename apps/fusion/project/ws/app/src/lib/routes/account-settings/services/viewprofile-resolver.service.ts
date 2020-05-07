/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Injectable } from '@angular/core'
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { Observable, of } from 'rxjs'
import { map, catchError } from 'rxjs/operators'
import { ConfigurationsService } from 'library/ws-widget/utils/src/lib/services/configurations.service'
import { NsMiniProfile, UserMiniProfileService } from '../../../../../../../../library/ws-widget/collection/src/public-api'
@Injectable({
  providedIn: 'root',
})
export class ViewprofileResolverService implements Resolve<NsMiniProfile.IMiniProfileData> {
  userId = ''
  constructor(
    private miniProfileSvc: UserMiniProfileService,
    private configSvc: ConfigurationsService,
  ) {
    if (this.configSvc.userProfile) {
      this.userId = this.configSvc.userProfile.userId || ''
    }
  }
  resolve(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot):
    Observable<any> {
    return this.miniProfileSvc.viewMiniProfile(this.userId).pipe(
      map(data => ({ data, error: null })),
      catchError(error => of({ error, data: null })),
    )
  }
}
