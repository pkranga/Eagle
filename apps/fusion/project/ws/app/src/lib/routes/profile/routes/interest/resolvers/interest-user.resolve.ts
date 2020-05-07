/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Injectable } from '@angular/core'
import { Resolve } from '@angular/router'

import { Observable, of } from 'rxjs'
import { InterestService } from '../services/interest.service'
import { map, catchError } from 'rxjs/operators'
import { IResolveResponse } from 'library/ws-widget/utils/src/lib/resolvers/resolver.model'

@Injectable()
export class InterestUserResolve
  implements Resolve<Observable<IResolveResponse<string[]>> | IResolveResponse<string[]>> {
  constructor(private interestSvc: InterestService) {}

  resolve(): Observable<IResolveResponse<string[]>> | IResolveResponse<string[]> {
    return this.interestSvc.fetchUserInterestsV2().pipe(
      map(data => ({ data, error: null })),
      catchError(error => of({ error, data: null })),
    )
  }
}
