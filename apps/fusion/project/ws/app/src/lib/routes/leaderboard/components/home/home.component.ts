/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { EDurationTypeRouteParam } from '../../models/leaderboard.model'

@Component({
  selector: 'ws-app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  tabs: EDurationTypeRouteParam[]
  activeTab: EDurationTypeRouteParam

  constructor(private router: Router, private route: ActivatedRoute) {
    this.tabs = [
      EDurationTypeRouteParam.Weekly,
      EDurationTypeRouteParam.Monthly,
      EDurationTypeRouteParam.HallOfFame,
    ]
    this.activeTab = EDurationTypeRouteParam.Weekly
  }

  ngOnInit() {
    this.route.children[0].url.subscribe(url => {
      this.activeTab =
        (url[url.length - 1].path as EDurationTypeRouteParam) || EDurationTypeRouteParam.Weekly
    })
  }

  routeToTab(tab: string) {
    this.activeTab = tab as EDurationTypeRouteParam
    this.router.navigate([`${tab}`], {
      relativeTo: this.route,
    })
  }
}
