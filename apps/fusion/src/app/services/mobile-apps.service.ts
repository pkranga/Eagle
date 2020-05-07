/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Injectable } from '@angular/core'
import { NavigationExternalService } from './navigation-external.service'
import { NsContent } from '../../../library/ws-widget/collection/src/public-api'
import {
  CHAT_BOT_VISIBILITY,
  DISPLAY_SETTING,
  DOWNLOAD_REQUESTED,
  GET_PLAYERCONTENT_JSON,
  GO_OFFLINE,
  IOS_OPEN_IN_BROWSER,
  ISAUTHENTICATED_OUTGOING,
  NAVIGATION_DATA_INCOMING,
  SESSIONID_OUTGOING,
  TOKEN_OUTGOING,
} from '../models/mobile-events.model'
import { AuthKeycloakService } from '@ws-widget/utils'
interface IWindowMobileAppModified extends Window {
  appRef?: any
  webkit?: any
  navigateTo?: any
  getToken?: any
  getSessionId?: any
  isAuthenticated?: any
  dispatchEventFlag?: any
}
declare var window: IWindowMobileAppModified

@Injectable({
  providedIn: 'root',
})
export class MobileAppsService {

  constructor(
    private authSvc: AuthKeycloakService,
    private navigateSvc: NavigationExternalService,
  ) { }

  init() {
    this.setupGlobalMethods()
    this.navigateSvc.init()
  }

  public simulateMobile() {
    window.appRef = {}
    window.webkit = {}
  }

  get isMobile(): boolean {
    return Boolean(this.isAndroidApp || this.iOsAppRef)
  }

  get isAndroidApp(): boolean {
    return Boolean(window.appRef)
  }

  get iOsAppRef() {
    if (
      window.webkit &&
      window.webkit.messageHandlers &&
      window.webkit.messageHandlers.appRef
    ) {
      return window.webkit.messageHandlers.appRef
    }
    return null
  }

  get canShowSettings(): boolean {
    if (window.appRef && window.appRef[DISPLAY_SETTING]) {
      return true
    }
    if (window.webkit && this.iOsAppRef) {
      return true
    }
    return false
  }
  goOffline() {
    this.sendDataAppToClient(GO_OFFLINE, {})
  }
  viewSettings() {
    this.sendDataAppToClient(DISPLAY_SETTING, {})
  }
  sendViewerData(viewerData: NsContent.IContent) {
    this.sendDataAppToClient(GET_PLAYERCONTENT_JSON, viewerData)
  }
  downloadResource(id: string) {
    this.sendDataAppToClient(DOWNLOAD_REQUESTED, id)
  }
  appChatbotVisibility(isVisible: 'yes' | 'no') {
    this.sendDataAppToClient(CHAT_BOT_VISIBILITY, isVisible)
  }
  iosOpenInBrowserRequest(url: string) {
    this.sendDataAppToClient(IOS_OPEN_IN_BROWSER, {
      url,
    })
  }
  setupGlobalMethods() {
    // Incoming Requests
    window.navigateTo = (url: string, params?: any) => {
      document.dispatchEvent(
        new CustomEvent(NAVIGATION_DATA_INCOMING, { detail: { url, params } }),
      )
    }

    // Incoming Requests with outgoing data
    window.getToken = () =>
      this.sendDataAppToClient(TOKEN_OUTGOING, this.authSvc.token)
    window.getToken()
    window.getSessionId = () =>
      this.sendDataAppToClient(SESSIONID_OUTGOING, this.authSvc.sessionId)
    window.isAuthenticated = () =>
      this.sendDataAppToClient(
        ISAUTHENTICATED_OUTGOING,
        this.authSvc.isAuthenticated,
      )
  }

  isFunctionAvailableInAndroid(functionName: string) {
    if (window.appRef && window.appRef[functionName]) {
      return true
    }
    return false
  }

  sendDataAppToClient(eventName: string, data: any) {
    if (window.appRef && window.appRef[eventName]) {
      if (eventName === DISPLAY_SETTING) {
        window.appRef[eventName]()
      } else {
        window.appRef[eventName](JSON.stringify(data))
      }
    } else if (this.iOsAppRef) {
      this.iOsAppRef.postMessage(JSON.stringify({ eventName, data }))
    } else {
      if (window.dispatchEventFlag) {
        document.dispatchEvent(new CustomEvent(eventName, { detail: data }))
      } else {
        // console.log(eventName, data)
      }
    }
  }
}
