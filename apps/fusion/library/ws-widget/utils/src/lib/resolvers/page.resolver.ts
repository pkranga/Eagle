/*               "Copyright 2020 Infosys Ltd.
http://http-url
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
http://http-url
import { Inject, Injectable, LOCALE_ID } from '@angular/core'
import { ActivatedRouteSnapshot, Resolve } from '@angular/router'
import { forkJoin, Observable, of } from 'rxjs'
import { catchError, map, mergeMap } from 'rxjs/operators'
import { ConfigurationsService } from '../services/configurations.service'
import { JSON_MAP } from './page.constant'
import { NsPage } from './page.model'
import { IResolveResponse } from './resolver.model'

@Injectable({
  providedIn: 'root',
})
export class PageResolve implements Resolve<IResolveResponse<NsPage.IPage>> {
  private baseUrl = this.configSvc.sitePath
  constructor(
    private configSvc: ConfigurationsService,
http://http-url
    @Inject(LOCALE_ID) private locale: string,
  ) { }
  resolve(
    route: ActivatedRouteSnapshot,
  ): Observable<IResolveResponse<NsPage.IPage>> | IResolveResponse<NsPage.IPage> {
    if (route.data.pageUrl) {
      return this.getData(route.data.pageUrl)
    }
    if (route.data.pageType === 'feature' && route.data.pageKey) {
      return this.getData(`${this.baseUrl}/feature/${route.data.pageKey}`)
    }
    if (
      route.data.pageType === 'page' &&
      route.data.pageKey &&
      route.paramMap.has(route.data.pageKey)
    ) {
      return this.getData(`${this.baseUrl}/page/${route.paramMap.get(route.data.pageKey)}`)
    }
    return {
      data: null,
      error: 'CONFIGURATION_ERROR_PAGE_URL_NOT_FORMED',
    }
  }

  private setS3Cookie(contentId: string): Observable<any> {
http://http-url
      catchError(_err => of(true)),
    )
  }

  private getData(url: string) {
    let generatedUrlS3Url = ''
    const id = (url.split('/').pop() as string).split('.')[0] || ''
    const equivalentId = id.startsWith('lex_auth_') ? id : JSON_MAP[id]
    if (equivalentId) {
      generatedUrlS3Url =
        // tslint:disable-next-line: max-line-length
        `${
http://http-url
path
          : window.location.origin
        }/content-store/${(this.configSvc.rootOrg || '').replace(/ /g, '_')}/${
        (this.configSvc.activeOrg || '').replace(/ /g, '_')
        }/Public/${equivalentId}/web-hosted/channel.json`
    }
    if (url.endsWith('.json') || this.locale === 'en' || this.locale === 'en-US') {
      return (equivalentId ? this.setS3Cookie(equivalentId) : of(true)).pipe(
        mergeMap(() =>
http://http-url
            .get<NsPage.IPage>(
              generatedUrlS3Url ? generatedUrlS3Url : url.endsWith('.json') ? url : `${url}.json`,
            )
            .pipe(
              map(data => ({ data, error: null })),
              catchError(err => of({ data: null, error: err })),
            ),
        ),
      )
    }
    const pageRequest = [
      (equivalentId ? this.setS3Cookie(equivalentId) : of(true)).pipe(
        mergeMap(() =>
http://http-url
            map(data => ({ data, error: null })),
            catchError(err => of({ data: null, error: err })),
          ),
        ),
      ),
http://http-url
        map(data => ({ data, error: null })),
        catchError(err => of({ data: null, error: err })),
      ),
    ]
    return forkJoin(pageRequest).pipe(
      map(
        ([general, withLocale]): IResolveResponse<NsPage.IPage> => {
          if (withLocale.data) {
            return withLocale
          }
          return general
        },
      ),
    )
  }

}
