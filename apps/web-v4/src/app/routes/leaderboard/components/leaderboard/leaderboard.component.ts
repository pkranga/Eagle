/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ILeaderboardToppers, ILeaderboardTopperDetails } from '../../../../models/leaderboard.model';

import { LeaderboardApiService } from '../../../../apis/leaderboard-api.service';
import { RoutingService } from '../../../../services/routing.service';
import { ConfigService } from '../../../../services/config.service';
@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit {
  lbWeekly: ILeaderboardToppers;
  lbMonthly: ILeaderboardToppers;
  lbHallOfFame: ILeaderboardTopperDetails[];
  loadingContent = true;
  isClient = this.configSvc.instanceConfig.features.client.enabled;
  selectedLeaderboardType = 'L';
  selectedTabIndex = 0;
  readonly tabsMap = ['WEEKLY', 'MONTHLY', 'HALL_OF_FAME'];
  loadingLeaderboards = true;
  loadingCurrentLeaderboard = false;

  constructor(
    private lbSvc: LeaderboardApiService,
    public routingSvc: RoutingService,
    private configSvc: ConfigService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe(paramMap => {
      if (paramMap.has('for') && paramMap.has('tab')) {
        this.selectedLeaderboardType = paramMap.get('for') || 'L';
        this.selectedTabIndex = this.tabsMap.indexOf(paramMap.get('tab')) || 0;
        this.initLeaderboard();
      } else {
        this.router.navigate(['/leaderboard'], {
          queryParams: {
            for: 'L',
            tab: 'WEEKLY'
          },
          queryParamsHandling: 'merge'
        });
      }
    });
  }

  initLeaderboard() {
    if (this.selectedTabIndex === 0 && !this.lbWeekly) {
      this.loadingContent = true;
      // Weekly
      this.lbSvc
        .getLeaderboardData(
          this.selectedLeaderboardType,
          'W', // 'W'
          this.lbSvc.currentDateObj.week,
          this.lbSvc.currentDateObj.year
        )
        .subscribe((data: ILeaderboardToppers) => {
          this.lbWeekly = data;
          this.lbWeekly.tabType = 'WEEKLY';
          this.loadingContent = false;
        });
    } else if (this.selectedTabIndex === 1 && !this.lbMonthly) {
      this.loadingContent = true;
      // Monthly
      this.lbSvc
        .getLeaderboardData(
          this.selectedLeaderboardType,
          'M', // 'M'
          this.lbSvc.currentDateObj.month,
          this.lbSvc.currentDateObj.year
        )
        .subscribe((data: ILeaderboardToppers) => {
          this.lbMonthly = data;
          this.lbMonthly.tabType = 'MONTHLY';
          this.loadingContent = false;
        });
    } else if (this.selectedTabIndex === 2 && !this.lbHallOfFame) {
      this.loadingContent = true;
      // Hall of Fame
      this.lbSvc
        .getLeaderboardData(
          this.selectedLeaderboardType,
          'M' // 'M'
        )
        .subscribe((data: ILeaderboardTopperDetails[]) => {
          this.lbHallOfFame = data;
          this.loadingContent = false;
        });
    }
  }

  load(tabType: string, durationType: string, durationValue: number, year: number) {
    this.loadingContent = true;
    this.lbSvc
      .getLeaderboardData(this.selectedLeaderboardType, durationType, durationValue, year)
      .subscribe((data: ILeaderboardToppers) => {
        if (durationType === 'W') {
          this.lbWeekly = data;
        } else {
          this.lbMonthly = data;
        }
        this.loadingContent = false;
      });
  }

  onLeaderboardChange() {
    this.router.navigate(['/leaderboard'], {
      queryParams: {
        for: this.selectedLeaderboardType
      },
      queryParamsHandling: 'merge'
    });

    this.lbWeekly = undefined;
    this.lbMonthly = undefined;
    this.lbHallOfFame = undefined;
    this.loadingContent = true;
  }

  onTabChange(selectedIndex) {
    this.selectedTabIndex = selectedIndex;
    this.router.navigate(['/leaderboard'], {
      queryParams: {
        tab: this.tabsMap[this.selectedTabIndex]
      },
      queryParamsHandling: 'merge'
    });
  }
}
