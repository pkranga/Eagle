/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { tap } from 'rxjs/operators'
import { NSSearch } from '../_services/widget-search.model'

const API_END_POINTS = {
  catalog: '/apis/protected/v8/catalog',
}

@Injectable({
  providedIn: 'root',
})
export class TreeCatalogService {

  _catalog: NSSearch.IFilterUnitContent[] | null = null
  _catalog$: Observable<NSSearch.IFilterUnitContent[]> | null = null

  constructor(
    private http: HttpClient,
  ) { }

  getCatalog(url: string, type?: string, tags?: string) {
    if (!type || !tags) {
      return this.getFullCatalog(url)
    }

    return this.http.post<NSSearch.IFilterUnitContent[]>(url, { type, tags })
  }

  getFullCatalog(url?: string) {
    if (this._catalog) {
      return of(this._catalog)
    }

    if (!this._catalog$) {
      this._catalog$ = this.http.get<NSSearch.IFilterUnitContent[]>(url ? url : API_END_POINTS.catalog).pipe(
        tap(catalog => this._catalog = catalog),
      )
    }

    return this._catalog$
  }
}
