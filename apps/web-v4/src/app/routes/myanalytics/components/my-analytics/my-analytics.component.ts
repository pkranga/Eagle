/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { map, retry } from 'rxjs/operators';
import { UserService } from '../../../../services/user.service';
import * as myAnalytics from '../../../../models/myAnalytics.model';
import { ServiceObj, TileData } from '../../../../models/myAnalytics.model';
import { FetchStatus } from '../../../../models/status.model';
import { AuthService } from '../../../../services/auth.service';
import { ValuesService } from '../../../../services/values.service';
import {ConfigService} from '../../../../services/config.service';
import { AnalyticsServiceService } from '../../services/analytics-service.service';

@ Component({
  selector: 'app-my-analytics',
  templateUrl: './my-analytics.component.html',
  styleUrls: ['./my-analytics.component.scss']
})
export class MyAnalyticsComponent implements OnInit, OnDestroy {
  isSiemensAvailable =this.configSvc.instanceConfig.features.siemens.enabled;
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
    'myPlans',
    'myCollaborators',
    'topCourses'
    // 'skillquotient',
    // 'orgAnalytics'
  ];
  paramSubscription: Subscription;
  email: string;
  name: string;
  endDate;
  startDate: string;
  eventText: string;
  emailId: string;
  constructor(
    private authSvc: AuthService,
    private route: ActivatedRoute,
    private userSvc: UserService,
    private valueSvc: ValuesService,
    private analyticsDataSer: AnalyticsServiceService,
    public matSnackBar: MatSnackBar,
    private configSvc: ConfigService
  ) {}

  ngOnInit() {
    if (this .authSvc.userEmail.endsWith('EMAIL')) {
      this .userSvc.fetchUserGraphProfile().subscribe(data => {
        this .emailId = data.onPremisesUserPrincipalName.split('@')[0];
        this .showImage = true;
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
    this .callAPI();
  }

  callAPI() {
    this .loader = false;
    this .serviveObj = {
      type: 'timespent',
      contentType: 'Course',
      endDate: this .dates.end,
      startDate: this .dates.start,
      isCompleted: 0
    };
    this .analyticsDataSer
      .getData(this .serviveObj)
      .pipe(retry(3))
      .subscribe(
        data => {
          this.currentTab = 'myLearning';
          this.timeSpentData = data;
          this.lastUpdatedOn = this.timeSpentData.last_updated_on.toString().split('T')[0];
          const orgAverage = this.timeSpentData.timespent_user_vs_org_wide;
          this.orgWideAvgTimespent = Math.ceil(orgAverage.usage_percent);
          this.userPointsEarned = this.timeSpentData.points_and_ranks.user_points_earned;
          this.orgWideAvgPointsEarned = this .timeSpentData.points_and_ranks.points_user_vs_org_wide.points_percent;
          this.cardDetails.badges = this.timeSpentData['total_badges_earned'];
          this.cardDetails.learningMin = Math.round(this .timeSpentData.time_spent_by_user / 60);
          this.cardDetails.learningPoints = this.timeSpentData.points_and_ranks.user_points_earned;
          this.loader = true;
        },
        error => {
          this .error = true;
          this .loader = true;
          this .openSnackBar();
        }
      );
    this .serviveObj.type = 'assessment';
    this .analyticsDataSer.getData(this .serviveObj).pipe(retry(3))
      .subscribe(data => {
        this .assessmentData = data;
        this .serviveObj.type = 'nsoArtifactsAndCollaborators';
        this .analyticsDataSer.getData(this .serviveObj).pipe(retry(3))
          .subscribe(data1 => {
            this .nsoData = data1;
            this .serviveObj.type = 'userprogress';
            this .analyticsDataSer.getData(this .serviveObj).pipe(retry(3))
              .subscribe(data2 => {
                this .userprogressData = data2;
                this .chartData();
              },
                    error => {
                      this .error = true;
                      this .loader = true;
                      this .openSnackBar();
                    }
                  );
              },
              error => {
                this .error = true;
                this .loader = true;
              }
            );
        },
        error => {
          this .error = true;
          this .loader = true;
        }
      );
  }

  onSwipe(evt) {
    const x = Math.abs(evt.deltaX) > 40 ? (evt.deltaX > 0 ? 'right' : 'left') : '';
    const y = Math.abs(evt.deltaY) > 40 ? (evt.deltaY > 0 ? 'down' : 'up') : '';
    if (x === 'right') {
      this .sideNavBarOpened = true;
    }
  }
  chartData() {
   
    this.assessmentComplete = 0;
    this.goalCount = this .userprogressData.goal_progress.length;
    this.playlistCount = this .userprogressData.playlist_progress.length;
    this.myProgress = this .userprogressData.learning_history;
    this.goalsSharedToMeCount = this .userprogressData.goal_shared_to_me.length;
    this.assessmentData.assessment.map((cur: any) => {
      if (cur.assessment_score >= 60) {
        this .assessmentComplete += 1;
      }
    });
    this.orgWideTotalAssessment=this.assessmentData.user_assessment_count_vs_org_wide;
    this.assessmentComplete = Math.abs(this .myProgress.length - this .assessmentComplete);
    this.cardDetails.artifactSharedByMe = this .nsoData.artifacts_shared.length;
    this.cardDetails.certificates = this .assessmentData.certifications_count;
    this.cardDetails.expertsContacted = this .nsoData.experts_contacted.length;
    this.cardDetails.goals = this .userprogressData.goal_progress.length;
    this.cardDetails.goalsSharedByMe = this .userprogressData.goal_shared_by_me.length;
    this.cardDetails.goalsSharedToMe = this .userprogressData.goal_shared_to_me.length;
    this.cardDetails.infyTV = this .nsoData.feature_usage_stats.tv_count;
    this.cardDetails.likes = this .nsoData.likes_detail.length;
    this.cardDetails.navigator = this .nsoData.feature_usage_stats.navigator_count;
    this.cardDetails.nsoProgram = this .nsoData.total_nso_program_taken;
    this.cardDetails.pendingAssessments = this .assessmentComplete;
    this.cardDetails.playGround = this .nsoData.playground_details.length;
    this.cardDetails.playlist = this .userprogressData.playlist_progress.length;
    this.cardDetails.search = this .nsoData.feature_usage_stats.search_count;
    this.cardDetails.totalAssessments = this .assessmentData.assessment.length;
    this.cardDetails.infyRadio = this .nsoData.feature_usage_stats.radio_count;
    this.cardDetails.infyLive = this .nsoData.feature_usage_stats.live_count;
    this.loader = true;
    this.loader2 = false;
  }
}
