/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input } from '@angular/core';
import {
  IHomeRecommendationEntity,
  IContent,
  IContentCardHash
} from '../../../../models/content.model';
import { ContentService } from '../../../../services/content.service';

@Component({
  selector: 'app-usage-recommendation',
  templateUrl: './usage-recommendation.component.html',
  styleUrls: ['./usage-recommendation.component.scss']
})
export class UsageRecommendationComponent implements OnInit {
  @Input() cardType: 'basic' | 'advanced' = 'advanced';
  usageRecommendations: IHomeRecommendationEntity[] = [];
  usageRecommendationsContent: IContent[] = [];
  contentStripHash: { [identifier: string]: IContentCardHash } = {};
  constructor(private contentSvc: ContentService) { }

  ngOnInit() {
    this.contentSvc
      .fetchUserHomeRecommendations('usageRecommended')
      .subscribe(data => {
        this.usageRecommendations = (data || []).filter(rec => rec.course);
        this.usageRecommendationsContent = this.usageRecommendations.map(
          recommendation => {
            return recommendation.course;
          }
        );
        this.usageRecommendations.forEach(recommendation => {
          this.contentStripHash[recommendation.course.identifier] = {
            usageRecommendation: recommendation.reasonsForRecommendation
          };
        });
      });
  }
}
