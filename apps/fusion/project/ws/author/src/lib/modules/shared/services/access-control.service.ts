/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Injectable, Inject } from '@angular/core'
import { NSContent } from '@ws/author/src/lib/interface/content'
import { ConfigurationsService } from '@ws-widget/utils'
import { APP_BASE_HREF } from '@angular/common'

@Injectable()
export class AccessControlService {

  constructor(
    private configService: ConfigurationsService,
    @Inject(APP_BASE_HREF) private baseHref: string,
  ) { }

  hasRole(role: string[]): boolean {
    let returnValue = false
    role.forEach(v => {
      if ((this.configService.userRoles || new Set()).has(v)) {
        returnValue = true
      }
    })
    return returnValue
  }

  get userId(): string {
    if (this.configService.userProfile) {
      return this.configService.userProfile.userId
    }
    return ''
  }

  get locale(): string {
    // return this.configService.userPreference && this.configService.userPreference.selectedLocale ?
    //   this.configService.userPreference.selectedLocale : 'en'
    return this.baseHref && this.baseHref.replace(/\//g, '') ?
      this.baseHref.replace(/\//g, '').split('-')[0] : 'en'
  }

  get org(): string {
    return this.configService.activeOrg || 'Infosys Ltd'
  }

  get rootOrg(): string {
    return this.configService.rootOrg || 'Infosys'
  }

  get orgRootOrgAsQuery(): string {
    return `?rootOrg=${this.rootOrg}&org=${this.org}`
  }

  get defaultLogo(): string {
    return this.configService.instanceConfig ? this.configService.instanceConfig.logos.defaultContent : ''
  }

  get appName(): string {
    return this.configService.instanceConfig ? this.configService.instanceConfig.details.appName : 'Wingspan'
  }

  get activePrimary(): string {
    return this.configService.activeThemeObject ? this.configService.activeThemeObject.color.primary : ''
  }

  hasAccess(meta: NSContent.IContentMeta, forPreview = false): boolean {
    if (this.hasRole(['editor', 'admin'])) {
      return true
    }
    let returnValue = false
    if (['Draft', 'Live'].indexOf(meta.status) > -1 && this.hasRole(['creator'])) {
      if (meta.creatorContacts && meta.creatorContacts.length) {
        meta.creatorContacts.forEach(v => {
          if (v.id === this.userId) {
            returnValue = true
          }
        })
      }
    }
    if (meta.status === 'InReview' && this.hasRole(['reviewer'])) {
      if (meta.trackContacts && meta.trackContacts.length) {
        meta.trackContacts.forEach(v => {
          if (v.id === this.userId) {
            returnValue = true
          }
        })
      }
    }
    if (['Reviewed'].indexOf(meta.status) > -1 && this.hasRole(['publisher'])) {
      if (meta.publisherDetails && meta.publisherDetails.length) {
        meta.publisherDetails.forEach(v => {
          if (v.id === this.userId) {
            returnValue = true
          }
        })
      }
    }
    if (forPreview && meta.visibility === 'Public') {
      returnValue = true
    }
    return returnValue
  }
}
