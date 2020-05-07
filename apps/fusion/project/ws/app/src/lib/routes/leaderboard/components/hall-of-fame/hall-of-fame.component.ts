/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit } from '@angular/core'
import { IResolveResponse } from '@ws-widget/utils'
import { IHallOfFameItem, EDurationTypeRouteParam } from '../../models/leaderboard.model'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'ws-app-hall-of-fame',
  templateUrl: './hall-of-fame.component.html',
  styleUrls: ['./hall-of-fame.component.scss'],
})
export class HallOfFameComponent implements OnInit {
  hallOfFame!: IHallOfFameItem[]
  hallOfFameError!: string
  durationType!: EDurationTypeRouteParam

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      const hallOfFameResolve: IResolveResponse<IHallOfFameItem[]> = data.hallOfFameResolve

      if (hallOfFameResolve.data) {
        this.hallOfFame = hallOfFameResolve.data
      }

      if (hallOfFameResolve.error) {
        this.hallOfFameError = hallOfFameResolve.error
      }
    })
  }
}
