/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input } from '@angular/core';
import { ContentService } from '../../../../services/content.service';
import {
  IContent,
  TContentRecommendationType
} from '../../../../models/content.model';
import { FetchStatus } from '../../../../models/status.model';
import { ConfigService } from '../../../../services/config.service';
import { IPersonalizedFilterRecommendations } from "../../../../models/instanceConfig.model";


@Component({
  selector: 'app-trending',
  templateUrl: './trending.component.html',
  styleUrls: ['./trending.component.scss']
})
export class TrendingComponent implements OnInit {
  trendingFilterMapping: IPersonalizedFilterRecommendations = this.configSvc.instanceConfig.features.home.subFeatures.filtersInPersonalizedRecommendations.personalizedFilterRecommendations;
  @Input() cardType: 'basic' | 'advanced' = 'advanced';
  trendingRecommendationsContent: IContent[] = [];
  showFilters = this.configSvc.instanceConfig.features.home.subFeatures
    .filtersInTrending.available;

  selectedFilter: TContentRecommendationType = 'org';
  isUpdating = false;
  fetchStatus: FetchStatus = 'none';

  pageNumber = 0;
  pageSize = 10;

  constructor(
    private contentSvc: ContentService,
    private configSvc: ConfigService
  ) { }

  ngOnInit() {

    // let abc = this.personalizedRecommendationData;
    // console.log("json", abc)
    this.fetchTrending();
  }

  fetchTrending(isUpdating = false) {
    if (isUpdating) {
      this.isUpdating = true;
    }
    this.fetchStatus = 'fetching';
    this.contentSvc
      .fetchHomeGroupRecommendations(this.selectedFilter, 'trending', this.pageSize, this.pageNumber)
      .subscribe(
        data => {
          this.trendingRecommendationsContent = (this.trendingRecommendationsContent || []).concat(data);
          this.isUpdating = false;
          this.fetchStatus = data.length < this.pageSize ? 'done' : 'hasMore'
          this.pageNumber += 1
        },
        err => {
          this.isUpdating = false;
        }
      );
  }
}
