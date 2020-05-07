/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input } from '@angular/core';
import {
  IContent,
  TContentRecommendationType
} from '../../../../models/content.model';
import { ContentService } from '../../../../services/content.service';
import { FetchStatus } from '../../../../models/status.model';
import { ConfigService } from '../../../../services/config.service';
import { IPersonalizedFilterRecommendations } from "../../../../models/instanceConfig.model";


@Component({
  selector: 'app-recommendations',
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.scss']
})
export class RecommendationsComponent implements OnInit {
  recommendationFilterMapping: IPersonalizedFilterRecommendations = this.configSvc.instanceConfig.features.home.subFeatures.filtersInPersonalizedRecommendations.personalizedFilterRecommendations;
  @Input() cardType: 'basic' | 'advanced' = 'advanced';
  userRecommendationsContent: IContent[] = [];
  showFilters = this.configSvc.instanceConfig.features.home.subFeatures
    .filtersInPersonalizedRecommendations.available;
  selectedFilter: TContentRecommendationType = 'org';
  isUpdating = false;
  fetchStatus: FetchStatus = 'none';
  constructor(
    private contentSvc: ContentService,
    private configSvc: ConfigService
  ) { }

  ngOnInit() {
    this.fetchStatus = 'fetching';
    this.fetchUserRecommendations();
  }

  fetchUserRecommendations(isUpdating = false) {
    if (isUpdating) {
      this.isUpdating = true;
    }
    this.contentSvc
      .fetchHomeGroupRecommendations(this.selectedFilter, 'all')
      .subscribe(
        data => {
          try {
            if (Array.isArray(data) && data.length) {
              let dataSize = data.length;
              while (dataSize > 0) {
                const randomIndex = Math.floor(Math.random() * dataSize);
                dataSize -= 1;
                const temp = data[dataSize];
                data[dataSize] = data[randomIndex];
                data[randomIndex] = temp;
              }
              this.userRecommendationsContent = data;
            }
          } catch (e) {
            console.error(
              'Error occurred while randomizing recommendations data'
            );
          }
          this.isUpdating = false;
          this.fetchStatus = 'done';
        },
        err => {
          this.isUpdating = false;
        }
      );
  }
}
