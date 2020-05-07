/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { INIT } from '@ws/author/src/lib/constants/apiEndpoints'
import { Injectable } from '@angular/core'
import { Resolve } from '@angular/router'
import { Observable } from 'rxjs'
import { ApiService } from './api.service'
import { AccessControlService } from './access-control.service'

@Injectable({
  providedIn: 'root',
})
export class AuthInitResolver implements Resolve<any> {

  constructor(
    private svc: ApiService,
    private accessService: AccessControlService,
  ) {
  }

  resolve(): Observable<any> {
    return this.svc.get(
      `${INIT}${this.accessService.orgRootOrgAsQuery}&lang=${this.accessService.locale}`,
    )
  }
}
