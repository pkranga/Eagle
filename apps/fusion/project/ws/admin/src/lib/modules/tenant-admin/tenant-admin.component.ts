/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, OnDestroy } from '@angular/core'
import { Subscription } from 'rxjs'
import { ValueService, ConfigurationsService, NsPage } from '@ws-widget/utils'

@Component({
  selector: 'ws-admin-tenant-admin',
  templateUrl: './tenant-admin.component.html',
  styleUrls: ['./tenant-admin.component.scss'],
})
export class TenantAdminComponent implements OnInit, OnDestroy {
  tabName = 'User Registration'
  sideNavSubscription: Subscription | null = null
  isLtMedium = false
  sideNavBarOpened = !this.isLtMedium
  showText = true
  pageNavbar: Partial<NsPage.INavBackground> = this.configSvc.pageNavBar

  constructor(
    private valueSvc: ValueService,
    private configSvc: ConfigurationsService,
  ) { }

  ngOnInit() {
    this.sideNavSubscription = this.valueSvc.isLtMedium$.subscribe(isLtMedium => {
      this.isLtMedium = isLtMedium
      this.sideNavBarOpened = !this.isLtMedium
    })
  }

  ngOnDestroy() {
    if (this.sideNavSubscription) {
      this.sideNavSubscription.unsubscribe()
    }
  }
}
