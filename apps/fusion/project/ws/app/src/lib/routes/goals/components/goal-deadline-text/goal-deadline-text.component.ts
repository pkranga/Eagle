/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, Input } from '@angular/core'

@Component({
  selector: 'ws-app-goal-deadline-text',
  templateUrl: './goal-deadline-text.component.html',
  styleUrls: ['./goal-deadline-text.component.scss'],
})
export class GoalDeadlineTextComponent implements OnInit {

  @Input() endDate = 0
  deadlinePassed = false
  constructor() {
  }

  ngOnInit() {
    const now = new Date()
    const currentTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).getTime()
    this.deadlinePassed = this.endDate < currentTime
  }

}
