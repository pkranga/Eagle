/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { RoutingService } from '../../../../services/routing.service';
import { MobileAppsService } from '../../../../services/mobile-apps.service';
import { ConfigService } from '../../../../services/config.service';

@Component({
  selector: 'app-release-notes',
  templateUrl: './release-notes.component.html',
  styleUrls: ['./release-notes.component.scss']
})
export class ReleaseNotesComponent implements OnInit {
  platform = this.configSvc.instanceConfig.platform.platform;
  constructor(
    public routingSvc: RoutingService,
    public mobileAppsSvc: MobileAppsService,
    private configSvc: ConfigService
  ) {}

  ngOnInit() {}
}
