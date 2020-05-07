/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ICounterPlotData, ICounterPlatformResponse } from '../../../../models/counter.model';
import { CounterService } from '../../../../services/counter.service';
import { RoutingService } from '../../../../services/routing.service';
import { ConfigService } from '../../../../services/config.service';
import { interval, Subscription } from 'rxjs';
import { ResolveResponse } from '../../../../models/routeResolver.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ws-platform-counter',
  templateUrl: './platform-counter.component.html',
  styleUrls: ['./platform-counter.component.scss']
})
export class PlatformCounterComponent implements OnInit, OnDestroy {
  platformName = this.configSvc.instanceConfig.platform.appName;
  hasErrorFetching = false;
  graphs: {
    load: ICounterPlotData;
    users: ICounterPlotData;
    learners: ICounterPlotData;
  };
  counterResolverResponse: ResolveResponse<ICounterPlatformResponse> = this.route.snapshot.data.platform;
  counterSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private counterSvc: CounterService,
    public routingSvc: RoutingService,
    private configSvc: ConfigService
  ) {}

  ngOnInit() {
    if (this.counterResolverResponse.error) {
      this.hasErrorFetching = true;
    } else {
      this.processCounterData(this.counterResolverResponse.data);
    }
    this.counterSubscription = interval(1000 * 60 * 2).subscribe(() => {
      this.fetchCounterData();
    });
  }

  ngOnDestroy() {
    if (this.counterSubscription) {
      this.counterSubscription.unsubscribe();
    }
  }

  fetchCounterData() {
    this.counterSvc.fetchPlatformCounterData().subscribe(
      data => {
        this.hasErrorFetching = false;
        this.processCounterData(data);
      },
      err => {
        this.hasErrorFetching = true;
      }
    );
  }

  processCounterData(data: ICounterPlatformResponse) {
    this.graphs = {
      users: {
        data: data.users,
        meta: {
          chartId: 'user',
          graphLabel: 'Users',
          graphTitle: 'Users',
          graphType: 'line',
          xLabel: 'time',
          yLabel: 'Users',
          borderColor: '#f69b1e',
          backgroundColor: '#fdf1de',
          header: {
            icon: 'people_outline',
            value: data.users[data.users.length - 1].count,
            txt: `Total unique learners on ${this.platformName}`
          }
        }
      },
      load: {
        data: data.load,
        meta: {
          chartId: 'load',
          graphLabel: 'Average Requests',
          graphTitle: 'Load',
          graphType: 'line',
          xLabel: 'time',
          yLabel: 'Requests per s',
          borderColor: '#3f51b5',
          backgroundColor: '#ebedfd',
          header: {
            icon: 'timer',
            value: data.load[data.load.length - 1].count,
            txt: 'Average request per second'
          }
        }
      },
      learners: {
        data: data.learners,
        meta: {
          chartId: 'learner',
          graphLabel: 'Active Learners',
          graphTitle: 'Learners',
          graphType: 'line',
          xLabel: 'time',
          yLabel: 'Learners',
          borderColor: '#ff6384',
          backgroundColor: '#fcebee',
          header: {
            icon: 'notifications_none',
            value: data.learners[data.learners.length - 1].count,
            txt: 'Active Learners in last 5 mins'
          }
        }
      }
    };
  }
}
