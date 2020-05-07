/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {AnalyticsServiceService} from '../../services/analytics-service.service';
import { MiscApiService } from '../../../../apis/misc-api.service';
import { PageEvent } from '@angular/material';
import {TileData, ServiceObj} from '../../../../models/myAnalytics.model';
import {ConfigService} from '../../../../services/config.service';
@Component({
  selector: 'app-my-plans',
  templateUrl: './my-plans.component.html',
  styleUrls: ['./my-plans.component.scss']
})
export class MyPlansComponent implements OnInit, OnDestroy {
  isSiemensAvailable =this.configSvc.instanceConfig.features.siemens.enabled;
  @Input() loader2: boolean;
  @Input() goalData;
  @Input() myProgress;
  @Input() playListData;
  @Input() othersProgress;
  @Input() certificationList;
  @Input() badgesDetails;
  @Input() dates: any;
  @Input() goalsSharedWithMe: number;
  @Input() isResource;
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  public completed = false;
  serviveObj: ServiceObj;
  public userprogressData = [];
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
  page = {
    p1: 0,
    p2: 0
  };
  progressData1 = [
    {status: false, data: []}, {status: false, data: []}, {status: false, data: []},
  ];

  constructor(
    private activated: ActivatedRoute,
    private analyticsDataSer: AnalyticsServiceService,
    private miscApi: MiscApiService,
    private configSvc: ConfigService) { }

  ngOnInit() {

    // this.loader = setInterval( () => {
    //   this.progressData1[0].status = true;
    // }, 500);
    // for (const i in this.goalData) {
    //   if ( this.goalData[i].goal_end_date === 'None') {
    //     this.goalData[i].goal_end_date = 'None';
    //   } else {
    //     this.goalData[i].goal_end_date = new Date(this.goalData[i].goal_end_date);
    //   }
    // }
    // for (const i in this.playListData) {
    //   if ( this.playListData[i].created_on === 'None') {
    //     this.playListData[i].created_on = 'None';
    //   } else {
    //     this.playListData[i].created_on = new Date(this.playListData[i].created_on);
    //   }
    // }
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

    // this.miscApi.getBadges().subscribe(data=>
    //   {
    //     console.log(data);
    //     if(data){
    //       for(const i of data.canEarn){
    //         if(i.hasOwnProperty('badge_name')){
    //           this.badgesDetails.map((cur: any) => {
    //             if(cur.badge_name === i.badge_name){
    //               // cur.image = '';
    //               cur.image = i.image;
    //             }
    //           });
    //         }
    //       }
    //     }
    //   });


    // this.myProgress.map( (cur: any, i) => {
    //   const others = this.othersProgress[cur.lex_id] ;
    //   if (others.length === 5 && cur.content_name !== null) {
    //     const obj = {
    //       name: cur.content_name,
    //       id: cur.lex_id,
    //       progress: cur.progress,
    //       completed: others['4'].doc_count || 0,
    //       legend: (i === 0) ? true : false,
    //       data: [
    //         {
    //           key: '0-25%',
    //           y: others['0'].doc_count || 0,
    //           // color:'#ffa600'
    //           color: 'rgb(179, 55, 113)'
    //         },
    //         {
    //           key: '25-50%',
    //           y: others['1'].doc_count || 0,
    //           // color:'#a05195'
    //           color: 'rgb(250, 130, 49)'
    //         },
    //         {
    //           key: '50-75%',
    //           y: others['2'].doc_count || 0,
    //           // color:'#f95d6a'
    //           color: 'rgb(247, 183, 49)'
    //         },
    //         {
    //           key: '75-100%',
    //           y: others['3'].doc_count + others['4'].doc_count || 0,
    //           // color:'#2f4b7c'
    //           color: 'rgb(106, 176, 76)'
    //         },
    //       ]
    //     };
    //     this.progressData.push(obj);

    //   }
    // });
    // this.progressData1[0].data = this.progressData;
    this.getFilteredCourse(0);
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
    if (!this.progressData1[selectedIndex].status ) {
      this.getFilteredCourse(selectedIndex);
    } else {
      this.progressData1[selectedIndex].status = false;
      this.loader = setInterval( () => {
        this.progressData1[selectedIndex].status = true;
        }, 500);
      return;
    }

  }
    getFilteredCourse(index: number) {
    this.getUserlearning = true;
    const serviceObj = {
      type: 'userprogress',
      contentType: (index === 0 ? 'Course' : (index === 1) ? 'Learning Path' : 'Resource'),
      endDate: this.dates.end,
      startDate: this.dates.start,
      isCompleted: 0
    };
    this.analyticsDataSer.getData(serviceObj)
      .subscribe(
      (response) => {
        this.progressData = [];
        this.myProgress = response.learning_history;
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

}
