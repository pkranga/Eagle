/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {AnalyticsServiceService} from '../../services/analytics-service.service';
import { MiscApiService } from '../../../../apis/misc-api.service';
import { PageEvent } from '@angular/material';
import {TileData, ServiceObj} from '../../../../models/myAnalytics.model';
import * as myAnalytics from '../../../../models/myAnalytics.model';
import { map, retry } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

export interface CourseElement{
  course:string;
  userProgress:string;
  system:string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];
@Component({
  selector: 'ws-learning-history',
  templateUrl: './learning-history.component.html',
  styleUrls: ['./learning-history.component.scss']
})
export class LearningHistoryComponent implements OnInit {
  dataSource = ELEMENT_DATA;
 loader2= true;
  goalData;
  myProgress;
  courseObj:CourseElement;
  courseData=[];
playListData;
othersProgress;
  certificationList;
badgesDetails;
  dates: any;
  goalsSharedWithMe: number;
  displayedColumns: string[] = ['course','userProgress','system'];
  public completed = false;
  serviveObj: ServiceObj;
  userprogressData;
  public completedData: Array<any> = [];
  public progressData: Array<any> = [];
  filtersub = 'Course';
  filterMain = 0;
  collection = 'collection';
  color = 'primary';
  mode = 'determinate';
  value = 55;
  course = false;
  getUserlearning = true;
  certificateImage;
  error = false;
  loader: any;
  close=false;
  resource=false;
  page = {
    p1: 0,
    p2: 0
  };
  progressData1 = [
    {status: false, data: []}, {status: false, data: []}, {status: false, data: []},
  ];

  assessmentData: myAnalytics.IAssessmentResponse;

  timeSpentData: myAnalytics.ITimeSpentResponse;
  nsoData: myAnalytics.INsoDataResponse;

  lastUpdatedOn: string;
  userPointsEarned: number;
  orgWideAvgTimespent: number;
  orgWideAvgPointsEarned: number;
  orgWideTotalAssessment:number;
  showImage: boolean;
  private defaultSideNavBarOpenedSubscription;

  
  sideNavBarOpened = true;
  goalCount: number;
  playlistCount: number;
 
  assessmentComplete:number= 0;
  goalsSharedToMeCount: number;
  
  public calendarData = [['Date', 'Time Spent']];
  cardDetails = new TileData();
 
  serachCount;
  likes;
  catelogueCount;
  
  currentTab = '';
  tabs = [
    'myLearning',
    'myAssessment',
    // 'nsoProgress',
    'myPlans',
    // 'myCollaborators',
    // 'topCourses'
    // 'skillquotient',
    // 'orgAnalytics'
  ];
 
  email: string;
  name: string;
  endDate;
  startDate: string;
  eventText: string;
  emailId: string;
  constructor(
    private activated: ActivatedRoute,
    private analyticsDataSer: AnalyticsServiceService,
    private miscApi: MiscApiService,
    public matSnackBar: MatSnackBar) { }

  ngOnInit() {
    this.callAPI();
    this.getFilteredCourse(0);
  }
  closeCard(){
    this.close=true;
  }
  callAPI() {
    this .loader = false;
    this .serviveObj = {
      type: 'timespent',
      contentType: 'Course',
      endDate:'2019-06-30',
      startDate:'2018-04-01',
      isCompleted: 0
    };
    this .analyticsDataSer
      .getData(this .serviveObj)
      .pipe(retry(3))
      .subscribe(
        data => {
          this .currentTab = 'myLearning';
          this .timeSpentData = data;
          this .lastUpdatedOn = this .timeSpentData.last_updated_on.toString().split('T')[0];
          const orgAverage = this .timeSpentData.timespent_user_vs_org_wide;
          this .orgWideAvgTimespent = Math.ceil(orgAverage.usage_percent);
          this .userPointsEarned = this .timeSpentData.points_and_ranks.user_points_earned;
          this .orgWideAvgPointsEarned = this .timeSpentData.points_and_ranks.points_user_vs_org_wide.points_percent;
          this .cardDetails.badges = this .timeSpentData['badges_details.length'];
          this .cardDetails.learningMin = Math.round(this .timeSpentData.time_spent_by_user / 60);
          this .cardDetails.learningPoints = this .timeSpentData.points_and_ranks.user_points_earned;
          this .loader = true;
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
  filterApply(filter: any, type?: string) {
    // debugger;
    if (type === 'sub') {
      this.filtersub = filter;
    } else {
      this.filterMain = filter;
    }
    // console.log(this.filterMain,this.filtersub);
    // this.getFilteredCourse();
  }
  onTabChange(selectedIndex: number) {
    // if (!this.progressData1[selectedIndex].status ) {
      this.getFilteredCourse(selectedIndex);
      
    // } else {
    //   this.progressData1[selectedIndex].status = false;
    //   this.loader = setInterval( () => {
    //     this.progressData1[selectedIndex].status = true;
    //     }, 500);
    //   return;
    // }

  }
  openSnackBar() {
    this .matSnackBar.open('Some Error Occurred', 'close', {
      duration: 3000
    });
  }
    getFilteredCourse(index: number) {
    this.getUserlearning = true;
    const serviceObj = {
      type: 'userprogress',
      contentType: (index === 0 ? 'Course' : (index === 1) ? 'Learning Path' : 'Resource'),
      endDate:'2019-06-30',
      startDate:'2018-04-01',
      isCompleted: 0
    };
    this.progressData1[index].status = false;
    this.analyticsDataSer.getData(serviceObj)
      .subscribe(
      (response) => {
        this.progressData = [];
        this.courseData=[];
        this.myProgress = response.learning_history;
        this.myProgress.map(course=>{
          this.courseObj={
            course:course.content_name,
            userProgress:course.progress,
            system:course.system
          }
          this.courseData.push(this.courseObj);
        });
        this.othersProgress = response.learning_history_progress_range;
        this.myProgress.map( (cur: any, i) => {
          const others = this.othersProgress[cur.lex_id] ;
          if (others.length === 5) {
            const obj = {
              name: cur.content_name,
              id: cur.lex_id,
              progress: cur.progress,
              completed: others['4'].doc_count || 0,
              system:cur.system,
              legend: (i === 0) ? true : false,
              data: [
                {
                  key: '0-25%',
                  y: others['0'].doc_count || 0,
                  // color:'rgb(235, 77, 75)'
                  color: 'rgb(179, 55, 113)'
                },
                {
                    key: '25-50%',
                    y: others['1'].doc_count || 0,
                    color: 'rgb(250, 130, 49)'
                },
                {
                    key: '50-75%',
                    y: others['2'].doc_count || 0,
                    color: 'rgb(247, 183, 49)'
                },
                {
                    key: '75-100%',
                    y: others['3'].doc_count + others['4'].doc_count || 0,
                    color: 'rgb(106, 176, 76)'
                },
              ]
            };
            this.progressData.push(obj);
            // if(i)
          }
        });
        this.progressData1[index].data = this.progressData;
        this.progressData1[index].status = true;
        // this.loader = setInterval( () => {
        //   this.getUserlearning = false;
        // }, 2000);
        // console.log(this.myProgress)
      },
        (error) => {
          this.error = true;
          this.loader = true;
        }
        // this.router.navigate(['error'])
      );
  }

  changePage(event: PageEvent, num: number) {
    if (num === 1) {
      this.page.p1 = event.pageIndex * 10;
    } else if (num === 2) {
      this.page.p2 = event.pageIndex * 10;
    }
  }
  ngOnDestroy() {
    clearInterval(this.loader);
  }
  chartData() {
    this .assessmentComplete = 0;
    this .goalCount = this .userprogressData.goal_progress.length;
    this.goalData=this .userprogressData.goal_progress;
    this .playlistCount = this .userprogressData.playlist_progress.length;
    this.playListData=this .userprogressData.playlist_progress;
    this .myProgress = this .userprogressData.learning_history;
    this.othersProgress=this.userprogressData.learning_history_progress_range;
    this .goalsSharedToMeCount = this .userprogressData.goal_shared_to_me.length;
    this .assessmentData.assessment.map((cur: any) => {
      if (cur.assessment_score >= 60) {
        this .assessmentComplete += 1;
      }
    });

    this.certificationList=this.assessmentData.certification_list;
    this.badgesDetails=this.timeSpentData.badges_details;
    this.badgesDetails.forEach((cur: any) => {
      cur.image = '';
      if (cur.badge_type === 'C' || cur.badge_name === 'Course Completion') {
        cur.image = '/content/Achievements/Badges/Certificate.png?type=assets';
      } else if (cur.badge_name !== 'The Fledgling') {
        cur.image = `/content/Achievements/Badges/${cur.badge_name}.png?type=assets`;
      } else {
        cur.image = `/content/Achievements/Badges/Fledgling.png?type=assets`;
      }
    });
    // this.analyticsDataSer.getData(this.serviveObj)
    //   .subscribe(data2 => {
    //     this.serviveObj.type = 'userprogress';
    //     this.userprogressData = data2;
    //   });

    this.certificateImage = '/content/Achievements/Badges/Certificate.png?type=assets';
    this .orgWideTotalAssessment=this.assessmentData.user_assessment_count_vs_org_wide;
    this .assessmentComplete = Math.abs(this .myProgress.length - this .assessmentComplete);
    this .cardDetails.artifactSharedByMe = this .nsoData.artifacts_shared.length;
    this .cardDetails.certificates = this .assessmentData.certifications_count;
    this .cardDetails.expertsContacted = this .nsoData.experts_contacted.length;
    this .cardDetails.goals = this .userprogressData.goal_progress.length;
    this .cardDetails.goalsSharedByMe = this .userprogressData.goal_shared_by_me.length;
    this .cardDetails.goalsSharedToMe = this .userprogressData.goal_shared_to_me.length;
    this.goalsSharedWithMe=this.cardDetails.goalsSharedToMe;
    this .cardDetails.infyTV = this .nsoData.feature_usage_stats.tv_count;
    this .cardDetails.likes = this .nsoData.likes_detail.length;
    this .cardDetails.navigator = this .nsoData.feature_usage_stats.navigator_count;
    this .cardDetails.nsoProgram = this .nsoData.total_nso_program_taken;
    this .cardDetails.pendingAssessments = this .assessmentComplete;
    this .cardDetails.playGround = this .nsoData.playground_details.length;
    this .cardDetails.playlist = this .userprogressData.playlist_progress.length;
    this .cardDetails.search = this .nsoData.feature_usage_stats.search_count;
    this .cardDetails.totalAssessments = this .assessmentData.assessment.length;
    this .cardDetails.infyRadio = this .nsoData.feature_usage_stats.radio_count;
    this .cardDetails.infyLive = this .nsoData.feature_usage_stats.live_count;
    this .loader = true;
    this .loader2 = false;
  }
}
