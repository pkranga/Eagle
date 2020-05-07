/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { RoutingService } from 'src/app/services/routing.service';
import { ConfigService } from 'src/app/services/config.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'ws-channels-home',
  templateUrl: './channels-home.component.html',
  styleUrls: ['./channels-home.component.scss']
})
export class ChannelsHomeComponent implements OnInit {
  isContentTabAvailable = this.configSvc.instanceConfig.features.channels.subFeatures.contentTab;
  isLeadershipTabAvailable = this.configSvc.instanceConfig.features.channels.subFeatures.leadershipTab;
  currentTab = 'leadership';

  constructor(public routingSvc: RoutingService, private configSvc: ConfigService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const tab = params.get('tab');
      if (['corporate', 'leadership'].includes(tab)) {
        this.currentTab = tab;
      }
    });
  }
}
