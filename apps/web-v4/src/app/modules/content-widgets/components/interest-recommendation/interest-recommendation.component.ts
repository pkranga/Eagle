/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input } from '@angular/core';
import { ContentService } from '../../../../services/content.service';
import {
  IHomeRecommendationEntity,
  IContent,
  IContentCardHash
} from '../../../../models/content.model';
import { FetchStatus } from '../../../../models/status.model';

@Component({
  selector: 'app-interest-recommendation',
  templateUrl: './interest-recommendation.component.html',
  styleUrls: ['./interest-recommendation.component.scss']
})
export class InterestRecommendationComponent implements OnInit {
  @Input() cardType: 'basic' | 'advanced' = 'advanced';
  interestRecommendations: IHomeRecommendationEntity[] = [];
  interestRecommendationsContent: IContent[] = [];
  contentStripHash: { [identifier: string]: IContentCardHash } = {};
  fetchStatus: FetchStatus = 'fetching';
  constructor(private contentSvc: ContentService) { }

  ngOnInit() {
    this.contentSvc
      .fetchUserHomeRecommendations('interestRecommended')
      .subscribe(data => {
        data = data || [];
        data = data.slice(0, 25);
        this.interestRecommendations = data;
        this.interestRecommendationsContent = this.interestRecommendations.map(
          recommendation => {
            return recommendation.course;
          }
        );
        this.interestRecommendations.forEach(recommendation => {
          this.contentStripHash[recommendation.course.identifier] = {
            interestRecommendation: recommendation.reasonsForRecommendation
          };
        });
        this.fetchStatus = 'done';
      }, err => {
        this.fetchStatus = 'error';
      });
  }
}
