/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input } from '@angular/core';
import { IContentCardHash, IHistory } from '../../../../models/content.model';

import { HistoryService } from '../../../../services/history.service';
import { UtilityService } from '../../../../services/utility.service';
import { UserService } from '../../../../services/user.service';
import { ConfigService } from '../../../../services/config.service';

@Component({
  selector: 'app-continue-learning',
  templateUrl: './continue-learning.component.html',
  styleUrls: ['./continue-learning.component.scss']
})
export class ContinueLearningComponent implements OnInit {
  @Input() cardType: 'basic' | 'advanced' = 'advanced';
  @Input() isSmall = false;

  showResources = false;
  showCompleted = false;

  continueLearningRequest = {
    ...this.configSvc.instanceConfig.features.home.config.continueLearning
  };
  continueLearningData: IHistory[] = [];
  continueLearningDataOriginal: IHistory[] = [];
  contentStripHash: { [identifier: string]: IContentCardHash } = {};
  progressHash: { [id: string]: number };

  constructor(
    private historySvc: HistoryService,
    private utilitySvc: UtilityService,
    private userSvc: UserService,
    private configSvc: ConfigService
  ) {}

  ngOnInit() {
    const showResourcesLS = localStorage.getItem('showResources');
    if (showResourcesLS && showResourcesLS === 'yes') {
      this.showResources = true;
    }
    const showCompletedLS = localStorage.getItem('showCompleted');
    if (showCompletedLS && showCompletedLS === 'yes') {
      this.showCompleted = true;
    }
    this.fetchContinueLearning();
    this.fetchUserProgress();
  }

  fetchUserProgress() {
    this.userSvc.getProgressHash().subscribe(data => {
      this.progressHash = data;
      this.applyCompletedFilter();
    });
  }

  fetchContinueLearning() {
    this.continueLearningRequest.status = 'fetching';
    this.historySvc
      .fetchContinueLearning(this.continueLearningRequest.pageSize, this.continueLearningRequest.pageState)
      .subscribe(response => {
        if (!(response && response.results && response.results.length)) {
          this.continueLearningRequest.status = 'done';
          return;
        }
        this.continueLearningDataOriginal = [...this.continueLearningDataOriginal, ...response.results];
        this.continueLearningData = [...this.continueLearningData, ...response.results];
        this.showResources =
          this.continueLearningData
            .map(content => content.contentType)
            .every(contentType => contentType === 'Resource') || localStorage.getItem('showResources') === 'yes';
        if (!this.showResources) {
          this.continueLearningData = this.continueLearningData.filter(data => data.contentType !== 'Resource');
        }
        this.continueLearningRequest.pageState = response.pageState;
        if (!this.continueLearningRequest.pageState) {
          this.continueLearningRequest.status = 'done';
        } else {
          this.continueLearningRequest.status = 'hasMore';
        }

        this.continueLearningData.forEach(content => {
          this.contentStripHash[content.identifier] = {
            continueLearning:
              content.continueLearningData &&
              content.continueLearningData.data &&
              JSON.parse(content.continueLearningData.data).timestamp
                ? this.utilitySvc.getFormattedDate(JSON.parse(content.continueLearningData.data).timestamp, false)
                : ''
          };
        });
        this.applyResourceFilter();
        this.applyCompletedFilter();
      });
  }

  applyResourceFilter() {
    if (this.progressHash && this.continueLearningData.length) {
      if (this.showResources) {
        localStorage.setItem('showResources', 'yes');
        if (this.showCompleted) {
          this.continueLearningData = [...this.continueLearningDataOriginal];
        } else {
          this.continueLearningData = [...this.continueLearningDataOriginal];
          this.continueLearningData.forEach((content, index) => {
            if (this.progressHash[content.identifier] && this.progressHash[content.identifier] > 0.99) {
              this.continueLearningData.splice(index, 1);
            }
          });
        }
      } else {
        localStorage.setItem('showResources', 'no');
        this.continueLearningData = this.continueLearningData.filter(content => content.contentType !== 'Resource');
      }
    }
  }

  applyCompletedFilter() {
    if (this.progressHash && this.continueLearningData.length) {
      if (this.showCompleted) {
        localStorage.setItem('showCompleted', 'yes');
        if (this.showResources) {
          this.continueLearningData = [...this.continueLearningDataOriginal];
        } else {
          this.continueLearningData = this.continueLearningDataOriginal.filter(
            content => content.contentType !== 'Resource'
          );
        }
      } else {
        localStorage.setItem('showCompleted', 'no');
        this.continueLearningData.forEach((content, index) => {
          if (this.progressHash[content.identifier] && this.progressHash[content.identifier] > 0.99) {
            this.continueLearningData.splice(index, 1);
          }
        });
      }
    }
  }
}
