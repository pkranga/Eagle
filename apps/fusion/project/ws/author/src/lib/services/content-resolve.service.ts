/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Injectable } from '@angular/core'
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router'
import { Observable, of } from 'rxjs'
import { ApiService } from '../modules/shared/services/api.service'
import { NSContent } from '../interface/content'
import { CONTENT_READ } from '../constants/apiEndpoints'
import { AccessControlService } from '@ws/author/src/lib/modules/shared/services/access-control.service'
import { catchError } from 'rxjs/operators'

@Injectable()
export class ContentTOCResolver implements Resolve<NSContent.IContentMeta> {

  constructor(
    private apiService: ApiService,
    private accessService: AccessControlService,
    private router: Router,
  ) {
  }

  resolve(
    route: ActivatedRouteSnapshot,
  ): Observable<NSContent.IContentMeta> {
    const id = route.params['id']
    return this.apiService.get<NSContent.IContentMeta>(
      `${CONTENT_READ}${id}${this.accessService.orgRootOrgAsQuery}`,
    ).pipe(
      catchError((v: any) => {
        this.router.navigateByUrl('/error-somethings-wrong')
        return of(v)
      }),
    )
  }
}
