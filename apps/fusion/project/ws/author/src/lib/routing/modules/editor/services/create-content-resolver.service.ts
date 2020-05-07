/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { EditorService } from './editor.service'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Observable, of } from 'rxjs'
import { catchError } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class CreateContentResolverService {

  constructor(
    private editorService: EditorService,
    private router: Router,
  ) {
  }

  resolve(): Observable<any> {
    const meta = {
      mimeType: 'application/vnd.ekstep.content-collection',
      contentType: 'Knowledge Artifact',
    } as any
    return this.editorService.create(meta).pipe(
      catchError((v: any) => {
        this.router.navigateByUrl('/error-somethings-wrong')
        return of(v)
      }),
    )
  }
}
