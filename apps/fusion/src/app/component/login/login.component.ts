/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, OnDestroy } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Subscription } from 'rxjs'
import { AuthKeycloakService, ConfigurationsService } from '@ws-widget/utils'
import { IWSPublicLoginConfig, ILoginDescriptiveFooterConfig } from './login.model'
import { SafeUrl, DomSanitizer } from '@angular/platform-browser'

@Component({
  selector: 'ws-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  productLogo = ''
  contactUs = false
  productLogoWidth: string | undefined = ''
  showIconBackground = false
  developedBy = ''
  appIcon: SafeUrl | null = null
  // todo what to do for client login
  isClientLogin = false
  loginConfig: IWSPublicLoginConfig | null = null
  welcomeFooter: ILoginDescriptiveFooterConfig | null = null
  title = ''
  subTitle = ''
  private redirectUrl = ''
  private subscriptionLogin: Subscription | null = null

  constructor(
    private activateRoute: ActivatedRoute,
    private authSvc: AuthKeycloakService,
    private configSvc: ConfigurationsService,
    private domSanitizer: DomSanitizer,
  ) {
    const instanceConfig = this.configSvc.instanceConfig
    if (instanceConfig) {
      this.appIcon = this.domSanitizer.bypassSecurityTrustResourceUrl(
        instanceConfig.logos.appTransparent,
      )
      this.productLogo = instanceConfig.logos.company
      this.developedBy = instanceConfig.logos.developedBy
    }
  }

  ngOnInit() {
    this.subscriptionLogin = this.activateRoute.data.subscribe(data => {
      // todo
      this.loginConfig = data.pageData.data
      this.isClientLogin = data.pageData.data.isClient
      this.welcomeFooter = data.pageData.data.footer.descriptiveFooter
      this.title = data.pageData.data.topbar.title
      this.subTitle = data.pageData.data.topbar.subTitle
      this.contactUs = data.pageData.data.footer.contactUs
    })

    const paramsMap = this.activateRoute.snapshot.queryParamMap
    if (paramsMap.has('ref')) {
      this.redirectUrl = document.baseURI + paramsMap.get('ref')
    } else {
      this.redirectUrl = document.baseURI
    }
  }

  ngOnDestroy() {
    if (this.subscriptionLogin) {
      this.subscriptionLogin.unsubscribe()
    }
  }

path
    this.authSvc.login(key, this.redirectUrl)
  }
}
