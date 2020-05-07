/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ClientAnalyticsService } from '../../services/client-analytics.service';
import { ConfigService } from '../../../../services/config.service';
import { FetchStatus } from '../../../../models/status.model';
import { Globals } from '../../utils/globals';
import { ValuesService } from '../../../../services/values.service';
import { map, retry } from 'rxjs/operators';
export interface PeriodicElement {
  title: string;
  userCount: number;
}

const ELEMENT_DATA: PeriodicElement[] = [{ title: 'Angular', userCount: 6 }];
@Component({
  selector: 'app-client-analytics',
  templateUrl: './client-analytics.component.html',
  styleUrls: ['./client-analytics.component.scss']
})
export class ClientAnalyticsComponent implements OnInit, OnChanges {
  timeSpentData: Array<any>;
  data;
  tableData = {
    title: '',
    userCount: 0
  };
  dailyDate;
  weeklyDate;
  activeUsers: Array<any>;
  @Input() filterData;
  public localStorage: string;
  dict = new Map();
  public selectedDate;
  moduleUsers = [];
  courseUsers = [];
  resourceUsers = [];
  displayedColumns: string[] = ['title', 'userCount'];
  dataSource;
  skillData = [];
  skillLabel = [];
  regionData = [];
  systemData = [];
  skillsList = [];
  dailyUsersData = [];
  barValues = [];
  barElement = [];
  barGraphDailyLabels = [];
  regionChartLabel = [];
  regionChartData = [
    {
      backgroundColor: ['rgb(31, 119, 180)', 'rgb(174, 199, 232)', 'rgb(255, 127, 14)', 'rgb(255, 187, 120)', 'rgb(44, 160, 44)', 'rgb(152, 223, 138)', 'rgb(214, 39, 40)', 'rgb(255, 152, 150)', 'rgb(148, 103, 189)', 'rgb(197, 176, 213)', 'rgb(140, 86, 75)', 'rgb(196, 156, 148)', 'rgb(227, 119, 194)', 'rgb(174, 199, 232)', 'rgb(247, 182, 210)', 'rgb(127, 127, 127)', 'rgb(199, 199, 199)', 'rgb(188, 189, 34)', 'rgb(219, 219, 141)'],
      data: [50, 80000, 22000, 30000]
    }
  ];
  colorBarChart = [];
  systemChartLabel = ['oneLMS', 'SABA', 'LEWO', 'GLP'];
  systemChartData = [
    {
      backgroundColor: ['rgb(31, 119, 180)', 'rgb(174, 199, 232)', 'rgb(255, 127, 14)', 'rgb(255, 187, 120)', 'rgb(44, 160, 44)', 'rgb(152, 223, 138)', 'rgb(214, 39, 40)', 'rgb(255, 152, 150)', 'rgb(148, 103, 189)', 'rgb(197, 176, 213)', 'rgb(140, 86, 75)', 'rgb(196, 156, 148)', 'rgb(227, 119, 194)', 'rgb(174, 199, 232)', 'rgb(247, 182, 210)', 'rgb(127, 127, 127)', 'rgb(199, 199, 199)', 'rgb(188, 189, 34)', 'rgb(219, 219, 141)'],
      data: [10000, 5000, 8000, 12000]
    }
  ];
  weeklyUsersData = [];
  monthlyUsersData = [];
  barGraphMonthlyLabels = [];
  barGraphWeeklyLabels = [];
  monthlyDate;
  isLtMedium$ = this.valueSvc.isLtMedium$;
  mode$ = this.isLtMedium$.pipe(map(isMedium => (isMedium ? 'over' : 'side')));
  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  analyticsFetchStatus: FetchStatus = 'fetching';
  constructor(
    private clientSvc: ClientAnalyticsService,
    private configSvc: ConfigService,
    private globals: Globals,
    private valueSvc: ValuesService
  ) {

    this.localStorage = sessionStorage.getItem('Array_Trend');

    if (this.localStorage == undefined || this.localStorage == null || this.localStorage.length === 2) {
      sessionStorage.setItem('Array_Trend', JSON.stringify(this.globals.filter_trend));
      this.localStorage = sessionStorage.getItem('Array_Trend');
      // this.getData();
    } else {
      this.globals.filter_trend = JSON.parse(this.localStorage);
      this.onFilteredGet();
    }

  }
  ngOnChanges() {
    if (this.filterData != undefined) {
      this.analyticsFetchStatus = 'fetching';
      this.data = this.filterData;
      this.getChartData(this.data);
    }

  }
  ngOnInit() {
    if (this.filterData != undefined) {
      this.analyticsFetchStatus = 'fetching';
      this.data = this.filterData;
      this.getChartData(this.data);
    }
  }


  public onFilteredGet() {
    this.analyticsFetchStatus = 'fetching';
    this.clientSvc.getFilteredServers(this.globals.filter_trend, this.dict, this.globals.selectedStartDate, this.globals.selectedEndDate).subscribe(
      filterRes => {
        this.data = filterRes;
        this.getChartData(this.data);
        this.analyticsFetchStatus = 'done';
      },
      err => {
        this.analyticsFetchStatus = 'error';
      }
    );
  }
  // getData() {

  //   setTimeout(() => {
  //     this.analyticsFetchStatus = 'fetching';
  //     this.clientSvc.getData().subscribe(
  //       res => {
  //         this.data = res;
  //         this.getChartData(this.data);
  //         this.analyticsFetchStatus = 'done';
  //       },
  //       err => {
  //         this.analyticsFetchStatus = 'error';
  //       }
  //     );
  //   }, 1500);
  // }
  public callFilteredGet() {
    this.onFilteredGet();
  }




  getChartData(data) {
    // line plus bar chart data
    this.barValues = [];
    this.barElement = [];
    this.activeUsers = this.filterData.active_users;
    if (this.activeUsers != undefined) {
      this.activeUsers.forEach(ele => {
        this.barElement.push(ele.key);
        this.barElement.push(ele.userCount);
        this.barValues.push(this.barElement);
        this.barElement = [];
      });
      let lineElement = [];
      const lineValues = [];
      this.activeUsers.forEach(ele => {
        lineElement.push(ele.key);
        lineElement.push(Math.round(ele.avg_time_spent / 60));
        lineValues.push(lineElement);
        lineElement = [];
      });
      this.timeSpentData = [];
      this.timeSpentData = [
        {
          key: 'Users',
          bar: true,
          color: '#2ca02c',
          values: this.barValues
        },

        {
          key: 'Avg. Time Spent In Minutes',
          color: 'darkred',
          values: lineValues
        }
      ].map(function (series: any) {
        series.values = series.values.map(function (d) {
          return { x: d[0], y: d[1] };
        });
        return series;
      });
    }

    //skillData
    this.skillLabel = [];
    this.skillData = [];
    this.skillsList = [];
    data.skill_wise_content.map(skill => {
      this.skillLabel.push(skill.key);
      this.skillsList.push(skill.doc_count);
    });
    this.skillData = [{
      backgroundColor: ['rgb(31, 119, 180)', 'rgb(174, 199, 232)', 'rgb(255, 127, 14)', 'rgb(255, 187, 120)', 'rgb(44, 160, 44)', 'rgb(152, 223, 138)', 'rgb(214, 39, 40)', 'rgb(255, 152, 150)', 'rgb(148, 103, 189)', 'rgb(197, 176, 213)', 'rgb(140, 86, 75)', 'rgb(196, 156, 148)', 'rgb(227, 119, 194)', 'rgb(174, 199, 232)', 'rgb(247, 182, 210)', 'rgb(127, 127, 127)', 'rgb(199, 199, 199)', 'rgb(188, 189, 34)', 'rgb(219, 219, 141)'],
      data: this.skillsList
    }];

    // onboarding daily users data
    this.barGraphDailyLabels = [];
    this.barValues = [];
    this.filterData.dailyNewUsers.map(ele => {
      this.dailyDate = ele.key_as_string;
      this.dailyDate = this.dailyDate.split('T')[0];
      const month = this.months[new Date(this.dailyDate).getMonth()];
      const date = this.dailyDate.split('-')[2];
      this.dailyDate = date + '-' + month;
      this.barGraphDailyLabels.push(this.dailyDate);
      this.barValues.push(ele.doc_count);
    });
    this.dailyUsersData = [
      {
        label: 'Users',
        backgroundColor: 'rgb(27, 188, 155)',
        data: this.barValues
      }
    ];
    // onboarding weekly users data
    this.barGraphWeeklyLabels = [];
    this.barValues = [];
    this.filterData.weeklyNewUsers.map(ele => {
      this.weeklyDate = ele.key_as_string;
      this.weeklyDate = this.weeklyDate.split('T')[0];
      const month = this.months[new Date(this.weeklyDate).getMonth()];
      const date = this.weeklyDate.split('-')[2];
      this.weeklyDate = date + '-' + month;
      this.barGraphWeeklyLabels.push(this.weeklyDate);
      this.barValues.push(ele.doc_count);
    });
    this.weeklyUsersData = [
      {
        label: 'Users',
        backgroundColor: 'rgb(27, 188, 155)',
        data: this.barValues
      }
    ];

    //region data
    this.regionChartLabel = [];
    this.regionChartData = [];
    this.regionData = [];
    data.country.map(element => {
      this.regionChartLabel.push(element.key);
      this.regionData.push(element.doc_count);

    })
    this.regionChartData = [
      {
        backgroundColor: ['rgb(31, 119, 180)', 'rgb(174, 199, 232)', 'rgb(255, 127, 14)', 'rgb(255, 187, 120)', 'rgb(44, 160, 44)', 'rgb(152, 223, 138)', 'rgb(214, 39, 40)', 'rgb(255, 152, 150)', 'rgb(148, 103, 189)', 'rgb(197, 176, 213)', 'rgb(140, 86, 75)', 'rgb(196, 156, 148)', 'rgb(227, 119, 194)', 'rgb(174, 199, 232)', 'rgb(247, 182, 210)', 'rgb(127, 127, 127)', 'rgb(199, 199, 199)', 'rgb(188, 189, 34)', 'rgb(219, 219, 141)'],
        data: this.regionData
      }
    ];

    //system data
    this.systemChartLabel = [];
    this.systemChartData = [];
    this.systemData = [];
    data.system.map(element => {
      this.systemChartLabel.push(element.key);
      this.systemData.push(element.doc_count);

    })
    this.systemChartData = [
      {
        backgroundColor: ['rgb(31, 119, 180)', 'rgb(174, 199, 232)', 'rgb(255, 127, 14)', 'rgb(255, 187, 120)', 'rgb(44, 160, 44)', 'rgb(152, 223, 138)', 'rgb(214, 39, 40)', 'rgb(255, 152, 150)', 'rgb(148, 103, 189)', 'rgb(197, 176, 213)', 'rgb(140, 86, 75)', 'rgb(196, 156, 148)', 'rgb(227, 119, 194)', 'rgb(174, 199, 232)', 'rgb(247, 182, 210)', 'rgb(127, 127, 127)', 'rgb(199, 199, 199)', 'rgb(188, 189, 34)', 'rgb(219, 219, 141)'],
        data: this.systemData
      }
    ];

    // onboarding montlhy users data
    this.barGraphMonthlyLabels = [];
    this.barValues = [];
    this.filterData.monthlyNewUsers.map(ele => {
      this.monthlyDate = ele.key_as_string;
      this.monthlyDate = this.monthlyDate.split('T')[0];
      this.monthlyDate = new Date(this.monthlyDate).getMonth();
      this.monthlyDate = this.months[this.monthlyDate];
      this.barGraphMonthlyLabels.push(this.monthlyDate);
      this.barValues.push(ele.doc_count);
    });
    this.monthlyUsersData = [
      {
        label: 'Users',
        backgroundColor: 'rgb(27, 188, 155)',
        data: this.barValues
      }
    ];
    this.analyticsFetchStatus = 'done';
  }
}
