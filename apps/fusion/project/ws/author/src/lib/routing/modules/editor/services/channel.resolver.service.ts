/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { AUTHORING_CONTENT_BASE } from '@ws/author/src/lib/constants/apiEndpoints'
import { Injectable } from '@angular/core'
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router'
import { Observable, of } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { ApiService } from '../../../../modules/shared/services/api.service'

@Injectable()
export class ChannelJSONResolver implements Resolve<any> {

  constructor(
    private apiService: ApiService,
    private router: Router,
  ) {
  }

  resolve(
    route: ActivatedRouteSnapshot,
  ): Observable<any> {
    if (route.parent && route.parent.data.content &&
      route.parent.data.content.artifactUrl) {
      return this.apiService.get(
        AUTHORING_CONTENT_BASE + encodeURIComponent(route.parent.data.content.artifactUrl),
      ).pipe(
        catchError((v: any) => {
          this.router.navigateByUrl('/error-somethings-wrong')
          return of(v)
        }),
      )
    }
    return of(null)
  }
}
