/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  welcomeFooter = this.configSvc.instanceConfig.features.login.config.footer.descriptiveFooter;
  productLogo: string = this.configSvc.instanceConfig.platform.productLogo;
  productLogoWidth = this.configSvc.instanceConfig.platform.productLogoWidth;
  companyLogo: string = this.configSvc.instanceConfig.platform.companyLogo;
  loginConfig = this.configSvc.instanceConfig.features.login.config;
  showIconConfig = this.configSvc.instanceConfig.platform.showIconBackground;
  isClientLogin = this.configSvc.instanceConfig.features.clientLogin.available;
  isPathfindersLogin = this.configSvc.instanceConfig.features.pathfinders;
  private redirectUrl: string;
  constructor(private activateRoute: ActivatedRoute, private authSvc: AuthService, private configSvc: ConfigService) { }

  ngOnInit() {
    const paramsMap = this.activateRoute.snapshot.queryParamMap;
    if (paramsMap.has('ref')) {
      this.redirectUrl = document.baseURI + paramsMap.get('ref');
    } else {
      this.redirectUrl = document.baseURI;
    }
  }

  login(idpHint: string) {
    this.authSvc.login(idpHint, this.redirectUrl);
  }
}
