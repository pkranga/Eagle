/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit } from '@angular/core'
import { NsPage, ConfigurationsService, EInstance } from '@ws-widget/utils'
import { SafeUrl, DomSanitizer } from '@angular/platform-browser'

@Component({
  selector: 'ws-app-public-nav-bar',
  templateUrl: './app-public-nav-bar.component.html',
  styleUrls: ['./app-public-nav-bar.component.scss'],
})
export class AppPublicNavBarComponent implements OnInit {
  appIcon: SafeUrl | null = null
  logo = ''
  navBar: Partial<NsPage.INavBackground> | null = null
  constructor(private domSanitizer: DomSanitizer, private configSvc: ConfigurationsService) { }

  public get showPublicNavbar(): boolean {
    switch (this.configSvc.rootOrg) {
path
        return false
      default:
        return true
    }
  }

  ngOnInit() {
    if (this.configSvc.instanceConfig) {
      this.appIcon = this.domSanitizer.bypassSecurityTrustResourceUrl(
        this.configSvc.instanceConfig.logos.appTransparent,
      )
      this.logo = this.configSvc.instanceConfig.logos.company
      this.navBar = this.configSvc.primaryNavBar
    }
  }
}
