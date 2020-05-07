/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnDestroy, OnInit } from '@angular/core'
import { DomSanitizer, SafeUrl } from '@angular/platform-browser'
import { ActivatedRoute } from '@angular/router'
import { AuthKeycloakService, ConfigurationsService } from '@ws-widget/utils'
import { Subscription } from 'rxjs'
import { IWSPublicLoginConfig } from './login.model'

@Component({
path
path
path
})
export class PathfindersLoginComponent implements OnInit, OnDestroy {
  appIcon: SafeUrl | null = null
  logo = ''
  isClientLogin = false
  loginConfig: IWSPublicLoginConfig | null = null
  private redirectUrl = ''
  private subscriptionLogin: Subscription | null = null

  constructor(private activateRoute: ActivatedRoute,
              private authSvc: AuthKeycloakService,
              private configSvc: ConfigurationsService,
              private domSanitizer: DomSanitizer) {
    if (this.configSvc.instanceConfig) {
      this.appIcon = this.domSanitizer.bypassSecurityTrustResourceUrl(
        this.configSvc.instanceConfig.logos.landingLogo,
      )
      this.logo = this.configSvc.instanceConfig.logos.company

    }
  }

  ngOnInit() {
    this.subscriptionLogin = this.activateRoute.data.subscribe(data => {
      // todo
      this.loginConfig = data.pageData.data
      this.isClientLogin = data.pageData.data.isClient

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
