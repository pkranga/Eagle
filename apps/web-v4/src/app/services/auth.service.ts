/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import { KeycloakService, KeycloakEvent, KeycloakEventType, KeycloakInitOptions } from 'keycloak-angular';
import { BehaviorSubject, fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MsAuthService } from './ms-auth.service';
import { MatDialog } from '@angular/material';
import logger from '../utils/logger';
import { IPreLoginConfig } from '../models/preLogin.model';
import { LogoutConfirmComponent } from '../components/logout-confirm/logout-confirm.component';
import { IAuthResponse, ICommEvent } from '../models/comm-events.model';
import { HttpClient } from '@angular/common/http';

const storage = localStorage;
export interface IUserAuthProfile {
  id: string;
  name: string;
  email: string;
  userName: string;
  token: string;
}
interface IParsedToken {
  email?: string;
  encEmail?: string;
  name?: string;
  preferred_username?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginChangeNotifier$ = new BehaviorSubject<boolean>(false);
  constructor(
    private dialog: MatDialog,
    private keycloakSvc: KeycloakService,
    private msAuthSvc: MsAuthService,
    private http: HttpClient
  ) {
    this.setupGlobalAuthResponder();
  }

  // Getters
  get isLoggedIn$() {
    return this.loginChangeNotifier$.asObservable();
  }
  get isLoggedIn(): Promise<boolean> {
    return this.keycloakSvc.isLoggedIn();
  }
  get isAuthenticated(): boolean {
    return this.keycloakSvc.getKeycloakInstance().authenticated;
  }
  get token(): string {
    return this.keycloakSvc.getKeycloakInstance().token;
  }
  get sessionId() {
    return this.keycloakSvc.getKeycloakInstance().sessionId;
  }
  get userId(): string {
    const kc = this.keycloakSvc.getKeycloakInstance();
    if (!kc) {
      return;
    }
    return (kc.tokenParsed && kc.tokenParsed.sub) || (kc.idTokenParsed && kc.idTokenParsed.sub);
  }

  get userEmail(): string {
    const kc = this.keycloakSvc.getKeycloakInstance();

    const tokenParsed = kc.tokenParsed as IParsedToken;
    const idTokenParsed = kc.idTokenParsed as IParsedToken;
    return (
      (tokenParsed && tokenParsed.email) ||
      (idTokenParsed && idTokenParsed.email) ||
      (idTokenParsed && idTokenParsed.encEmail) ||
      (tokenParsed && tokenParsed.preferred_username) ||
      (idTokenParsed && idTokenParsed.preferred_username)
    );
  }
  get userName(): string {
    const kc = this.keycloakSvc.getKeycloakInstance();
    return (
      (kc.tokenParsed && (kc.tokenParsed as IParsedToken).name) ||
      (kc.idTokenParsed && (kc.idTokenParsed as IParsedToken).name)
    );
  }
  // isInfosysUser Should not be used
  get isInfosysUser(): boolean {
    logger.warn('Method_Depricated: isInfosysUser should not be used. Hardcoding used.');
    if (this.userEmail.endsWith('infosys.com')) {
      return true;
    }
    return false;
  }

  async initAuth(preLoginConfig: IPreLoginConfig): Promise<boolean> {
    if (preLoginConfig.microsoft) {
      this.msAuthSvc.init();
    }
    try {
      this.addKeycloakEventListener(preLoginConfig.keycloak.key);
      return await this.keycloakSvc.init({
        config: {
          url: preLoginConfig.keycloak.url,
          realm: preLoginConfig.keycloak.realm,
          clientId: preLoginConfig.keycloak.clientId
        },
        initOptions: {
          ...this.getSavedKeycloakConfig(preLoginConfig.keycloak.key),
          onLoad: 'check-sso',
          checkLoginIframe: true
        },
        enableBearerInterceptor: true,
        loadUserProfileAtStartUp: false,
        bearerExcludedUrls: [
          'publicApi/v3',
          'publicApi/v4',
          // 'clientApi/publicApi/v3',
          'assets',
          'public-assets',
          'https://infosystechnologies.sharepoint.com'
        ]
      });
    } catch (error) {
      return false;
    }
  }
  login(idpHint = 'E', redirectUrl = this.defaultRedirectUrl): Promise<void> {
    return this.keycloakSvc.login({
      idpHint,
      redirectUri: redirectUrl
    });
  }
  logout(redirectUrl = this.defaultRedirectUrl) {
    this.dialog
      .open<LogoutConfirmComponent, undefined, boolean>(LogoutConfirmComponent)
      .afterClosed()
      .subscribe(shouldLogout => shouldLogout && this.confirmedLogout(redirectUrl));
  }
  async loadUserProfile(forcedReload?: boolean): Promise<IUserAuthProfile> {
    try {
      const profile = await this.keycloakSvc.loadUserProfile(forcedReload);
      return {
        email: profile.email || this.userEmail,
        id: profile.id || this.userId,
        name: profile.firstName + ' ' + profile.lastName,
        token: this.token,
        userName: profile.username || this.userEmail
      };
    } catch (error) {
      return {
        email: this.userEmail,
        id: this.userId,
        name: this.userName,
        token: this.token,
        userName: this.userEmail
      };
    }
  }
  private async confirmedLogout(redirectUrl: string) {
    storage.clear();
    await this.http.get('/clientApi/reset').toPromise();
    this.keycloakSvc.logout(this.msAuthSvc.logoutUrl(this.userEmail, redirectUrl));
  }
  private addKeycloakEventListener(key) {
    this.keycloakSvc.keycloakEvents$.subscribe((event: KeycloakEvent) => {
      const type: KeycloakEventType = event.type;
      switch (type) {
        case KeycloakEventType.OnAuthError:
          this.loginChangeNotifier$.next(false);
          break;
        case KeycloakEventType.OnAuthLogout:
          this.loginChangeNotifier$.next(false);
          storage.clear();
          break;
        case KeycloakEventType.OnAuthRefreshError:
          break;
        case KeycloakEventType.OnAuthRefreshSuccess:
          break;
        case KeycloakEventType.OnAuthSuccess:
          break;
        case KeycloakEventType.OnReady:
          this.loginChangeNotifier$.next(event.args);
          if (event.args) {
            this.saveKeycloakConfig(key);
          }
          break;
        case KeycloakEventType.OnTokenExpired:
          this.keycloakSvc.updateToken(60);
          break;
      }
    });
  }
  private setupGlobalAuthResponder() {
    fromEvent<MessageEvent>(window, 'message')
      .pipe(
        filter(
          event =>
            event &&
            event.data &&
            event.data.type === 'AUTH_REQUEST' &&
            Boolean(event.source) &&
            typeof event.source.postMessage === 'function'
        )
      )
      .subscribe(async (event: MessageEvent) => {
        console.log('setupGlobalAuthResponder received event', event);
        const contentWindow = event.source as Window;
        const token = await this.keycloakSvc.getToken();
        const response: ICommEvent<IAuthResponse> = {
          app: 'WEB_PORTAL',
          type: 'AUTH_RESPONSE',
          state: 'NONE',
          plugin: 'NONE',
          data: {
            id: event.data && event.data.data && event.data.data.id,
            token
          }
        };
        contentWindow.postMessage(response, '*');
      });
  }

  // Helper methods
  private saveKeycloakConfig(key: string) {
    const kc = this.keycloakSvc.getKeycloakInstance();
    const keycloakInitOptions: KeycloakInitOptions = {
      idToken: kc.idToken,
      refreshToken: kc.refreshToken,
      timeSkew: kc.timeSkew,
      token: kc.token
    };
    storage.setItem(key, JSON.stringify(keycloakInitOptions));
  }
  private getSavedKeycloakConfig(key: string): KeycloakInitOptions {
    try {
      const lastSaved = storage.getItem(key);
      if (lastSaved) {
        const processed = JSON.parse(lastSaved);
        if ('token' in processed && 'refreshToken' in processed && 'idToken' in processed && 'timeSkew' in processed) {
          return processed;
        }
      }
    } catch (e) {}
    return {};
  }
  private get defaultRedirectUrl() {
    try {
      const baseUrl = document.baseURI;
      return baseUrl || location.origin;
    } catch (error) {
      return location.origin;
    }
  }
}
