/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit } from '@angular/core'
import { ConfigurationsService } from '@ws-widget/utils'
import { BtnGoalsService, NsGoal } from '@ws-widget/collection'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'ws-app-goal-track',
  templateUrl: './goal-track.component.html',
  styleUrls: ['./goal-track.component.scss'],
})
export class GoalTrackComponent implements OnInit {
  goal: NsGoal.IGoal | undefined = undefined

  constructor(
    private route: ActivatedRoute,
    private goalsSvc: BtnGoalsService,
    public configSvc: ConfigurationsService,
  ) {}

  ngOnInit() {
    const goalId = this.route.snapshot.params.goalId
    this.goal = this.goalsSvc.goalsHash[goalId]
    if (!this.goal) {
      this.goalsSvc.getOthersGoals('isInIntranet').subscribe(goals => {
        this.goal = goals.find(goal => goal.id === goalId)
      })
    }
  }
}
