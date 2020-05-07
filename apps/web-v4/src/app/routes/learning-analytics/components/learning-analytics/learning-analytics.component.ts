/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { RoutingService } from '../../../../services/routing.service';
import { ConfigService } from '../../../../services/config.service';

@Component({
  selector: 'app-learning-analytics',
  templateUrl: './learning-analytics.component.html',
  styleUrls: ['./learning-analytics.component.scss']
})
export class LearningAnalyticsComponent implements OnInit {
  analyticsUrl: SafeResourceUrl;
  isSiemensInstance = this.configSvc.instanceConfig.features.siemens.enabled;
  constructor(private sanitizer: DomSanitizer, public routingSvc: RoutingService, private configSvc: ConfigService) { }

  ngOnInit() {
    this.analyticsUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.configSvc.instanceConfig.externalLinks.analytics
    );
  }
}
