/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { ILeaderboard, ILeaderboardPrevNext } from '../../models/leaderboard.model'

@Component({
  selector: 'ws-app-leaderboard-controls',
  templateUrl: './leaderboard-controls.component.html',
  styleUrls: ['./leaderboard-controls.component.scss'],
})
export class LeaderboardControlsComponent implements OnInit {
  @Input() leaderboard!: ILeaderboard
  @Input() disabledPrev!: boolean
  @Input() disabledNext!: boolean
  @Output() fetchLeaderboard: EventEmitter<ILeaderboardPrevNext>

  constructor() {
    this.fetchLeaderboard = new EventEmitter()
  }

  ngOnInit() {}

  onClickBtnPrevNext(prevNext?: ILeaderboardPrevNext) {
    if (!prevNext) {
      return
    }

    this.fetchLeaderboard.emit(prevNext)
  }
}
