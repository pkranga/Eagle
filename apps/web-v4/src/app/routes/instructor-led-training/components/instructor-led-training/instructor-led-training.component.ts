/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RoutingService } from '../../../../services/routing.service';

@Component({
  selector: 'app-instructor-led-training',
  templateUrl: './instructor-led-training.component.html',
  styleUrls: ['./instructor-led-training.component.scss']
})
export class InstructorLedTrainingComponent implements OnInit {
  isUserJL6OrAbove: boolean;
  selectedTabIndex = 0;
  initialTab: string;
  tabs = ['schedule', 'feedback', 'manager', 'jit'];

  constructor(public routingSvc: RoutingService, private route: ActivatedRoute, private router: Router) {
    const navigationState = this.router.getCurrentNavigation().extras.state;
    this.initialTab = navigationState ? navigationState.tab : 'schedule';
  }

  ngOnInit() {
    this.initTabs();
  }

  initTabs() {
    this.route.data.subscribe(routeData => {
      this.isUserJL6OrAbove = routeData[0];
      if (!this.isUserJL6OrAbove) {
        this.tabs = this.tabs.filter(tab => tab !== 'jit');
      }

      if (this.initialTab) {
        this.selectedTabIndex = this.tabs.indexOf(this.initialTab) || 0;
      }
    });
  }
}
