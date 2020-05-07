/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ConfigService } from '../services/config.service';
import { TncService } from '../services/tnc.service';
import { UserService } from '../services/user.service';
import logger from '../utils/logger';

interface IGuardConfig {
  login: boolean; // Check if login is Required
  tnc: boolean; // Check if tncAcceptance is required
  roles: string[]; // List of user roles required to get the access
  featureKeys: string[]; // List of enabled_feature_key in instance configuration
}

const defaultRequiredConfig: IGuardConfig = {
  login: true,
  tnc: true,
  roles: [],
  featureKeys: []
};

@Injectable({
  providedIn: 'root'
})
export class GeneralGuard implements CanActivate, CanActivateChild {
  constructor(
    private authSvc: AuthService,
    private configSvc: ConfigService,
    private tncSvc: TncService,
    private userSvc: UserService,
    private router: Router
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const routeData = (next.data && next.data.routeConfig) || {};
    return this.shouldAllow(
      {
        ...defaultRequiredConfig,
        ...routeData
      },
      state
    );
  }
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const routeData = (next.data && next.data.routeConfig) || {};
    return this.shouldAllow({ ...defaultRequiredConfig, ...routeData }, state);
  }

  private shouldAllow<T>(
    configuration: IGuardConfig,
    state: RouterStateSnapshot,
    onlyBoolean = false
  ): Observable<T> | Promise<T> | boolean | UrlTree {
    if (configuration.login && !this.authSvc.isAuthenticated) {
      let refAppend = '';
      if (state.url) {
        refAppend = `?ref=${state.url}`;
      }
      return this.router.parseUrl(`/login${refAppend}`);
    }
    if (configuration.tnc && !this.tncSvc.hasAcceptedTnC) {
      logger.warn('Guard: tnc not accepted');
      return this.router.parseUrl('/tnc');
    }
    const featuresConfig = this.configSvc.instanceConfig.features;
    if (
      Array.isArray(configuration.featureKeys) &&
      !configuration.featureKeys.every(key => featuresConfig[key] && featuresConfig[key].enabled)
    ) {
      return this.router.parseUrl('/error/feature-disabled');
    }
    if (
      Array.isArray(configuration.featureKeys) &&
      !configuration.featureKeys.every(key => featuresConfig[key] && featuresConfig[key].available)
    ) {
      return this.router.parseUrl('/error/feature-unavailable');
    }
    if (Array.isArray(configuration.roles) && !configuration.roles.every(role => this.userSvc.userRoles.has(role))) {
      return this.router.parseUrl('/error/noAccess');
    }
    return true;
  }
}
