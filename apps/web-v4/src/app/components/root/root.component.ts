/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnDestroy, OnInit } from '@angular/core';
// Material import
import { MatDialog } from '@angular/material';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { debounceTime, map, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { ShortcutComponentComponent } from '../shortcut-component/shortcut-component.component';
import { Impression } from '../../constants/pageImpressions.constants';
import { ConfigService } from '../../services/config.service';
import { MiscService } from '../../services/misc.service';
import { RoutingService } from '../../services/routing.service';
import { TncService } from '../../services/tnc.service';
import { ValuesService } from '../../services/values.service';
import { UtilityService } from '../../services/utility.service';
import { TelemetryService } from '../../services/telemetry.service';

@Component({
  selector: 'ws-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss']
})
export class RootComponent implements OnInit, OnDestroy {
  themeClass$ = this.valueSvc.theme$;
  fontClass$ = this.valueSvc.font$;
  routerChangeInProgress = false;
  isAuthenticated = false;
  isAcceptedTnc = false;
  isShortCutModalOpen = false;
  currentUrl: string;
  private navOnBottomSubscription: Subscription;
  navPosition: 'top' | 'bottom' | 'login' | 'none' = 'top';

  canShowNavbar$ = this.miscSvc.navBarDisplay$;
  constructor(
    private router: Router,
    private authSvc: AuthService,
    private valueSvc: ValuesService,
    private telemetrySvc: TelemetryService,
    private routingSvc: RoutingService,
    private tncSvc: TncService,
    private miscSvc: MiscService,
    private configSvc: ConfigService,
    private utilSvc: UtilityService,
    public dialog: MatDialog // public service to open shortcut modal
  ) {}

  ngOnInit() {
    this.assignUserInstanceTheme();
    this.navOnBottomSubscription = this.valueSvc.isXSmall$
      .pipe(
        switchMap(onBottom => {
          return this.authSvc.isLoggedIn$.pipe(
            take(1),
            map(isAuth => ({ isAuth, onBottom }))
          );
        }),
        switchMap(({ isAuth, onBottom }) => {
          return this.miscSvc.navBarDisplay$.pipe(map(canShowNavBar => ({ isAuth, onBottom, canShowNavBar })));
        }),
        debounceTime(500)
      )
      .subscribe(({ isAuth, onBottom, canShowNavBar }) => {
        if (isAuth) {
          this.isAuthenticated = true;
          if (!canShowNavBar) {
            this.navPosition = 'none';
          } else if (onBottom) {
            this.navPosition = 'bottom';
          } else {
            this.navPosition = 'top';
          }
        } else {
          this.isAuthenticated = false;
          this.navPosition = 'login';
        }
        this.isAcceptedTnc = this.tncSvc.userHasAcceptedTnc;
      });

    this.authSvc.isLoggedIn$.subscribe(isAuth => {
      if (isAuth) {
        this.telemetrySvc.startTelemetryEvent('app', 'view');
      }
    });

    this.router.events.subscribe(event => {
      this.isAcceptedTnc = this.tncSvc.userHasAcceptedTnc;
      this.authSvc.isLoggedIn.then((authenticated: boolean) => {
        if (authenticated && event instanceof NavigationEnd) {
          const pageParams = this.getPageParam(event.url);
          if (pageParams) {
            pageParams.pageUrl = window.location.href;
            this.telemetrySvc.impressionTelemetryEvent(pageParams);
          }
        }
      });

      if (event instanceof NavigationStart) {
        if (event.url === this.routingSvc.previousRouteUrls[this.routingSvc.previousRouteUrls.length - 1]) {
          this.routingSvc.previousRouteUrls.pop();
        } else {
          if (
            !this.routingSvc.previousRouteUrls[this.routingSvc.previousRouteUrls.length - 1] ||
            (this.routingSvc.previousRouteUrls[this.routingSvc.previousRouteUrls.length - 1] &&
              this.routingSvc.previousRouteUrls[this.routingSvc.previousRouteUrls.length - 1] !== this.router.url)
          ) {
            this.routingSvc.previousRouteUrls.push(this.router.url);
          }
        }
        this.routerChangeInProgress = true;
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.routerChangeInProgress = false;
        this.currentUrl = event.url;
      }
    });
  }

  ngOnDestroy() {
    if (this.navOnBottomSubscription) {
      this.navOnBottomSubscription.unsubscribe();
    }
  }

  // function to set theme for specific users of siemens
  assignUserInstanceTheme() {
    if (this.configSvc.instanceConfig.features.siemens.enabled) {
      const userEmail = this.authSvc.userEmail;
      // const userEmail = 'user3@demo.com';
      this.utilSvc.getDataFromUrl('/assets/hardcodings/home-redirection.json').subscribe(userData => {
        if (userData[userEmail]) {
          this.valueSvc.setPageTheme(userData[userEmail].appTheme);
        } else {
          this.valueSvc.setPageTheme('teal-theme');
        }
      });
    }
  }

  // function to open the shortcut modal
  openShortcutDialog(): void {
    if (this.isShortCutModalOpen) {
      return;
    } else {
      this.isShortCutModalOpen = true;
    }
    const dialogRef = this.dialog.open(ShortcutComponentComponent, {
      width: 'auto'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.isShortCutModalOpen = false;
    });
  }

  confirmLogout() {
    this.authSvc.logout();
  }

  private getPageParam(url: string) {
    const idx = url.indexOf('?');
    const urlArr = url.substring(1, idx === -1 ? url.length : idx).split('/');
    let id: string;
    if (/viewer/.test(urlArr[0])) {
      id = urlArr.pop();
    }
    const key = urlArr.join('-');
    const appName = this.configSvc.instanceConfig.platform.appName;
    document.title = appName[0].toUpperCase() + appName.substr(1);
    const imp: Impression = new Impression(key);
    if (id) {
      imp.contentId = id;
    }
    return imp;
  }
}
