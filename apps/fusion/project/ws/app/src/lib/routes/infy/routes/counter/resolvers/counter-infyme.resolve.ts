/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Injectable } from '@angular/core'
import { Resolve } from '@angular/router'

import { Observable, of } from 'rxjs'
import { map, catchError } from 'rxjs/operators'
import { IResolveResponse } from '@ws-widget/utils'
import { ICounterInfyMeResponse } from '../models/counter.model'
import { CounterService } from '../../ocm/services/counter.service'

@Injectable()
export class CounterInfyMeResolve
  implements Resolve<Observable<IResolveResponse<ICounterInfyMeResponse>> | IResolveResponse<ICounterInfyMeResponse>> {
  constructor(private counterSvc: CounterService) { }

  resolve(): Observable<IResolveResponse<ICounterInfyMeResponse>> | IResolveResponse<ICounterInfyMeResponse> {
    return this.counterSvc.fetchInfyMeCounterData().pipe(
      map(data => ({ data, error: null })),
      // tslint:disable-next-line: object-shorthand-properties-first
      catchError(error => of({ data: null, error })),
    )
  }
}
