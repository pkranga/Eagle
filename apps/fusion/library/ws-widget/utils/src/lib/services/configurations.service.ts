/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Injectable } from '@angular/core'
import { BehaviorSubject, ReplaySubject } from 'rxjs'
import { environment } from '../../../../../../src/environments/environment'
import { NsPage } from '../resolvers/page.model'
import { NsAppsConfig, NsInstanceConfig, NsUser } from './configurations.model'
import { IUserPreference } from './user-preference.model'

let instanceConfigPath: string | null = window.location.host
let locationHost: string | null = window.location.host

if ((!environment.production) && Boolean(environment.sitePath)) {
  locationHost = environment.sitePath
  instanceConfigPath = environment.sitePath
}
@Injectable({
  providedIn: 'root',
})
export class ConfigurationsService {
  // update as the single source of truth

  appSetup = true
  baseUrl = `assets/configurations/${(locationHost || window.location.host).replace(':', '_')}`
  sitePath = `assets/configurations/${(instanceConfigPath || window.location.host).replace(':', '_')}`
  hostPath = (instanceConfigPath || window.location.host).replace(':', '_')

  userRoles: Set<string> | null = null
  userGroups: Set<string> | null = null
  restrictedFeatures: Set<string> | null = null
  restrictedWidgets: Set<string> | null = null
  instanceConfig: NsInstanceConfig.IConfig | null = null
  appsConfig: NsAppsConfig.IAppsConfig | null = null
  rootOrg: string | null = null
  org: string[] | null = null
  activeOrg: string | null = ''
  isProduction = false
  hasAcceptedTnc = false
  userPreference: IUserPreference | null = null
  userProfile: NsUser.IUserProfile | null = null

  isAuthenticated = false
  isNewUser = false

  // pinnedApps
  pinnedApps = new BehaviorSubject<Set<string>>(new Set())

  // Notifier
  prefChangeNotifier = new ReplaySubject<Partial<IUserPreference>>(1)
  tourGuideNotifier = new ReplaySubject<boolean>()
  authChangeNotifier = new ReplaySubject<boolean>(1)

  // Preference Related Values
  activeThemeObject: NsInstanceConfig.ITheme | null = null
  activeFontObject: NsInstanceConfig.IFontSize | null = null
  isDarkMode = false
  isIntranetAllowed = false
  isRTL = false
  activeLocale: NsInstanceConfig.ILocalsConfig | null = null
  activeLocaleGroup = ''

  primaryNavBar: Partial<NsPage.INavBackground> = {
    color: 'primary',
  }
  pageNavBar: Partial<NsPage.INavBackground> = {
    color: 'primary',
  }
  primaryNavBarConfig: NsInstanceConfig.IPrimaryNavbarConfig | null = null

}
