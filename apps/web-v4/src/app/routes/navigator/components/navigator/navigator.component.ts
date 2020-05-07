/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { RoutingService } from '../../../../services/routing.service';
import { NavigatorService } from '../../../../services/navigator.service';
import { ConfigService } from '../../../../services/config.service';

@Component({
  selector: 'app-navigator',
  templateUrl: './navigator.component.html',
  styleUrls: ['./navigator.component.scss']
})
export class NavigatorComponent implements OnInit {
  banners = this.configSvc.instanceConfig.features.navigator.config.techNavigatorBanner.bannersList;
  features = this.configSvc.instanceConfig.features.navigator.subFeatures;
  constructor(
    public routingSvc: RoutingService,
    public navigatorSvc: NavigatorService,
    private configSvc: ConfigService
  ) {}

  ngOnInit() {}
}
