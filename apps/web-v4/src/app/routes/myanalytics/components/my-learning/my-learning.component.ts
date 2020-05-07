/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input } from '@angular/core';
import { AnalyticsServiceService } from '../../services/analytics-service.service';
import {ConfigService} from '../../../../services/config.service';
@ Component({
  selector: 'app-my-learning',
  templateUrl: './my-learning.component.html',
  styleUrls: ['./my-learning.component.scss']
})
export class MyLearningComponent implements OnInit {
  isSiemensAvailable =this.configSvc.instanceConfig.features.siemens.enabled;
  @ Input() timeSpent;
  @ Input() startDate;
  @ Input() endDate;
  @ Input() count: number;
  @ Input() mediumSize: boolean;
  isPieChart = false;
  isCalenderChart = false;
  timeSpentData: Array< object> = [];
  time_spent_by_user;
  org_wide_avg_time_spent;
  user_points_earned;
  org_wide_avg_points_earned;
  total_badges_earned;
  date_wise;
  radarCategoryLabels = [];
  radarCategoryData = [];
  radarData = [];
  categoryWiseData = [];
  track_wise_data = [];
  org_wide_category_wise_data = [];
  bubbleData = [];
  bubbleChartLabels = [];
  public calendarGraphData = [];
  public pieChartData = [];
  public pieChartDataCategory = [['Category', 'value']];
  public pieChartDataUnit = [['Category', 'value']];
  public pieChartDataJL = [['Category', 'value']];
  public unitWiseData;
  public pieChartLabel = [];
  public pieUnitData = [];
  public pieUnitLabel = [];
  public pieJlData = [];
  public pieJlLabel = [];
  public jlWiseData;
  loader = false;
  public calendarData = [['Date', 'Time Spent']];
  public bubbleChartData = [['Month', 'Month No', '#Courses', 'Topic', 'TimeSpent(mins)']];
  constructor(private analyticsDataSer: AnalyticsServiceService, private configSvc: ConfigService) { }

  ngOnInit() {
    // this.analyticsDataSer.getData('timespent').subscribe(
    //   data=>{

    this.timeSpentData = this.timeSpent;
    this.time_spent_by_user = this.timeSpentData['time_spent_by_user'];
    const orgAverage = this .timeSpentData['timespent_user_vs_org_wide'];
    this.org_wide_avg_time_spent = Math.ceil(orgAverage['usage_percent']);
    const points_and_ranks = this.timeSpentData['points_and_ranks'];
    this .user_points_earned = points_and_ranks['user_points_earned'];
    const orgPoints = points_and_ranks['points_user_vs_org_wide'];
    this .org_wide_avg_points_earned = orgPoints.points_percent;
    this .total_badges_earned = this.timeSpentData['total_badges_earned'];
    this .calendarGraphData = [];
    this .categoryWiseData = this.timeSpentData['category_wise'];
    this .unitWiseData = this.timeSpentData['unit_wise'];
    this .jlWiseData = this.timeSpentData['JL_wise'];
    this .org_wide_category_wise_data = this.timeSpentData['org_wide_category_time_spent'];
    this .track_wise_data = this.timeSpentData['track_wise_user_timespent'];
    this .calendarData = [['Date', 'Time Spent']];
    this .date_wise = this.timeSpentData['date_wise'];

    this .radarChart();
    this .bubbleChart();
    this .pieChart();
    this .calenderChart();
    this .loader = true;
    //   }

    // );

  }

  // bubbleChart() {
  //   console.log(this.track_wise_data);

  //   for (const i of Object.keys(this.track_wise_data)) {
  //       this.track_wise_data[i].map(data => {
  //         this.bubbleChartLabels.push(data.month_year);
  //         this.bubbleData.push({
  //           x: data.month_year,
  //           y: data.number_of_content_accessed,
  //           // r: this.getRadius(r.timespent_in_mins).toFixed(0),
  //           r: (data.timespent_in_mins / 10) < 5 ? 5 :
  //             ((data.timespent_in_mins / 10) > 5 && data.timespent_in_mins / 10 <= 20) ?
  //               data.timespent_in_mins / 10 : 20,
  //           actual: data.timespent_in_mins,
  //           text: data.track
  //         });

  //       }
  //       );
  //     console.log(this.bubbleChartLabels);
  //   }
  // }

  bubbleChart() {
    const keys = Object.keys(this .track_wise_data);
    keys.map(k => {
      const month = k.split('_')[0];
    });
    const month_kv = { 'Jan': 13, 'Feb': 14, 'Mar': 15, 'Apr': 4, 'May': 5, 'Jun': 6,
     'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12 };
    keys.map((k, count) => {
      this .track_wise_data[k].sort((a, b) => {
        return a.timespent_in_mins > b.timespent_in_mins ? -1 : 1;
      });
      this .track_wise_data[k].map((r, i) => {
        if (i < 3) {
          // this.bubbleChartData.push([
          //   ' ',
          //   month_kv[k.split('_')[0]] + (.2 * i),
          //   r.number_of_content_accessed,
          //   r.track, r.timespent_in_mins
          // ]);
          this .bubbleData.push({
            x: month_kv[k.split('_')[0]] + (.2 * i),
            y: r.number_of_content_accessed,
            // r: this.getRadius(r.timespent_in_mins).toFixed(0),
            r: ((r.timespent_in_mins / 10 ) <= 3) ? 3 :
               ((r.timespent_in_mins / 10) > 3 && r.timespent_in_mins / 10 <= 30) ?
                 r.timespent_in_mins / 10 : 30 ,
            actual: r.timespent_in_mins,
            text: r.track
          });

        }
      });
    });
  }
  getRadius(value: number) {
    try {
      let radius = 0;
      if (value > 200 && value < 500) {
        radius = value / 10;
      } else if (value > 100 && value <= 200) {
        radius = value / 5;
      } else if (value <= 100 && value > 50) {
        radius = value / 2.5;
      } else if (value > 10 && value <= 50) {
        radius = value / 2.5;
      } else if (value / 10 < 1) {
        radius = 3;
      } else if (value > 500) {
        radius = 30;
      } else {
        radius = 3;
      }
      // if (value / 10 < 1 && value / 10 <= 3) {
      //   return 3;
      // } else if (value / 10 > 30) {
      //   return 20;
      // } else if (value / 10 > 3 && value / 10 < 30) {
      //   return value / 10 ;
      // }
      return radius;
    } catch (e) {
      console.error(e);
    }
  }

  radarChart() {

    this .radarCategoryLabels = [];
    this .radarData = [];

    for (const i of this .categoryWiseData) {
      this .radarCategoryLabels.push(i.key);
      this .radarCategoryData.push(Number((i.value / 60).toFixed(2)));
    }
    this .radarData.push({ data: this .radarCategoryData, label: 'You' });
    this .radarCategoryData = [];
    for (const i of this .org_wide_category_wise_data || []) {
      this .radarCategoryData.push(Number((i.value / 60).toFixed(2)));
    }
    this .radarData.push({ data: this .radarCategoryData, label: 'Org-Wide' });
  }
  calenderChart() {

    if (this .date_wise) {
      let calendar_point = [];
      let calendar_graph_point = [];
      this .date_wise.forEach(element => {

        calendar_point.push(element.key);
        calendar_graph_point.push(new Date(element.key));
        calendar_point.push(((element.value) / 60).toFixed(1));
        calendar_graph_point.push(Math.round(parseFloat(((element.value) / 60).toFixed(1).valueOf()) * 100) / 100);

        this .calendarGraphData.push(calendar_point);
        this .calendarData.push(calendar_graph_point);

        calendar_point = [];
        calendar_graph_point = [];
      });
      this .isCalenderChart = true;
    }
  }

  pieChart() {

    this .pieChartDataCategory = [this .pieChartDataCategory[0]];
    for (const i of this .categoryWiseData) {
      if ((i.key === 'Technology' || i.key === 'Process' || i.key === 'Domain') && i.value > 0 ) {
        // const arr = [];
        // arr.push(i.key);
        // arr.push(i.value);
        // this.pieChartDataCategory.push(arr);
        this .pieChartData.push(i.value);
        this .pieChartLabel.push(i.key);
      }
    }
    // this.categoryWiseData.map((cur:any) => {
    //   if(cur.key === 'Technology' || cur.key === 'Process' || cur.key === 'Domain'){
    //     this.pieChartData.push(cur.value);
    //     this.pieChartLabel.push(cur.key);
    //   }
    // })

    this .pieChartDataUnit = [this .pieChartDataUnit[0]];
    for (const i of this .unitWiseData) {
      if (i.key === 'Technology' || i.key === 'Process' || i.key === 'Domain') {
        // const arr = [];
        // arr.push(i.key);
        // arr.push(i.value);
        // this.pieChartDataUnit.push(arr);
        this .pieUnitData.push(i.value);
        this .pieUnitLabel.push(i.key);
      }
    }
    this .pieChartDataJL = [this .pieChartDataJL[0]];
    for (const i of this .jlWiseData) {
      if (i.key === 'Technology' || i.key === 'Process' || i.key === 'Domain') {
        // let arr = [];
        // arr.push(i.key);
        // arr.push(i.value);
        // this.pieChartDataJL.push(arr);
        this .pieJlData.push(i.value);
        this .pieJlLabel.push(i.key);
      }
    }
    this .isPieChart = true;
  }
}
