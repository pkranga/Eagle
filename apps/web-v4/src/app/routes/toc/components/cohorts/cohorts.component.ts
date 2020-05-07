/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input } from '@angular/core';
import {
  ICohortsActiveUsers,
  ICohortsSMEs,
  ICohortsContent
} from '../../../../models/cohorts.model';
import { StatsApiService } from '../../../../apis/stats-api.service';
import { BatchService } from '../../../../apis/batch-api.service';
import { IContent } from '../../../../models/content.model';
import { FetchStatus } from '../../../../models/status.model';
import { ICohortsBatchCohorts } from '../../../../models/batch.model';
import { ConfigService } from '../../../../services/config.service';

@Component({
  selector: 'app-cohorts',
  templateUrl: './cohorts.component.html',
  styleUrls: ['./cohorts.component.scss']
})
export class CohortsComponent implements OnInit {
  @Input() content: IContent;

  activeUsers: ICohortsActiveUsers;
  smes: ICohortsSMEs;
  batchCohorts: ICohortsBatchCohorts[];
  contactUsMail = this.configSvc.instanceConfig.platform.contactUsMail;
  activeUsersStatus: FetchStatus = 'fetching';
  smesStatus: FetchStatus = 'fetching';
  batchCohortsStatus: FetchStatus = 'fetching';

  activeUsersFilter: 'all' | 'active' | 'sharing' = 'all';
  smesFilter: 'all' | 'author' | 'educator' | 'topper' = 'all';

  activeUsersSelected: ICohortsContent[];
  smesSelected: ICohortsContent[];

  selectedTabIndex = 0;
  cohortsConfig = this.configSvc.instanceConfig.features.toc.subFeatures.cohorts.subFeatures;

  constructor(
    private statsSvc: StatsApiService,
    private batchServices: BatchService,
    private configSvc: ConfigService
  ) { }

  ngOnInit() {
    this.getCohorts();
  }

  getCohorts() {
    if (this.selectedTabIndex === 0 && !this.activeUsers) {
      this.activeUsersStatus = 'fetching';
      this.statsSvc.fetchActiveUsers(this.content.identifier).subscribe(
        data => {
          this.activeUsers = data;
          this.onActiveUsersFilterChange();
          this.activeUsersStatus = 'done';
        },
        err => {
          this.activeUsersStatus = 'error';
        }
      );
    } else if (this.selectedTabIndex === 1 && !this.smes) {
      this.smesStatus = 'fetching';
      this.statsSvc.fetchSMEsCohorts(this.content.identifier).subscribe(
        data => {
          this.smes = data;
          this.onSmesFilterChange();
          this.smesStatus = 'done';
        },
        err => {
          this.smesStatus = 'error';
        }
      );
    } else if (this.selectedTabIndex === 2 && !this.batchCohorts) {
      this.batchCohortsStatus = 'fetching';
      this.batchServices.fetchBatchCohorts(this.content.identifier).subscribe(
        data => {
          this.batchCohorts = data;
          this.batchCohortsStatus = 'done';
        },
        err => {
          this.batchCohortsStatus = 'error';
        }
      );
    }
  }

  onTabChange() {
    this.getCohorts();
  }

  onActiveUsersFilterChange() {
    this.activeUsersSelected = [];
    switch (this.activeUsersFilter) {
      case 'all':
        this.activeUsers.active_users.forEach(user => {
          this.activeUsersSelected.push(user);
        });

        this.activeUsers.similar_goals_users.forEach(user => {
          this.activeUsersSelected.push(user);
        });

        break;

      case 'active':
        this.activeUsers.active_users.filter(active => active.desc.toLowerCase() === 'currently viewing').forEach(user => {
          this.activeUsersSelected.push(user);
        });
        break;

      case 'sharing':
        this.activeUsers.similar_goals_users.forEach(user => {
          this.activeUsersSelected.push(user);
        });

        break;
    }
  }

  onSmesFilterChange() {
    this.smesSelected = [];
    switch (this.smesFilter) {
      case 'all':
        this.smes.authors.forEach(user => {
          this.smesSelected.push(user);
        });

        this.smes.educators.forEach(user => {
          this.smesSelected.push(user);
        });

        this.smes.highPerfomers.forEach(user => {
          this.smesSelected.push(user);
        });

        break;

      case 'author':
        this.smes.authors.forEach(user => {
          this.smesSelected.push(user);
        });

        break;

      case 'educator':
        this.smes.educators.forEach(user => {
          this.smesSelected.push(user);
        });

        break;

      case 'topper':
        this.smes.highPerfomers.forEach(user => {
          this.smesSelected.push(user);
        });

        break;
    }
  }
}
