/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { EUserRoles } from '../../constants/enums.constant';
import { AccessControlService } from '../../services/access-control.service';
import { AuthService } from '../../services/auth.service';
import { ConfigService } from '../../services/config.service';
import { MobileAppsService } from '../../services/mobile-apps.service';
import { UserService } from '../../services/user.service';
import { UtilityService } from '../../services/utility.service';

const HIDE_ON_ROUTES = ['viewer', 'player', 'events'];

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent implements OnInit, OnChanges {
  @Input() currentUrl: string;
  chatbotOpened = false;
  chatbotUrl: SafeResourceUrl;
  isAccessible = false;
  isFirstTimeLoaded = false;
  hideOnInvalidRoute = false;
  constructor(
    private authSvc: AuthService,
    private accessControlSvc: AccessControlService,
    private mobileAppsSvc: MobileAppsService,
    private sanitizer: DomSanitizer,
    private utilSvc: UtilityService,
    private configSvc: ConfigService,
    private userSvc: UserService
  ) {}

  ngOnInit() {
    this.chatbotUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.configSvc.instanceConfig.externalLinks.chatbot
    );
    this.authSvc.isLoggedIn$.subscribe(isAuth => {
      if (isAuth) {
        this.checkIfVisible();
      } else {
        this.setAppVisibility(false);
      }
    });
  }

  ngOnChanges() {
    if (this.currentUrl) {
      this.checkIfVisible();
    }
  }

  private checkIfVisible() {
    if (
      this.currentUrl &&
      this.currentUrl.length &&
      HIDE_ON_ROUTES.some(route => this.currentUrl.substring(1).startsWith(route))
    ) {
      this.hideOnInvalidRoute = true;
      this.setAppVisibility(false);
      return;
    }
    this.hideOnInvalidRoute = false;
    if (this.userSvc.userRoles.has(EUserRoles.CHATBOT) && !this.mobileAppsSvc.isMobile) {
      this.isAccessible = true;
    } else if (
      this.userSvc.userRoles.has(EUserRoles.CHATBOT) &&
      this.configSvc.instanceConfig.features.chatbot.available
    ) {
      this.setAppVisibility(true);
    } else {
      this.setAppVisibility(false);
    }
  }
  private setAppVisibility(isVisible: boolean) {
    if (this.mobileAppsSvc.isMobile) {
      this.mobileAppsSvc.appChatbotVisibility(isVisible ? 'yes' : 'no');
    }
  }

  openChatbot() {
    if (!this.configSvc.instanceConfig.features.chatbot.enabled) {
      return;
    }
    if (!this.configSvc.instanceConfig.features.chatbot.available) {
      this.utilSvc.featureUnavailable();
      return;
    }
    if (!this.isFirstTimeLoaded) {
      this.isFirstTimeLoaded = true;
    }
    this.chatbotOpened = true;
  }
}
