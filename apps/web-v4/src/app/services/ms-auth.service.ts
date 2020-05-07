/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import logger from '../utils/logger';
import { MSToken } from '../models/msToken.model';
import { ConfigService } from './config.service';

const apiEndpoints = {
  sharepointToken: '/clientApi/v2/user/token'
};
const msTokenExpiryDuration = 600;
@Injectable({
  providedIn: 'root'
})
export class MsAuthService {
  private code: string = null;
  private msTokenObject: MSToken = null;
  private validExtensionsForOfficeLogin: string[] = [];
  constructor(private http: HttpClient, private configSvc: ConfigService) {}

  async init() {
    const queryParamsObj = this.currentQueryParams();
    this.validExtensionsForOfficeLogin = this.configSvc.preLoginConfig.validEmailExtensionsForOfficeLogin;
    if (this.validExtensionsForOfficeLogin && 'code' in queryParamsObj && 'session_state' in queryParamsObj) {
      this.code = queryParamsObj.code;
      let url = location.origin + location.pathname;
      await this.exchangeTokenForCode(queryParamsObj.code, url);
      if (location.hash) {
        url += '?' + location.hash.substring(1);
      }
      history.replaceState(null, 'Wingspan', url);
    }
  }

  async login(email: string) {
    if (!this.isValidOfficeEmail(email)) {
      logger.warn(`Microsoft login is not allowed for your email id (${email})`);
      return;
    }
    location.assign(this.getMsLoginUrl(this.configSvc.preLoginConfig.microsoft.clientId));
  }

  logoutUrl(email: string, redirectUrl: string) {
    if (this.isValidOfficeEmail(email)) {
      return `https://login.microsoftonline.com/common/oauth2/logout?post_logout_redirect_uri=${redirectUrl}`;
    }
    return redirectUrl;
  }

  async getToken(email: string): Promise<string> {
    if (this.msTokenObject && this.isTokenValid()) {
      return Promise.resolve(this.msTokenObject.accessToken);
    }
    if (this.isValidOfficeEmail(email)) {
      try {
        this.msTokenObject = await this.http.get<MSToken>(`${apiEndpoints.sharepointToken}?email=${email}`).toPromise();
        return this.msTokenObject.accessToken;
      } catch (error) {
        if (!this.code) {
          this.login(email);
        }
      }
    }

    try {
      this.msTokenObject = await this.http
        .get<MSToken>(`${apiEndpoints.sharepointToken}?email=${this.configSvc.preLoginConfig.microsoft.defaultEmailId}`)
        .toPromise();
      return this.msTokenObject.accessToken;
    } catch (error) {}
    return Promise.reject('UNABLE_TO_FETCH_MS_AUTH');
  }

  loginForSSOEnabledEmbeds(email: string) {
    if (this.isValidOfficeEmail(email)) {
      const currentTimestamp = Date.now();
      let msLoginTimestampLS: number;
      try {
        msLoginTimestampLS = parseInt(localStorage.getItem('msLoginTimestamp'), 10);
      } catch (e) {}
      if (
        !msLoginTimestampLS ||
        (msLoginTimestampLS && (currentTimestamp - msLoginTimestampLS) / 1000 > msTokenExpiryDuration)
      ) {
        console.log(`LOGIN INTERVAL ${msTokenExpiryDuration}. REDIRECTING TO O365 LOGIN`);
        localStorage.setItem('msLoginTimestamp', currentTimestamp.toString());
        this.login(email);
      }
    }
  }

  // Helper methods
  private async exchangeTokenForCode(code: string, redirectUrl: string) {
    this.msTokenObject = await this.http
      .get<MSToken>(`${apiEndpoints.sharepointToken}?code=${code}&redirecturi=${redirectUrl}`)
      .toPromise();
    return this.msTokenObject.accessToken;
  }

  private isTokenValid(): boolean {
    if (this.msTokenObject) {
      logger.warn('TOKEN EXPIRY NEEDS TO BE VALIDATED');
      // TODO: Check the expiry of token
      return true;
    }
    return false;
  }
  private isValidOfficeEmail(email: string) {
    return (
      this.validExtensionsForOfficeLogin.length && this.validExtensionsForOfficeLogin.some(ext => email.endsWith(ext))
    );
  }
  private getMsLoginUrl(clientId: string): string {
    const urlBase = 'https://login.windows.net/common/oauth2/authorize';
    const params = {
      response_type: 'code',
      client_id: clientId,
      redirect_uri: window.location.href
    };
    const queryParams = Object.entries(params)
      .map(([key, value]) => {
        return key + '=' + value;
      })
      .join('&');
    return `${urlBase}?${queryParams}` + (location.search ? `#${location.search.substring(1)}` : '');
  }
  private currentQueryParams(): {
    code?: string;
    session_state?: string;
  } {
    const str = location.search;
    if (str.length <= 1) {
      return {};
    }
    try {
      return str
        .slice(1)
        .split('&')
        .map(u => u.split('='))
        .reduce((agg, [k, v]) => {
          agg[k] = v;
          return agg;
        }, {});
    } catch (e) {
      return {};
    }
  }
}
