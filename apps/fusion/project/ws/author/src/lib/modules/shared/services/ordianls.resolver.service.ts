/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { ORDINALS } from '@ws/author/src/lib/constants/apiEndpoints'
import { Injectable } from '@angular/core'
import { Resolve, Router } from '@angular/router'
import { Observable, of } from 'rxjs'
import { map, tap, catchError } from 'rxjs/operators'
import { ApiService } from './api.service'
import { AVAILABLE_LOCALES } from '@ws/author/src/lib/constants/constant'
import { AccessControlService } from './access-control.service'

@Injectable()
export class OrdinalsResolver implements Resolve<any> {

  ordinals!: any
  constructor(
    private svc: ApiService,
    private accessService: AccessControlService,
    private router: Router,
  ) {
  }

  resolve(): Observable<any> {
    return this.ordinals ?
      of(this.ordinals) :
      this.svc.get(
        `${ORDINALS}${this.accessService.orgRootOrgAsQuery}`,
      ).pipe(
        map((v: any) => {
          if (!v.locale) {
            v.subTitles = v.subTitles.filter((val: any) => AVAILABLE_LOCALES.indexOf(val.srclang) > -1)
          } else {
            v.subTitles = v.locale
          }
          return v
        }),
        tap((v: any) => {
          this.ordinals = v
        }),
        catchError((v: any) => {
          this.router.navigateByUrl('/error-somethings-wrong')
          return v
        }),
      )
  }
}
