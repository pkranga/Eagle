/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../../../services/config.service';

@Component({
  selector: 'app-hubs',
  templateUrl: './hubs.component.html',
  styleUrls: ['./hubs.component.scss']
})
export class HubsComponent implements OnInit {
  hubsSearchRequests = this.configSvc.instanceConfig.features.marketing.config.hubs;
  doneCount = 0;
  totalEventCount = 0;
  constructor(private configSvc: ConfigService) {}

  ngOnInit() {}

  handleNoContent(event, type) {
    if (event === 'done') {
      this.doneCount += 1;
    }
    this.totalEventCount += 1;
  }
}
