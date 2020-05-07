/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'ws-app-goal-track-accept',
  templateUrl: './goal-track-accept.component.html',
  styleUrls: ['./goal-track-accept.component.scss'],
})
export class GoalTrackAcceptComponent implements OnInit {

  trackGoal: any
  error: any
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    if (this.route.parent && this.route.parent.snapshot) {
      this.trackGoal = this.route.parent.snapshot.data.trackGoal.data
      this.error = this.route.parent.snapshot.data.trackGoal.error
    }
  }
}
