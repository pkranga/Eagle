/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, Input } from '@angular/core'
import { CounterService } from '../../services/counter.service'
import { TFetchStatus } from '@ws-widget/utils'
import { IWsStatsConfig } from '../../models/ocm.model'

import { IWsCounterPlatformResponse, IWsCounterInfyMeResponse } from '../../models/counter.model'

path
@Component({
  selector: 'ws-app-adoption-dashboard',
  templateUrl: './adoption-dashboard.component.html',
  styleUrls: ['./adoption-dashboard.component.scss'],
})
export class AdoptionDashboardComponent implements OnInit {
  @Input() config: IWsStatsConfig | null = null
path
  infyMeCounterData: IWsCounterInfyMeResponse | null = null
path
  infyMeStatFetchStatus: TFetchStatus = 'none'

  stats: { title: string; titleKey: string; iconName: string; count: number }[] = []
path
  counterEnabled = false
  constructor(private counterSvc: CounterService) {}

  ngOnInit() {
    // const instanceConfig =  this.configSvc.getInstanceConfig()
    // const counterStatus = instanceConfig.featureStatus.get(EnumWsInstanceFeature.COUNTER)
    // if (counterStatus) {
    // this.counterEnabled = counterStatus.isAvailable
    this.counterEnabled = true
    // }
path
    this.statsClicked()
  }

  statsClicked() {
    switch (this.currentStat) {
path
path
        this.fetchLexCounterData()
        break
      }
      case 'infyme': {
        this.infyMeStatFetchStatus = 'fetching'
        this.fetchInfyMeCounterData()
        break
      }
    }
  }

  fetchLexCounterData() {
    this.counterSvc.fetchPlatformCounterData().subscribe(
      data => {
path
path
path
          this.processLexCounterData()
        }
      },
      () => {
path
      },
    )
  }

  fetchInfyMeCounterData() {
    this.counterSvc.fetchInfyMeCounterData().subscribe(
      data => {
        this.infyMeCounterData = data
        this.infyMeStatFetchStatus = 'done'
        if (this.infyMeCounterData) {
          this.processInfyMeCounterData()
        }
      },
      () => {
        this.infyMeStatFetchStatus = 'error'
      },
    )
  }

  processLexCounterData() {
path
path
path
      this.stats.push(
        {
path
path
          iconName: 'people',
path
        },
        {
          title: 'Average request per second',
path
          iconName: 'access_time',
path
        },
        {
          title: 'Active Learners in last 5 mins',
path
          iconName: 'notifications',
path
        },
      )
    }
  }

  processInfyMeCounterData() {
    const infyMeCounterData = this.infyMeCounterData
    if (infyMeCounterData) {
      this.stats = this.stats.filter(stat => stat.titleKey !== 'infyme')
      this.stats.push(
        {
          title: 'Total downloads',
          titleKey: 'infyme',
          iconName: '',
          count: infyMeCounterData.totalDownloads,
        },
        {
          title: 'Yesterday\'s Download ',
          titleKey: 'infyme',
          iconName: '',
          count: infyMeCounterData.yesterdaysDownloads,
        },
      )
    }
  }
}
