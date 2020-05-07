/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, ElementRef, Input, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Chart } from 'chart.js';
import { interval } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import * as analytics from '../../../../models/analytics.model';
import { FetchStatus } from '../../../../models/status.model';
import { ConfigService } from '../../../../services/config.service';
import { AnalyticsService } from '../../services/analytics.service';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {
  @Input()
  contentId: string;
  analyticsUrl: SafeResourceUrl;
  serviceData: analytics.IAnalyticsResponse;
  id: string;
  barChartUnitLabel: Array<string>;
  barChartPULabel: Array<string>;
  barChartJLLabel: Array<string>;
  barChartLocationLabel: Array<string>;
  barChartAccountLabel: Array<string>;
  barChartUnitData: Array<any>;
  barChartPUData: Array<any>;
  barChartJLData: Array<any>;
  barChartLocationData: Array<any>;
  barChartAccountData: Array<any>;
  offshoreData: Array<number>;
  onsiteData: Array<number>;
  scheduleFetchStatus: FetchStatus = 'fetching';
  pieChartLabel: Array<string>;
  pieChartData: Array<number>;
  filter: Array<any> = [];
  serviceObj = {
    contentId: '',
    refiner: '',
  }
  removable: boolean = true;
  refinerName: string = '';
  filterName: string = '';
  uniqueUserCount: number;
  @ViewChild('chartContainer', { static: true }) chartContainer: ElementRef<HTMLDivElement>;
  listOfIds = ['UnitChart', 'PUChart', 'JLChart', 'LocationChart', 'AccountChart'];
  refiner = ['participants.ibu', 'participants.pu', 'participants.jl', 'participants.location', 'participants.account']
  listOfBarChartLabel: Array<any> = [];
  listOfBarChartData: Array<any> = [];
  constructor(private sanitizer: DomSanitizer, private configSvc: ConfigService, private analytics: AnalyticsService) { }
  @ViewChild('courseAnalytics', { static: true })
  analyticsRef: ElementRef;
  contentHeight$ = interval(1000).pipe(
    map(() => {
      if (
        this.analyticsRef &&
        this.analyticsRef.nativeElement &&
        this.analyticsRef.nativeElement.contentWindow &&
        this.analyticsRef.nativeElement.contentWindow.document &&
        this.analyticsRef.nativeElement.contentWindow.document.body
      ) {
        const body = this.analyticsRef.nativeElement.contentWindow.document.body;
        return body.scrollHeight;
      }
      return 300;
    }),
    distinctUntilChanged()
  );
  ngOnInit() {
    this.analyticsUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `${this.configSvc.instanceConfig.externalLinks.courseAnalytics}/${this.contentId}`
    );
    this.serviceObj = {
      contentId: this.contentId,
      refiner: '',
    }
    this.callApi(this.serviceObj);
  }
  // ngAfterViewInit(){
  //   setTimeout(() => {
  //     this.initPieGraph();
  //   },3000);
  // }
  callApi(serviceObj) {
    this.scheduleFetchStatus = 'fetching';
    this.listOfBarChartLabel = [];
    this.listOfBarChartData = [];
    this.analytics.getServer(serviceObj).subscribe(serverResponse => {
      this.serviceData = serverResponse;
      this.chartData();
      
      this.scheduleFetchStatus = 'done';

      setTimeout(() => {
        this.initPieGraph();
        for (var i = 0; i < 5; i++) {
          this.initBarGraph(this.listOfIds[i], this.listOfBarChartLabel[i], this.listOfBarChartData[i], this.refiner[i]);
        }
      }, 1000)

    },
      err => {
        this.scheduleFetchStatus = 'error';

      });
  }

  initPieGraph() {
    const canvas = document.createElement('canvas');
    canvas.id = 'userStatChartId';
    // alert(this.pieId)
    // console.log(this.chartContainer.nativeElement)
    const pieChartContainer = document.getElementById('onsiteOffshoreChart');
    pieChartContainer.appendChild(canvas);
    const pieChart = new Chart('userStatChartId', {
      type: 'pie',

      data: {
        labels: this.pieChartLabel,
        datasets: [
          {
            fill: true,
            backgroundColor: ['rgb(63, 81, 181)', 'rgb(252, 167, 93)'],
            data: this.pieChartData,
            borderWidth: [2, 2]
          }
        ]
      },

      options: {
        maintainAspectRatio: false,
        legend: {
          display: true,
          position: 'top',
          fullWidth: true
        },
        rotation: -0.7 * Math.PI,
        // 'onClick': function (evt, item: any) {
        //   this.refinerName = `'participants.onsiteOffshoreIndicator'` + `:['${item[0]._view.label}']`;
        //   console.log(this.refinerName);
        //   this.serviceObj = {
        //     contentId: this.contentId,
        //     refiner: this.refinerName
        //   }
        //   this.filterName=`${item[0]._view.label}`;
        //   this.filter.push(this.filterName);
        //   this.callApi(this.serviceObj);
        // }.bind(this),
      }
    });
  }

  initBarGraph(id, barChartLabel, barChartData, refiner) {
    const canvas = document.createElement('canvas');
    canvas.id = id + 1;
    const horizontalBarChartContainer = <HTMLElement>document.getElementById(id);
    horizontalBarChartContainer.appendChild(canvas);
    const horizontalBarChart = new Chart(canvas.id, {
      type: 'horizontalBar',
      data: {
        labels: barChartLabel,
        datasets: barChartData
      },
      options: {
        maintainAspectRatio: false,

        scales: {
          xAxes: [{
            ticks: {
              display: false,
            },
            scaleLabel: {
              display: false
            },
            gridLines: {
              drawBorder: true,
              display: false
            },
            stacked: true,

          }],
          yAxes: [{
            gridLines: {
              drawBorder: true,
              display: false
            },
            ticks: {
              fontFamily: "'Open Sans Bold', sans-serif",
              fontSize: 11
            },
            stacked: true
          }]
        },
        legend: {
          display: true,
          position: "top",
          labels: {
            fontColor: "#333",
            fontSize: 12
          },
        },
        // 'onClick': function (evt, item: any) {
        //   this.refinerName = `'${refiner}'` + `:['${item[0]._view.label}']`;
        //   console.log(this.refinerName);
        //   this.serviceObj = {
        //     contentId: this.contentId,
        //     refiner: this.refinerName
        //   }
        //   this.filterName=`${item[0]._view.label}`;
        //   this.filter.push(this.filterName);
        //   console.log(this.filter);
        //   this.callApi(this.serviceObj);
        // }.bind(this),
        elements: {
          rectangle: {
            borderSkipped: 'left',
          }
        }
      }
    });
  }
  remove(refiner: string): void {
    const index = this.filter.indexOf(refiner);

    if (index >= 0) {
      this.filter.splice(index, 1);
    }
    this.serviceObj = {
      contentId: this.contentId,
      refiner: ''
    }
    this.callApi(this.serviceObj);
  }
  chartData() {

    //unique user count
    this.serviceData.uniqueParticipants.forEach(count => {
      this.uniqueUserCount = count.uniqueCount;
    });

    // Onsite-Offshore PieChart Data
    this.pieChartData = [];
    this.pieChartLabel = [];
    this.serviceData.participants.onsiteOffshoreIndicator.forEach(pie => {
      if (pie.key != 'NA') {
        this.pieChartData.push(pie.count);
        this.pieChartLabel.push(pie.key);
      }
    });


    // Participants by Unit BarChart Data
    this.barChartUnitLabel = [];
    this.barChartUnitData = [];
    this.offshoreData = [];
    this.onsiteData = [];
    this.serviceData.participants.ibu.forEach(unit => {
      if (this.barChartUnitLabel.length < 20) {
        this.barChartUnitLabel.push(unit.key);
      }
      unit.value.forEach(val => {
        if (val.key.toLowerCase() === "offshore") {
          this.offshoreData.push(val.value);
        }
        if (val.key.toLowerCase() === "onsite") {
          this.onsiteData.push(val.value);
        }
      });
    });
    this.barChartUnitData = [{
      label: 'Offshore',
      backgroundColor: 'rgb(63, 81, 181)',
      data: this.offshoreData
    },
    {
      label: 'Onsite',
      backgroundColor: 'rgb(252, 167, 93)',
      data: this.onsiteData
    }]
    this.listOfBarChartLabel.push(this.barChartUnitLabel);
    this.listOfBarChartData.push(this.barChartUnitData);


    // Participants by PU BarChart Data
    this.barChartPULabel = [];
    this.barChartPUData = [];
    this.offshoreData = [];
    this.onsiteData = [];
    this.serviceData.participants.pu.forEach(pu => {
      if (this.barChartPULabel.length < 20) {
        this.barChartPULabel.push(pu.key);
      }
      pu.value.forEach(val => {
        if (val.key.toLowerCase() === "offshore") {
          this.offshoreData.push(val.value);
        }
        if (val.key.toLowerCase() === "onsite") {
          this.onsiteData.push(val.value);
        }
      });
    });
    this.barChartPUData = [{
      label: 'Offshore',
      backgroundColor: 'rgb(63, 81, 181)',
      data: this.offshoreData
    },
    {
      label: 'Onsite',
      backgroundColor: 'rgb(252, 167, 93)',
      data: this.onsiteData
    }]
    this.listOfBarChartLabel.push(this.barChartPULabel);
    this.listOfBarChartData.push(this.barChartPUData);


    // Participants by JL BarChart Data
    this.barChartJLLabel = [];
    this.barChartJLData = [];
    this.offshoreData = [];
    this.onsiteData = [];
    this.serviceData.participants.jl.forEach(jl => {
      if (this.barChartJLLabel.length < 20) {
        this.barChartJLLabel.push(jl.key);
      }
      jl.value.forEach(val => {
        if (val.key.toLowerCase() === "offshore") {
          this.offshoreData.push(val.value);
        }
        if (val.key.toLowerCase() === "onsite") {
          this.onsiteData.push(val.value);
        }
      });
    });
    this.barChartJLData = [{
      label: 'Offshore',
      backgroundColor: 'rgb(63, 81, 181)',
      data: this.offshoreData
    },
    {
      label: 'Onsite',
      backgroundColor: 'rgb(252, 167, 93)',
      data: this.onsiteData
    }]
    this.listOfBarChartLabel.push(this.barChartJLLabel);
    this.listOfBarChartData.push(this.barChartJLData);


    // Participants by Location BarChart Data
    this.barChartLocationLabel = [];
    this.barChartLocationData = [];
    this.offshoreData = [];
    this.onsiteData = [];
    this.serviceData.participants.location.forEach(location => {
      if (this.barChartLocationLabel.length < 20) {
        this.barChartLocationLabel.push(location.key);
      }
      location.value.forEach(val => {
        if (val.key.toLowerCase() === "offshore") {
          this.offshoreData.push(val.value);
        }
        if (val.key.toLowerCase() === "onsite") {
          this.onsiteData.push(val.value);
        }
      });
    });
    this.barChartLocationData = [{
      label: 'Offshore',
      backgroundColor: 'rgb(63, 81, 181)',
      data: this.offshoreData
    },
    {
      label: 'Onsite',
      backgroundColor: 'rgb(252, 167, 93)',
      data: this.onsiteData
    }]
    this.listOfBarChartLabel.push(this.barChartLocationLabel);
    this.listOfBarChartData.push(this.barChartLocationData);


    // Participants by Account BarChart Data
    this.barChartAccountLabel = [];
    this.barChartAccountData = [];
    this.offshoreData = [];
    this.onsiteData = [];
    this.serviceData.participants.account.forEach(account => {
      if (this.barChartAccountLabel.length < 20) {
        this.barChartAccountLabel.push(account.key);
      }
      account.value.forEach(val => {
        if (val.key.toLowerCase() === "offshore") {
          this.offshoreData.push(val.value);
        }
        if (val.key.toLowerCase() === "onsite") {
          this.onsiteData.push(val.value);
        }
      });
    });
    this.barChartAccountData = [{
      label: 'Offshore',
      backgroundColor: 'rgb(63, 81, 181)',
      data: this.offshoreData
    },
    {
      label: 'Onsite',
      backgroundColor: 'rgb(252, 167, 93)',
      data: this.onsiteData
    }]
    this.listOfBarChartLabel.push(this.barChartAccountLabel);
    this.listOfBarChartData.push(this.barChartAccountData);

  }
}


