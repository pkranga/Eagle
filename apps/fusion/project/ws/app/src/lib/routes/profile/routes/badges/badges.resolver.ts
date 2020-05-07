/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Injectable } from '@angular/core'
import { Resolve } from '@angular/router'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { IResolveResponse } from '@ws-widget/utils'
import { IBadgeResponse } from './badges.model'
import { BadgesService } from './badges.service'

@Injectable()
export class BadgesResolver
  implements
  Resolve<
  Observable<IResolveResponse<{ response: IBadgeResponse }>> | IResolveResponse<IBadgeResponse>
  > {
  constructor(private badgesSvc: BadgesService) { }

  resolve(): Observable<IResolveResponse<IBadgeResponse>> | IResolveResponse<IBadgeResponse> {
    return this.badgesSvc.fetchBadges().pipe(
      map(data => ({ data, error: null })),
      catchError(() => of({ data: null, error: null })),
    )
  }
}
