/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Injectable } from '@angular/core'
import { Resolve } from '@angular/router'

import { Observable, of } from 'rxjs'
import { map, catchError } from 'rxjs/operators'
import { IResolveResponse } from '@ws-widget/utils'
import { NavigatorService } from '../services/navigator.service'

@Injectable()
export class SearchResultResolve
  implements Resolve<Observable<IResolveResponse<any>> | IResolveResponse<any>> {
  constructor(private navigatorSvc: NavigatorService) {}

  resolve(): Observable<IResolveResponse<any>> | IResolveResponse<any> {
    return this.navigatorSvc.fetchLearningPathData().pipe(
      map(data => ({ data, error: null })),
      catchError(_ => of({ data: null, error: null })),
    )
  }
}
