/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnalyticsServiceService } from '../../services/analytics-service.service';
import { MiscApiService } from '../../../../apis/misc-api.service';
import { PageEvent } from '@angular/material';
import { TileData, ServiceObj } from '../../../../models/myAnalytics.model';
import { FetchStatus } from '../../../../models/status.model';
import { ClientAnalyticsService } from '../../services/client-analytics.service';
import { Globals } from '../../utils/globals';

@Component({
  selector: 'app-my-plans',
  templateUrl: './my-plans.component.html',
  styleUrls: ['./my-plans.component.scss']
})
export class MyPlansComponent implements OnInit {
  // progressData1 = [
  //   {status: false, data: []}, {status: false, data: []}, {status: false, data: []},
  // ];
  @Input() clientData;
  @Input() startDate;
  @Input() endDate;
  analyticsFetchStatus: FetchStatus = 'fetching';
  skillData = [];
  skillLabel = [];
  moduleUsers = [];
  courseUsers = [];
  contentList = [];
  contentData = [];
  contentLabel = [];
  myProgress = [];
  dict = new Map();
  data;
  allContent: number;
  courses: number;
  programs: number;
  resourceUsers = [];
  displayedColumns: string[] = ['title', 'userCount'];
  dataSource;
  public completed = false;
  serviveObj: ServiceObj;
  public userprogressData = [];
  othersProgress = [];
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
  selectedIndex = 0;
  skillsList=[];
  progressData1 = [{ status: false, data: [] }, { status: false, data: [] }, { status: false, data: [] }];

  constructor(
    private activated: ActivatedRoute,
    private analyticsDataSer: AnalyticsServiceService,
    private miscApi: MiscApiService,
    private clientSvc: ClientAnalyticsService,
    private globals: Globals
  ) {}

  ngOnInit() {
    // console.log(this.startDate);
    this.analyticsFetchStatus = 'fetching';
    this.getData(this.clientData);
    this.getFilteredCourse(0);
  }
  ngOnChanges() {
    this.analyticsFetchStatus = 'fetching';
    this.getData(this.clientData);
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
    // this.selectedIndex = selectedIndex;
    if (!this.progressData1[selectedIndex].status) {
      this.getFilteredCourse(selectedIndex);
    } else {
      this.progressData1[selectedIndex].status = false;
      this.loader = setInterval(() => {
        this.progressData1[selectedIndex].status = true;
      }, 500);
      return;
    }
  }
  getFilteredCourse(index: number) {
    this.getUserlearning = true;
    const serviceObj = {
      // type: 'userprogress',
      contentType: index === 0 ? 'Course' : index === 1 ? 'Learning Path' : 'Resource'
      // endDate: this.endDate,
      // startDate: this.startDate,
      // isCompleted: 0
    };
    this.clientSvc.getData(this.startDate, this.endDate, serviceObj).subscribe(
      response => {
        // this.apiData = response;
        this.progressData = [];
        this.myProgress = response.learning_history;
        this.othersProgress = response.learning_history_progress_range;
        this.myProgress.map((cur: any, i) => {
          const others = this.othersProgress[cur.lex_id];
          if (others.length === 4) {
            const obj = {
              name: cur.content_name,
              id: cur.lex_id,
              progress: cur.progress,
              completed: others['3'].doc_count || 0,
              system: cur.system,
              legend: i === 0 ? true : false,
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
                  y: others['3'].doc_count || 0,
                  color: 'rgb(106, 176, 76)'
                }
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
      error => {
        this.error = true;
        this.loader = true;
      }
      // this.router.navigate(['error'])
    );
  }
  getData(data) {
    this.allContent = data.all_content_count;
    this.courses = data.course_count;
    this.programs = data.program_count;
    // contentData
    this.contentLabel = [];
    this.contentData = [];
    this.contentList = [];
    data.system_wise_content.map(skill => {
      this.contentLabel.push(skill.key);
      this.contentList.push(skill.doc_count);
    });
    this.contentData = [
      {
        backgroundColor: [
          'rgb(31, 119, 180)',
          'rgb(174, 199, 232)',
          'rgb(255, 127, 14)',
          'rgb(255, 187, 120)',
          'rgb(44, 160, 44)'
        ],
        data: this.contentList
      }
    ];
    // courseDetails data
    this.moduleUsers = [];
    this.courseUsers = [];
    this.resourceUsers = [];
    this.courseUsers = data.courseUsers
      .filter(s => s.content_name)
      .map(m => ({ title: m.content_name, userCount: m.no_of_users }));
    this.moduleUsers = data.moduleUsers
      .filter(s => s.content_name)
      .map(m => ({ title: m.content_name, userCount: m.no_of_users }));
    this.resourceUsers = data.resourceUsers
      .filter(s => s.content_name)
      .map(m => ({ title: m.content_name, userCount: m.no_of_users }));

      //skill data
      this.skillLabel = [];
      this.skillData = [];
  this.skillsList=[];
      data.skill_wise_content.map(skill => {
        this.skillLabel.push(skill.key);
        this.skillsList.push(skill.doc_count);
      });
      this.skillData=[{
        backgroundColor: ['rgb(31, 119, 180)', 'rgb(174, 199, 232)', 'rgb(255, 127, 14)', 'rgb(255, 187, 120)', 'rgb(44, 160, 44)'],
        data: this.skillsList
      }];
    
    this.analyticsFetchStatus = 'done';
  }

  changePage(event: PageEvent, num: number) {
    if (num === 1) {
      this.page.p1 = event.pageIndex * 10;
    } else if (num === 2) {
      this.page.p2 = event.pageIndex * 10;
    }
  }
  public onFilteredGet() {
    this.analyticsFetchStatus = 'fetching';
    this.clientSvc
      .getFilteredServers(
        this.globals.filter_trend,
        this.dict,
        this.globals.selectedStartDate,
        this.globals.selectedEndDate
      )
      .subscribe(
        filterRes => {
          this.data = filterRes;
          this.getData(this.data);
          this.analyticsFetchStatus = 'done';
        },
        err => {
          this.analyticsFetchStatus = 'error';
        }
      );
  }
  public callFilteredGet() {
    this.onFilteredGet();
  }

  ngOnDestroy() {
    clearInterval(this.loader);
  }
}
