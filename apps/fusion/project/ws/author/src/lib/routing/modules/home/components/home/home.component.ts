/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, OnDestroy } from '@angular/core'
import { map } from 'rxjs/operators'
import { ValueService } from '@ws-widget/utils/src/public-api'
import { AccessControlService } from '@ws/author/src/lib/modules/shared/services/access-control.service'
import { REVIEW_ROLE, PUBLISH_ROLE, CREATE_ROLE } from '@ws/author/src/lib/constants/content-role'

@Component({
  selector: 'ws-auth-root-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class AuthHomeComponent implements OnInit, OnDestroy {

  sideNavBarOpened = true
  panelOpenState = false
  isLtMedium$ = this.valueSvc.isLtMedium$
  private defaultSideNavBarOpenedSubscription: any
  mode$ = this.isLtMedium$.pipe(map(isMedium => (isMedium ? 'over' : 'side')))
  public screenSizeIsLtMedium = false
  constructor(
    private valueSvc: ValueService,
    private accessService: AccessControlService,
  ) { }

  ngOnInit() {
    this.defaultSideNavBarOpenedSubscription = this.isLtMedium$.subscribe(
      isLtMedium => {
        this.sideNavBarOpened = !isLtMedium
        this.screenSizeIsLtMedium = isLtMedium
      },
    )
  }
  ngOnDestroy() {
    if (this.defaultSideNavBarOpenedSubscription) {
      this.defaultSideNavBarOpenedSubscription.unsubscribe()
    }
  }

  canShow(role: string): boolean {
    switch (role) {
      case 'review':
        return this.accessService.hasRole(REVIEW_ROLE)
      case 'publish':
        return this.accessService.hasRole(PUBLISH_ROLE)
      case 'author':
        return this.accessService.hasRole(CREATE_ROLE)
      default:
        return false
    }
  }

}
