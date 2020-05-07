/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Injectable } from '@angular/core'
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { Observable, of } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { map, catchError } from 'rxjs/operators'
import { IResolveResponse } from '@ws-widget/utils'

@Injectable({
  providedIn: 'root',
})
export class MarketingOfferingResolve
  implements
  Resolve<
  | Observable<IResolveResponse<any>>
  | IResolveResponse<any>
  > {
  constructor(
    private http: HttpClient,
  ) { }

  resolve(
    route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot,
  ): Observable<IResolveResponse<any>> {
    const tag = route.params.tag
    return this.http.get(route.data.pageUrl).pipe(
      map(pageData => ({ data: this.transformPageData(pageData, tag), error: null })),
      catchError(err => of({ data: null, error: err })),
    )
  }

  private transformPageData(pageData: any, tag: string) {
    pageData.pageLayout.widgetData.widgets = pageData.pageLayout.widgetData.widgets.map((widget: any) => {
      if (widget.widgetSubType === 'contentStripMultiple') {
        widget.widgetData.strips = widget.widgetData.strips.map((strip: any) => {
          strip.request.search.filters.catalogPaths = [decodeURIComponent(tag)]
          return strip
        })
      }

      return widget
    })

    return pageData
  }
}
