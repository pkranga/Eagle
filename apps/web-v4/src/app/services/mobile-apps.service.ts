/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, fromEvent, Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { ITheme } from '../models/comm-events.model';
import { IContent } from '../models/content.model';
import { CHAT_BOT_VISIBILITY, DISPLAY_SETTING, DOWNLOAD_REQUESTED, GET_PLAYERCONTENT_JSON, GO_OFFLINE, IOS_OPEN_IN_BROWSER, ISAUTHENTICATED_OUTGOING, NAVIGATION_DATA_INCOMING, PORTAL_THEME, SESSIONID_OUTGOING, TLiveEvent, TOKEN_OUTGOING } from '../models/mobile-apps-events.model';
import { AuthService } from './auth.service';
import { NavigationExternalService } from './navigation-external.service';

interface WindowMobileAppModified extends Window {
  appRef?: any;
  webkit?: any;
  navigateTo?: any;
  getToken?: any;
  getSessionId?: any;
  isAuthenticated?: any;
  dispatchEventFlag?: any;
}
declare var window: WindowMobileAppModified;

@Injectable({
  providedIn: 'root'
})
export class MobileAppsService {
  private downloads$: BehaviorSubject<string[]> = null;

  constructor(
    private authSvc: AuthService,
    private router: Router,
    // injecting navigateSvc for mobiles to navigate. don't delete
    private navigateSvc: NavigationExternalService
  ) {
    // this.simulateMobile();
    this.captureIapEventsAndRedirect();
    this.setupGlobalMethods();
    if (this.isMobile) {
      this.captureAndStoreMobileDownloadIds();
    }
  }

  simulateMobile() {
    window.appRef = {
      getAndroidAppVer: () => {
        return '2.0.9';
      }
    };
    window.webkit = {};
  }

  get isMobile(): boolean {
    return Boolean(this.isAndroidApp || this.iOsAppRef);
  }

  get isAndroidApp(): boolean {
    return Boolean(window.appRef);
  }

  get iOsAppRef() {
    if (
      window.webkit &&
      window.webkit.messageHandlers &&
      window.webkit.messageHandlers.appRef
    ) {
      return window.webkit.messageHandlers.appRef;
    }
    return null;
  }

  get canShowSettings(): boolean {
    if (window.appRef) {
      if (window.appRef[DISPLAY_SETTING]) {
        return true;
      }
      return false;
    }
    if (window.webkit) {
      if (this.iOsAppRef) {
        return true;
      }
      return false;
    }
  }

  private captureIapEventsAndRedirect() {
    fromEvent<MessageEvent>(window, 'message')
      .pipe(
        filter(
          event =>
            event &&
            event.data &&
            event.data.app === 'IAP' &&
            event.data.type === 'NAVIGATION_NOTIFY'
        ),
        tap(event =>
          console.log('NAVIGATION_NOTIFY received from IAP', event.data)
        )
      )
      .subscribe((event: MessageEvent) => {
        if (event.data.data && event.data.data.url && this.isMobile) {
          this.router.navigate(['practice', 'proctoring'], {
            queryParams: { contestUrl: event.data.data.url }
          });
        }
      });
  }

  goOffline() {
    this.sendDataAppToClient(GO_OFFLINE, {});
  }
  sendLiveEvent(event: TLiveEvent) {
    this.sendDataAppToClient(event, {});
  }
  viewSettings() {
    this.sendDataAppToClient(DISPLAY_SETTING, {});
  }
  sendTheme(themeData: ITheme) {
    if (this.isMobile) {
      console.log('SENDING THEME TO MOBILE APP');
    }
    this.sendDataAppToClient(PORTAL_THEME, themeData);
  }
  sendViewerData(viewerData: IContent) {
    this.sendDataAppToClient(GET_PLAYERCONTENT_JSON, viewerData);
  }
  downloadResource(id: string) {
    this.sendDataAppToClient(DOWNLOAD_REQUESTED, id);
  }
  appChatbotVisibility(isVisible: 'yes' | 'no') {
    this.sendDataAppToClient(CHAT_BOT_VISIBILITY, isVisible);
  }
  iosOpenInBrowserRequest(url: string) {
    this.sendDataAppToClient(IOS_OPEN_IN_BROWSER, {
      url
    });
  }

  setupGlobalMethods() {
    // Incoming Requests
    window.navigateTo = (url: string, params?: any) => {
      document.dispatchEvent(
        new CustomEvent(NAVIGATION_DATA_INCOMING, { detail: { url, params } })
      );
    };

    // Incoming Requests with outgoing data
    window.getToken = () =>
      this.sendDataAppToClient(TOKEN_OUTGOING, this.authSvc.token);
    window.getToken();
    window.getSessionId = () =>
      this.sendDataAppToClient(SESSIONID_OUTGOING, this.authSvc.sessionId);
    window.isAuthenticated = () =>
      this.sendDataAppToClient(
        ISAUTHENTICATED_OUTGOING,
        this.authSvc.isAuthenticated
      );

    setTimeout(() => {
      if (window.appRef) {
        if (
          !(
            window.appRef.getAndroidAppVer &&
            this.ifValidAndroidVersion(window.appRef.getAndroidAppVer())
          )
        ) {
          console.log('%c INVALID APP VERSION', 'font-size:40px; color: red');
          this.router.navigate(['mobile-app'], {
            queryParams: { outdated: 'android' },
            replaceUrl: true
          });
        } else {
          console.log(
            '%c TIS A VALID APP VERSION',
            'font-size:20px; color: green'
          );
        }
      }
    }, 3000);
  }

  isFunctionAvailableInAndroid(functionName: string) {
    if (window.appRef && window.appRef[functionName]) {
      return true;
    }
    return false;
  }

  private sendDataAppToClient(eventName: string, data: any) {
    if (window.appRef && window.appRef[eventName]) {
      if (eventName === PORTAL_THEME) {
        console.log('eventName >', eventName, data);
      }
      if (eventName === DISPLAY_SETTING) {
        window.appRef[eventName]();
      } else {
        window.appRef[eventName](JSON.stringify(data));
      }
    } else if (this.iOsAppRef) {
      this.iOsAppRef.postMessage(JSON.stringify({ eventName, data }));
    } else {
      if (window.dispatchEventFlag) {
        document.dispatchEvent(new CustomEvent(eventName, { detail: data }));
      } else {
        // console.log(eventName, data)
      }
    }
  }

  private ifValidAndroidVersion(version: string): boolean {
    try {
      // two types of versions incoming one with 'V: num' and other as 'num'
      if (version.toLowerCase().indexOf('v') !== -1) {
        version = version.split(':')[1].trim();
      }
      const verArray = version
        .trim()
        .split('.')
        .map(u => Number(u));
      // to un-support versions less than 2.1.0 as requested by Akansha
      if (
        verArray.length === 3 &&
        Number(verArray.join('')) < 210
      ) {
        return false;
      }
      return true;
    } catch (e) {
      console.log('ERROR WHILE VALIDATING ANDROID VERSION >', e);
      return false;
    }
  }

  getDownloadStatusFor(id: string): Observable<boolean> {
    if (this.downloads$ === null) {
      this.downloads$ = new BehaviorSubject(null);
    }
    return this.downloads$.pipe(
      filter(downloads => downloads !== null),
      map(downloads => {
        return downloads.includes(id);
      })
    );
  }

  private captureAndStoreMobileDownloadIds() {
    fromEvent<MessageEvent>(window, 'message')
      .pipe(
        filter(
          event => event && event.data && event.data.type === 'DOWNLOAD_IDS'
        )
      )
      .subscribe((eventData) => {
        if (eventData.data && eventData.data.data && eventData.data.data.contentIds && Array.isArray(eventData.data.data.contentIds)) {
          this.downloads$.next(eventData.data.data.contentIds);
        }
      });
  }
}
