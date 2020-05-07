/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Observable, of } from 'rxjs'
import { Injectable } from '@angular/core'
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router'

@Injectable({
  providedIn: 'root',
})
export class ExternalUrlResolverService implements CanActivate {
  canActivate(next: ActivatedRouteSnapshot): Observable<boolean> {
    const externalUrl = next.paramMap.get('externalUrl') as string
    window.open(externalUrl, '_self')
    return of(false)
  }
}
