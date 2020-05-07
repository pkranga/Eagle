/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { RoutingService } from '../../../../services/routing.service';
import { NavigatorService } from '../../../../services/navigator.service';
import { FetchStatus } from '../../../../models/status.model';

@Component({
  selector: 'ws-candidate-development-plan',
  templateUrl: './candidate-development-plan.component.html',
  styleUrls: ['./candidate-development-plan.component.scss']
})
export class CandidateDevelopmentPlanComponent implements OnInit {

  cdpData: any;
  cdpFetchStatus: FetchStatus;

  selectedStream: any;
  selectedRole: any;
  selectedSkill: any;

  constructor(
    public routingSvc: RoutingService,
    private navigatorSvc: NavigatorService
  ) { }

  ngOnInit() {
    this.cdpFetchStatus = 'fetching';
    this.navigatorSvc.cdp.subscribe(data => {
      this.cdpFetchStatus = 'done';
      this.cdpData = data;
    }, err => {
      this.cdpFetchStatus = 'error';
    });
  }

}
