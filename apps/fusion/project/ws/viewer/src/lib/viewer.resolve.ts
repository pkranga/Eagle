/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
} from '@angular/router'
import { catchError, map, tap } from 'rxjs/operators'
import { Observable, of } from 'rxjs'
import { WidgetContentService, NsContent, VIEWER_ROUTE_FROM_MIME } from '@ws-widget/collection'
import { IResolveResponse, AuthMicrosoftService, ConfigurationsService } from '@ws-widget/utils'
import { ViewerDataService } from './viewer-data.service'
import { MobileAppsService } from '../../../../../src/app/services/mobile-apps.service'

const ADDITIONAL_FIELDS_IN_CONTENT = [
  'creatorContacts',
  'source',
  'exclusiveContent',
]
@Injectable()
export class ViewerResolve
  implements
  Resolve<
  Observable<IResolveResponse<NsContent.IContent>> | IResolveResponse<NsContent.IContent> | null
  > {
  constructor(
    private contentSvc: WidgetContentService,
    private viewerDataSvc: ViewerDataService,
    private mobileAppsSvc: MobileAppsService,
    private router: Router,
    private msAuthSvc: AuthMicrosoftService,
    private configSvc: ConfigurationsService,
  ) { }

  resolve(route: ActivatedRouteSnapshot): Observable<IResolveResponse<NsContent.IContent>> | null {
    if (route.queryParamMap.get('preview') === 'true') {
      return null
    }
    const resourceType = route.data.resourceType
    this.viewerDataSvc.reset(route.paramMap.get('resourceId'))
    if (!this.viewerDataSvc.resourceId) {
      return null
    }

    return this.contentSvc
      .fetchContent(this.viewerDataSvc.resourceId, 'detail', ADDITIONAL_FIELDS_IN_CONTENT)
      .pipe(
        tap(content => {
          if (content.status === 'Deleted' || content.status === 'Expired') {
            this.router.navigate([`/app/toc/${content.identifier}/overview`])
          }
          if (content.ssoEnabled) {
            this.msAuthSvc.loginForSSOEnabledEmbed(this.configSvc.userProfile && this.configSvc.userProfile.email || '')
          }

          if (resourceType === 'unknown') {
            this.router.navigate([`/viewer/${VIEWER_ROUTE_FROM_MIME(content.mimeType)}/${content.identifier}`])
          } else if (resourceType === VIEWER_ROUTE_FROM_MIME(content.mimeType)) {
            this.viewerDataSvc.updateResource(content, null)
          } else {
            this.viewerDataSvc.updateResource(null, {
              errorType: 'mimeTypeMismatch',
              mimeType: content.mimeType,
              probableUrl: `/viewer/${VIEWER_ROUTE_FROM_MIME(content.mimeType)}/${content.identifier}`,
            })
          }
        }),
        map(data => {
          if (resourceType === 'unknown') {
            this.router.navigate([`/viewer/${VIEWER_ROUTE_FROM_MIME(data.mimeType)}/${data.identifier}`])
          } else if (resourceType === VIEWER_ROUTE_FROM_MIME(data.mimeType)) {
            this.mobileAppsSvc.sendViewerData(data)
            return { data, error: null }
          }
          return { data: null, error: 'mimeTypeMismatch' }
        },
        ),
        catchError(error => {
          this.viewerDataSvc.updateResource(null, error)
          return of({ error, data: null })
        }),
      )
  }
}
