/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, Input, OnChanges } from '@angular/core';
import { UtilityService } from '../../../../services/utility.service';
import { ConfigService } from '../../../../services/config.service';

@Component({
  selector: 'app-btn-analytics',
  templateUrl: './btn-analytics.component.html',
  styleUrls: ['./btn-analytics.component.scss']
})
export class BtnAnalyticsComponent implements OnChanges {
  @Input()
  contentId: string;
  url: string;
  constructor(
    private utilSvc: UtilityService,
    private configSvc: ConfigService
  ) {}

  ngOnChanges() {
    if (this.contentId) {
      this.url = `/toc/${this.contentId}/analytics`;
    }
  }
  execute(event: Event) {
    if (event && event.stopPropagation) {
      event.stopPropagation();
    }
    if (!this.configSvc.instanceConfig.features.btnAnalytics.available) {
      event.preventDefault();
      this.utilSvc.featureUnavailable();
      return;
    }
  }
}
