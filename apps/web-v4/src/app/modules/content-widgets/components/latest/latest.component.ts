/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input } from '@angular/core';
import {
  IContent,
  TContentRecommendationType
} from '../../../../models/content.model';
import { FetchStatus } from '../../../../models/status.model';

import { ContentService } from '../../../../services/content.service';
import { ConfigService } from '../../../../services/config.service';
import { IPersonalizedFilterRecommendations } from "../../../../models/instanceConfig.model";
@Component({
  selector: 'app-latest',
  templateUrl: './latest.component.html',
  styleUrls: ['./latest.component.scss']
})
export class LatestComponent implements OnInit {
  latestFilterMapping: IPersonalizedFilterRecommendations = this.configSvc.instanceConfig.features.home.subFeatures.filtersInLatest.personalizedFilterRecommendations;
  @Input() cardType: 'basic' | 'advanced' = 'advanced';
  latestRecommendations: IContent[] = [];
  showFilters = this.configSvc.instanceConfig.features.home.subFeatures
    .filtersInLatest.available;
  selectedFilter: TContentRecommendationType = 'org';
  isUpdating = false;
  fetchStatus: FetchStatus = 'none';
  constructor(
    private contentSvc: ContentService,
    private configSvc: ConfigService
  ) { }

  ngOnInit() {
    this.fetchStatus = 'fetching';
    this.fetchLatest();
  }

  fetchLatest(isUpdating = false) {
    if (isUpdating) {
      this.isUpdating = true;
    }
    this.contentSvc
      .fetchHomeGroupRecommendations(this.selectedFilter, 'latest')
      .subscribe(
        data => {
          this.latestRecommendations = data;
          this.isUpdating = false;
          this.fetchStatus = 'done';
        },
        err => {
          this.isUpdating = false;
        }
      );
  }
}
