/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { ValuesService } from '../../../../services/values.service';
import { UserService } from '../../../../services/user.service';
import { AuthService } from '../../../../services/auth.service';
import { map, retry } from 'rxjs/operators';
import { ClientAnalyticsService } from '../../services/client-analytics.service';
import { ConfigService } from '../../../../services/config.service';
import { FetchStatus } from '../../../../models/status.model';
import { Globals } from '../../utils/globals';
import { ServiceObj, TileData } from '../../../../models/myAnalytics.model';
import { MatSnackBar } from '@angular/material';
import { AnalyticsServiceService } from '../../services/analytics-service.service';
import * as myAnalytics from '../../../../models/myAnalytics.model';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-home-analytics',
  templateUrl: './home-analytics.component.html',
  styleUrls: ['./home-analytics.component.scss']
})
export class HomeAnalyticsComponent implements OnInit {
  analyticsFetchStatus: FetchStatus = 'fetching';
  status: FetchStatus = 'none';
  assessmentData: myAnalytics.IAssessmentResponse;
  userprogressData: myAnalytics.IUserprogressResponse;
  timeSpentData: myAnalytics.ITimeSpentResponse;
  nsoData: myAnalytics.INsoDataResponse;
  dates = {
    start: '',
    end: '',
    count: 0
  };
  clientData;
  lastUpdatedOn: string;
  userPointsEarned: number;
  orgWideAvgTimespent: number;
  orgWideAvgPointsEarned: number;
  orgWideTotalAssessment:number;
  showImage: boolean;
  private defaultSideNavBarOpenedSubscription;
  isLtMedium$ = this .valueSvc.isLtMedium$;
  mode$ = this .isLtMedium$.pipe(map(isMedium => (isMedium ? 'over' : 'side')));
  screenSizeIsLtMedium: boolean;
  sideNavBarOpened = true;
  goalCount: number;
  playlistCount: number;
  myProgress = [];
  assessmentComplete:number= 0;
  goalsSharedToMeCount: number;
  loader2 = true;
  public calendarData = [['Date', 'Time Spent']];
  cardDetails = new TileData();
  serviveObj: ServiceObj;
  serachCount;
  likes;
  catelogueCount;
  loader = false;
  error = false;
  currentTab = '';
  tabs = [
    'myLearning',
    'myAssessment',
    'nsoProgress',
    'topCourses',
    'myCollaborators',
    'myPlans'
    // 'skillquotient',
    // 'orgAnalytics'
  ];
  paramSubscription: Subscription;
  email: string;
  name: string;
  data;
  endDate;
  startDate: string;
  eventText: string;
  emailId: string;
  dict = new Map();
  public selectedDate;
  constructor( private userSvc: UserService,
    private valueSvc: ValuesService,
    private authSvc: AuthService,
    private clientSvc: ClientAnalyticsService,
    private configSvc: ConfigService,
    private globals: Globals,
    public matSnackBar: MatSnackBar,
    private analyticsDataSer: AnalyticsServiceService,

  ) { }

  ngOnInit() {
    this .currentTab = 'learningAnalytics';
    if (this .authSvc.userEmail.endsWith('EMAIL')) {
      this .userSvc.fetchUserGraphProfile().subscribe(data => {
        this .emailId = data.onPremisesUserPrincipalName.split('@')[0];
        // this .showImage = true;
      });
    }
    this .defaultSideNavBarOpenedSubscription = this .isLtMedium$.subscribe(isLtMedium => {
      this .sideNavBarOpened = !isLtMedium;
      this .screenSizeIsLtMedium = isLtMedium;
    });
  }

  ngOnDestroy() {
    if (this .defaultSideNavBarOpenedSubscription) {
      this .defaultSideNavBarOpenedSubscription.unsubscribe();
    }
  }
  openSnackBar() {
    this .matSnackBar.open('Some Error Occurred', 'close', {
      duration: 3000
    });
  }
  sideNavOnClick(tab?: string) {
    if (this .screenSizeIsLtMedium) {
      this .sideNavBarOpened = !this .sideNavBarOpened;
    }
    if (tab) {
      this .currentTab = tab;
    }
  }
  public callFilteredGet(event: string) {
    const date = JSON.parse(event);
    this .dates.start = date.from;
    this .dates.end = date.to;
    this .dates.count = date.count;
    this .endDate = this .dates.end;
    this .startDate = this .dates.start;
    this.globals.selectedStartDate = this.startDate;
    this.globals.selectedEndDate = this.endDate;
    this .callAPI();
  }
  public onFilteredGet() {
   
    this.clientSvc.getFilteredServers(this.globals.filter_trend, this.dict,  this.globals.selectedStartDate,this.globals.selectedEndDate).subscribe(
      filterRes => {
        // this.analyticsFetchStatus = 'fetching';
        this.data = filterRes;
        this .loader = true;

        // this.analyticsFetchStatus = 'done';
      },
      error => {
        this .error = true;
        this .loader = true;
      }
    );
  }
 public callFilteredSearchGet() {
    this.onFilteredGet();
  }

callAPI() {
  this .currentTab = 'learningAnalytics';
  // if(this.currentTab==='learningAnalytics')
  // {
  //   this.onFilteredGet();
  // }
  this .loader = false;
  this .serviveObj = {
    type: 'timespent',
    contentType: 'Course',
    endDate: this .dates.end,
    startDate: this .dates.start,
    isCompleted: 0
  };
  this.clientSvc.getData(this.serviveObj.startDate,this.serviveObj.endDate, this .serviveObj ).subscribe(
    res => {
      this.data = res;
      this .loader = true;
      // this.getChartData(this.data);
     
    },
    error => {
      this .error = true;
      this .loader = true;
    }
  );
}
}
