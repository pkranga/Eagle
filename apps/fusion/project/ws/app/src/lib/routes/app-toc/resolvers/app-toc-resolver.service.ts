/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Injectable } from '@angular/core'
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router'
import { Observable, of } from 'rxjs'
import { map, catchError, tap } from 'rxjs/operators'
import { IResolveResponse } from '@ws-widget/utils/src/public-api'
import { NsContent, WidgetContentService, PipeContentRoutePipe } from '@ws-widget/collection'

const ADDITIONAL_FIELDS_IN_CONTENT = [
  'averageRating',
  'body',
  'creatorContacts',
  'creatorDetails',
  'curatedTags',
  'contentType',
  'collections',
  'hasTranslations',
  'expiryDate',
  'exclusiveContent',
  'introductoryVideo',
  'introductoryVideoIcon',
  'isInIntranet',
  'isTranslationOf',
  'keywords',
  'learningMode',
  'playgroundResources',
  'price',
  'registrationInstructions',
  'region',
  'registrationUrl',
  'resourceType',
  'subTitle',
  'softwareRequirements',
  'systemRequirements',
  'totalRating',
  'uniqueLearners',
  'viewCount',
  'labels',
  'sourceUrl',
  'sourceName',
  'sourceIconUrl',
  'locale',
]
@Injectable()
export class AppTocResolverService
  implements
  Resolve<
  Observable<IResolveResponse<NsContent.IContent>> | IResolveResponse<NsContent.IContent>
  > {
  constructor(
    private contentSvc: WidgetContentService,
    private routePipe: PipeContentRoutePipe,
    private router: Router,
  ) { }

  resolve(
    route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot,
  ): Observable<IResolveResponse<NsContent.IContent>> {
    const contentId = route.paramMap.get('id')
    if (contentId) {
      return this.contentSvc.fetchContent(contentId, 'detail', ADDITIONAL_FIELDS_IN_CONTENT).pipe(
        map(data => ({ data, error: null })),
        tap(resolveData => {
          let currentRoute: string[] | string = window.location.href.split('/')
          currentRoute = currentRoute[currentRoute.length - 1]
          if (currentRoute === 'contents' && resolveData.data && !resolveData.data.children.length) {
            this.router.navigate([`/app/toc/${resolveData.data.identifier}/overview`])
          } else if (
            resolveData.data &&
            (resolveData.data.contentType === NsContent.EContentTypes.CHANNEL ||
              resolveData.data.contentType === NsContent.EContentTypes.KNOWLEDGE_BOARD)
          ) {
            const urlObj = this.routePipe.transform(resolveData.data)
            this.router.navigate([urlObj.url], { queryParams: urlObj.queryParams })
          }
        }),
        catchError((error: any) => of({ error, data: null })),
      )
    }
    return of({ error: 'NO_ID', data: null })
  }
}
