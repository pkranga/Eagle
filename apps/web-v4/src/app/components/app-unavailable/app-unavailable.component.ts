/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { EUserRoles } from '../../constants/enums.constant';

import { AccessControlService } from '../../services/access-control.service';
import { TncService } from '../../services/tnc.service';
import { MobileAppsService } from '../../services/mobile-apps.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'ws-app-unavailable',
  templateUrl: './app-unavailable.component.html',
  styleUrls: ['./app-unavailable.component.scss']
})
export class AppUnavailableComponent implements OnInit {
  redirectionIssue: {
    isIssue: boolean;
    issueType: 'mobile-app' | 'web';
  };
  userRoles: Set<string> = new Set();
  mobileLinks: {
    android: string;
    ios: string;
  };
  authoringToolLink: {
    home: string;
  };

  constructor(
    private accessSvc: AccessControlService,
    private tncSvc: TncService,
    private mobileAppsSvc: MobileAppsService,
    private authSvc: AuthService
  ) {}

  ngOnInit() {
    this.authSvc.isLoggedIn.then((authenticated: boolean) => {
      if (authenticated) {
        const subDomain = location.hostname || '';
        if (subDomain.indexOf('lex-staging') > -1 || subDomain.indexOf('lex-dev') > -1) {
          this.mobileLinks = {
            android: 'https://play.google.com/store/apps/details?id=com.infosysit.lex',
            ios: 'https://itunes.apple.com/us/app/infosys-lex/id1372091347?ls=1&mt=8'
          };
          this.authoringToolLink = {
            home: 'http://IP-ADDR:3006/'
          };
          this.fetchUserRoles();
        }
      }
    });
  }

  private fetchUserRoles() {
    this.accessSvc.getUserRoles().subscribe(
      userRoles => {
        this.userRoles = userRoles;
        this.redirectionCheck();
      },
      error => {}
    );
  }

  private redirectionCheck() {
    this.tncSvc.fetchMyTnc().then(data => {
      if (data.isAccepted) {
        if (this.mobileAppsSvc.isMobile && !this.userRoles.has(EUserRoles.PRIVILEGED)) {
          this.redirectionIssue = {
            isIssue: true,
            issueType: 'mobile-app'
          };
        } else if (!this.userRoles.has(EUserRoles.PRIVILEGED)) {
          this.redirectionIssue = {
            isIssue: true,
            issueType: 'web'
          };
        }
      }
    });
  }
}
