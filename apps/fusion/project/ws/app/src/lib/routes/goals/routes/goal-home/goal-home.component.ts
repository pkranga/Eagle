/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit } from '@angular/core'
import { ConfigurationsService, NsPage } from '@ws-widget/utils'
import { Router } from '@angular/router'
import { BtnGoalsService } from '@ws-widget/collection'

@Component({
  selector: 'ws-app-goal-home',
  templateUrl: './goal-home.component.html',
  styleUrls: ['./goal-home.component.scss'],
})
export class GoalHomeComponent implements OnInit {
  navBackground: Partial<NsPage.INavBackground>
  userName: string | undefined
  numNotifications = 0

  goalFor = 'me'

  constructor(
    private router: Router,
    private configSvc: ConfigurationsService,
    private goalsSvc: BtnGoalsService,
  ) {
    this.navBackground = this.configSvc.pageNavBar
    if (this.configSvc.userProfile) {
      this.userName = (this.configSvc.userProfile.userName || '').split(' ')[0]
    }
  }

  ngOnInit() {
    this.goalFor = this.router.url.includes('others') ? 'others' : 'me'
    this.goalsSvc.getActionRequiredGoals('isInIntranet').subscribe(actionRequired => {
      this.numNotifications = actionRequired.length
    })
  }

  goalToggle(tab: string) {
    if (tab === 'me') {
      this.router.navigate(['/app/goals/me/all'])
    } else if (tab === 'others') {
      this.router.navigate(['/app/goals/others'])
    }
  }
}
