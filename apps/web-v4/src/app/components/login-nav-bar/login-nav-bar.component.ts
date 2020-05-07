/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ConfigService } from '../../services/config.service';
import { ValuesService } from '../../services/values.service';
import { MobileAppsService } from '../../services/mobile-apps.service';

@Component({
  selector: 'app-login-nav-bar',
  templateUrl: './login-nav-bar.component.html',
  styleUrls: ['./login-nav-bar.component.scss']
})
export class LoginNavBarComponent implements OnInit {
  // showIconConfig = this.configSvc.instanceConfig.platform.showIconBackground;

  navConfig = {
    name: this.configSvc.instanceConfig.platform.appName,
    logo: this.configSvc.instanceConfig.platform.logo
  };

  loginConfig = {
    ...this.configSvc.instanceConfig.features.login.config
  };

  showBackground = this.configSvc.instanceConfig.platform.showIconBackground;

  constructor(
    private authSvc: AuthService,
    private configSvc: ConfigService,
    public mobileAppsSvc: MobileAppsService
  ) { }

  ngOnInit() { }

  login(idpHint = 'E') {
    this.authSvc.login(idpHint);
  }
}
