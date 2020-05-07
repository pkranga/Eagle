/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Injectable } from '@angular/core'
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'

import { Observable, of } from 'rxjs'
import { map, catchError, first } from 'rxjs/operators'

import { IResolveResponse } from '@ws-widget/utils'
import { NsContent, WidgetContentService } from '@ws-widget/collection'

@Injectable()
export class KbDetailResolve
  implements
  Resolve<
  | Observable<IResolveResponse<NsContent.IContent>>
  | IResolveResponse<NsContent.IContent>
  > {
  constructor(private contentSvc: WidgetContentService) { }

  resolve(
    route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot,
  ): Observable<IResolveResponse<NsContent.IContent>> {
    return this.contentSvc.fetchContent(
      route.params.id,
      'detail',
      ['averageRating', 'creatorContacts', 'creatorDetails', 'totalRating',
        'uniqueLearners', 'viewCount'])
      .pipe(
        first(),
        map(data => ({ data, error: null })),
        catchError(error => of({ error, data: null })),
      )
  }
}
