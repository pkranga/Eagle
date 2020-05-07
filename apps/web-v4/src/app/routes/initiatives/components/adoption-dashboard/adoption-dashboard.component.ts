/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input } from '@angular/core';
import { CounterService } from '../../../../services/counter.service';
import { ICounterPlatformResponse, ICounterInfyMeResponse } from '../../../../models/counter.model';
import { FetchStatus } from '../../../../models/status.model';
import { IDashboardConfig } from '../../../../models/wingspan-pages.model';
import { ConfigService } from '../../../../services/config.service';

type TStatTitleKey = 'lex' | 'infyme';
@Component({
  selector: 'app-adoption-dashboard',
  templateUrl: './adoption-dashboard.component.html',
  styleUrls: ['./adoption-dashboard.component.scss']
})
export class AdoptionDashboardComponent implements OnInit {
  @Input() config: IDashboardConfig;
  lexCounterData: ICounterPlatformResponse;
  infyMeCounterData: ICounterInfyMeResponse;


  lexStatFetchStatus: FetchStatus;
  infyMeStatFetchStatus: FetchStatus;

  stats: { title: string, titleKey: string, iconName: string, count: number }[] = [];
  currentStat: TStatTitleKey;
  counterEnabled: boolean;
  constructor(private counterSvc: CounterService, private configSvc: ConfigService) { }

  ngOnInit() {
    this.counterEnabled = this.configSvc.instanceConfig.features.counter.available;
    this.currentStat = 'lex'
    this.statsClicked()
  }

  statsClicked() {
    switch (this.currentStat) {
      case 'lex': {
        this.lexStatFetchStatus = 'fetching';
        this.fetchLexCounterData();
        break;
      }
      case 'infyme': {
        this.infyMeStatFetchStatus = 'fetching';
        this.fetchInfyMeCounterData();
        break;
      }
    }
  }

  fetchLexCounterData() {
    this.counterSvc.fetchPlatformCounterData().subscribe(data => {
      this.lexCounterData = data;
      this.lexStatFetchStatus = 'done';
      if (this.lexCounterData) {
        this.processLexCounterData();
      }
    }, err => {
      this.lexStatFetchStatus = 'error';
    });
  }
  fetchInfyMeCounterData() {
    this.counterSvc.fetchInfyMeCounterData().subscribe(data => {
      this.infyMeCounterData = data;
      this.infyMeStatFetchStatus = 'done';
      if (this.infyMeCounterData) {
        this.processInfyMeCounterData();
      }
    }, err => {
      this.infyMeStatFetchStatus = 'error';
      // this.infyMeCounterData = {
      //   downloads: [],
      //   yesterdays_downloads: 0,
      //   total_downloads: 115661
      // };
      // console.log(this.infyMeCounterData);
      // if (this.infyMeCounterData) {
      //   this.processInfyMeCounterData();
      // }
    });
  }
  processLexCounterData() {
    this.stats = this.stats.filter(stat => stat.titleKey !== 'lex')
    this.stats.push(
      {
        title: 'Total unique learners on LEX',
        titleKey: 'lex',
        iconName: 'people',
        count: this.lexCounterData.users[this.lexCounterData.users.length - 1].count
      },
      {
        title: 'Average request per second',
        titleKey: 'lex',
        iconName: 'access_time',
        count: this.lexCounterData.load[this.lexCounterData.load.length - 1].count
      },
      {
        title: 'Active Learners in last 5 mins',
        titleKey: 'lex',
        iconName: 'notifications',
        count: this.lexCounterData.learners[this.lexCounterData.learners.length - 1].count
      }
    );
  }

  processInfyMeCounterData() {
    console.log('infy me counter called')
    this.stats = this.stats.filter(stat => stat.titleKey !== 'infyme')
    this.stats.push(
      {
        title: 'Total downloads',
        titleKey: 'infyme',
        iconName: '',
        count: this.infyMeCounterData.totalDownloads
      },
      {
        title: 'Yesterday\'s Download ',
        titleKey: 'infyme',
        iconName: '',
        count: this.infyMeCounterData.yesterdaysDownloads
      }
    );
  }

}
