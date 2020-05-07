/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { SalesOnboardingFeatured } from '../../constants/featured';
import { NSNavigator } from '../../contracts/Navigator';
import { RoutingService } from '../../../../services/routing.service';
import { ConfigService } from '../../../../services/config.service';

@Component({
  selector: 'app-sales-onboarding',
  templateUrl: './sales-onboarding.component.html',
  styleUrls: ['./sales-onboarding.component.scss']
})
export class SalesOnboardingComponent implements OnInit {
  banners = this.configSvc.instanceConfig.features.navigator.config.salesOnboardingBanner;

  constructor(public routingSvc: RoutingService, private configSvc: ConfigService) {}

  ngOnInit() {}
}
