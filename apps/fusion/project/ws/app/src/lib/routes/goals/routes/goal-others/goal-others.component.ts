/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component } from '@angular/core'
import { NsGoal, BtnGoalsService } from '@ws-widget/collection'
import { ActivatedRoute } from '@angular/router'
import { TFetchStatus } from '@ws-widget/utils'

@Component({
  selector: 'ws-app-goal-others',
  templateUrl: './goal-others.component.html',
  styleUrls: ['./goal-others.component.scss'],
})
export class GoalOthersComponent {
  fetchGoalsStatus: TFetchStatus = 'none'
  othersGoals: NsGoal.IGoal[] = this.route.snapshot.data.othersGoals.data
  error = this.route.snapshot.data.othersGoals.error

  constructor(private route: ActivatedRoute, private goalsSvc: BtnGoalsService) {}

  updateGoals() {
    this.fetchGoalsStatus = 'fetching'
    this.othersGoals = []
    this.goalsSvc.getOthersGoals('isInIntranet').subscribe(response => {
      this.fetchGoalsStatus = 'done'
      this.othersGoals = response
    })
  }
}
