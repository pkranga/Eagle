/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, Input } from '@angular/core'

@Component({
  selector: 'ws-app-goal-accept-card',
  templateUrl: './goal-accept-card.component.html',
  styleUrls: ['./goal-accept-card.component.scss'],
})
export class GoalAcceptCardComponent implements OnInit {
  @Input() accept: any

  isExpanded = false
  goalProgressBarStyle: { left: string } = { left: '0%' }
  constructor() {}

  ngOnInit() {
    if (this.accept) {
      const progress = Math.min(
        Math.round((this.accept.progress || 0) * 100),
        89,
      )
      this.goalProgressBarStyle = {
        left: `${progress}%`,
      }
    }
  }
}
