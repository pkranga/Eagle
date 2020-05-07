/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { AuthInitService } from './init.service'
import { ConfigurationsService } from '@ws-widget/utils'
import { CKEditorResolverService } from './ckeditor-resolve.service'
import { Injectable } from '@angular/core'
import { Resolve, Router } from '@angular/router'
import { Observable, of, forkJoin } from 'rxjs'
import { ApiService } from '../modules/shared/services/api.service'
import { NSContent } from '../interface/content'
import { catchError, tap } from 'rxjs/operators'
import { IFormMeta } from '../interface/form'

@Injectable()
export class InitResolver implements Resolve<NSContent.IContentMeta> {

  constructor(
    private apiService: ApiService,
    private router: Router,
    private ckEditorInject: CKEditorResolverService,
    private configurationsService: ConfigurationsService,
    private authInitService: AuthInitService,
  ) {
  }

  resolve(): Observable<any> {
    return forkJoin(
      [
        this.authInitService.authConfig ?
          of(this.authInitService.authConfig) :
          this.apiService.get<IFormMeta>(`${this.configurationsService.baseUrl}/feature/auth-meta-form.json`)
        ,
        this.ckEditorInject.inject(),
      ],
    ).pipe(
      tap(v => {
        this.authInitService.authConfig = v[0]
      }),
      catchError((v: any) => {
        this.router.navigateByUrl('/error-somethings-wrong')
        return of(v)
      }),
    )
  }
}
