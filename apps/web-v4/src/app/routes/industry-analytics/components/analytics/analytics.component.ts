/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Chart } from 'chart.js';
import { interval } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import * as analytics from '../../../../models/analytics.model';
import { FetchStatus } from '../../../../models/status.model';
import { ConfigService } from '../../../../services/config.service';
import { AnalyticsService } from '../../services/analytics.service';
import { ActivatedRoute } from "@angular/router";
import { RoutingService } from '../../../../services/routing.service';
import { IBarChartData } from '../../../../models/industryAnalytics.model';

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
  tagName: string;
  barChartUnitLabel: Array<string>;
  barChartPULabel: Array<string>;
  barChartJLLabel: Array<string>;
  barChartLocationLabel: Array<string>;
  barChartAccountLabel: Array<string>;
  barChartDULabel: Array<string>;
  barChartUnitData: IBarChartData[];
  barChartPUData: IBarChartData[];
  barChartDUData: IBarChartData[];
  barChartJLData: IBarChartData[];
  barChartTopicData = [];
  barChartTopicLabel: Array<string>;
  barChartLocationData: IBarChartData[];
  barChartAccountData: IBarChartData[];
  offshoreData: Array<number>;
  onsiteData: Array<number>;
  scheduleFetchStatus: FetchStatus = 'fetching';
  pieChartLabel: Array<string>;
  pieChartData: Array<number>;
  serviceObj = {
    contentId: '',
    refiner: '',
  };
  isLegend: boolean;
  removable: boolean = true;
  refinerName: string = '';
  filterName: string = '';
  uniqueUserCount: number;
  @ViewChild('chartContainer', { static: false }) chartContainer: ElementRef<HTMLDivElement>;
  listOfIds = ['UnitChart', 'TopicsChart'];
  refiner = ['participants.ibu', 'refiners.topics']
  listOfBarChartLabel: Array<any> = [];
  listOfBarChartData: Array<any> = [];
  constructor(private sanitizer: DomSanitizer, private configSvc: ConfigService,
    public routingSvc: RoutingService,
    private analytics: AnalyticsService,
    private route: ActivatedRoute) {
    this.route.params.subscribe(queryParameters => {
      if (queryParameters) {
        if (queryParameters["tag"]) {
          this.tagName = queryParameters["tag"].split("-").join(" ");
          this.contentId = "IND_NAV_" + queryParameters["tag"].split("-").join("_");
        }
      }
    });
  }
  @ViewChild('courseAnalytics', { static: false })
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
        for (var i = 0; i < 2; i++) {
          this.initBarGraph(this.listOfIds[i], this.listOfBarChartLabel[i], this.listOfBarChartData[i], this.refiner[i]);
        }
      }, 50)

    },
      err => {
        this.scheduleFetchStatus = 'error';

      });
  }

  initPieGraph() {
    const canvas = document.createElement('canvas');
    canvas.id = 'userStatChartId';
    // alert(this.pieId)
    this.chartContainer.nativeElement.appendChild(canvas);
    const pieChart = new Chart('userStatChartId', {
      type: 'pie',

      data: {
        labels: this.pieChartLabel,
        datasets: [
          {
            fill: true,
            backgroundColor: ['rgb(45,152,218)', 'rgb(255, 99, 132)'],
            data: this.pieChartData,
            // Notice the borderColor
            // borderColor:	['black', 'black'],
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
        //   this.serviceObj = {
        //     contentId: this.contentId,
        //     refiner: this.refinerName
        //   }
        //   this.filterName = `${item[0]._view.label}`;
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
              fontSize: 11,
              // callback: function(value, index, values) {
              //   return value.substring(0,12);  
              // }
            },
            stacked: true
          }]
        },
        legend: {
          display: false,
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
        //   this.filterName = `${item[0]._view.label}`;
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
  // remove(refiner: string): void {
  //   const index = this.filter.indexOf(refiner);

  //   if (index >= 0) {
  //     this.filter.splice(index, 1);
  //   }
  //   this.serviceObj = {
  //     contentId: this.contentId,
  //     refiner: ''
  //   }
  //   this.callApi(this.serviceObj);
  // }
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
      backgroundColor: 'rgb(45,152,218)',
      data: this.offshoreData
    },
    {
      label: 'Onsite',
      backgroundColor: 'rgb(255, 99, 132)',
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
      if (pu.key !== 'Others' && pu.key !== 'OTHERS' && pu.key !== 'NA') {
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
      }

    });
    this.barChartPUData = [{
      label: 'Offshore',
      backgroundColor: 'rgb(45,152,218)',
      data: this.offshoreData
    },
    {
      label: 'Onsite',
      backgroundColor: 'rgb(255, 99, 132)',
      data: this.onsiteData
    }]

    //Participants by topics
    this.barChartTopicLabel = [];
    this.barChartTopicData = [];
    this.offshoreData = [];
    this.onsiteData = [];
    let data = [];
    this.serviceData.refiners.forEach(element => {
      if (Object.keys(element)[0] === 'topics') {
        if (this.serviceData.refiners[this.serviceData.refiners.indexOf(element)] !== undefined) {
          for (const i of this.serviceData.refiners[this.serviceData.refiners.indexOf(element)]['topics']) {
            if (this.barChartTopicLabel.length < 20) {
              if (i.key.startsWith('IND_NAV')) {
                this.barChartTopicLabel.push(((i.key).slice(8)).split("_").join(" "));
              }
              else {
                this.barChartTopicLabel.push(((i.key)).split("_").join(" "));
              }
            }
            if (data.length < 20) {
              data.push(i.value);
            }

          }
        }
      }
    });
    this.barChartTopicData = [{
      backgroundColor: ['rgb(219, 219, 141)', 'rgb(188, 189, 34)', 'rgb(199, 199, 199)', 'rgb(127, 127, 127)', 'rgb(247, 182, 210)', 'rgb(174, 199, 232)', 'rgb(227, 119, 194)',
        'rgb(196, 156, 148)', 'rgb(140, 86, 75)', 'rgb(197, 176, 213)', 'rgb(148, 103, 189)', 'rgb(255, 152, 150)', 'rgb(214, 39, 40)', 'rgb(152, 223, 138)',
        'rgb(44, 160, 44)', 'rgb(255, 187, 120)', 'rgb(255, 127, 14)', 'rgb(174, 199, 232)'],
      data: data
    }];
    this.listOfBarChartLabel.push(this.barChartTopicLabel);
    this.listOfBarChartData.push(this.barChartTopicData);

    // Participants by JL BarChart Data
    this.barChartJLLabel = [];
    this.barChartJLData = [];
    this.offshoreData = [];
    this.onsiteData = [];
    this.serviceData.participants.jl.forEach(jl => {
      if (jl.key !== 'UMR' && jl.key !== 'B' && jl.key !== 'C' && jl.key !== '1' && jl.key !== 'Others' && jl.key !== 'OTHERS' && jl.key !== 'NA') {
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
      }

    });
    this.barChartJLData = [{
      label: 'Offshore',
      backgroundColor: 'rgb(45,152,218)',
      data: this.offshoreData
    },
    {
      label: 'Onsite',
      backgroundColor: 'rgb(255, 99, 132)',
      data: this.onsiteData
    }]



    // Participants by Location BarChart Data
    this.barChartLocationLabel = [];
    this.barChartLocationData = [];
    this.offshoreData = [];
    this.onsiteData = [];
    this.serviceData.participants.location.forEach(location => {
      if (location.key !== 'Others' && location.key !== 'OTHERS' && location.key !== 'NA') {
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
      }

    });
    this.barChartLocationData = [{
      label: 'Offshore',
      backgroundColor: 'rgb(45,152,218)',
      data: this.offshoreData
    },
    {
      label: 'Onsite',
      backgroundColor: 'rgb(255, 99, 132)',
      data: this.onsiteData
    }]

    // Participants by DU BarChart Data
    this.barChartDULabel = [];
    this.barChartDUData = [];
    this.offshoreData = [];
    this.onsiteData = [];
    this.serviceData.participants.du.forEach(du => {
      if (du.key !== 'Others' && du.key !== 'OTHERS' && du.key !== 'NA') {
        if (this.barChartDULabel.length < 20) {
          this.barChartDULabel.push(du.key);
        }
        du.value.forEach(val => {
          if (val.key.toLowerCase() === "offshore") {
            this.offshoreData.push(val.value);
          }
          if (val.key.toLowerCase() === "onsite") {
            this.onsiteData.push(val.value);
          }
        });
      }

    });
    this.barChartDUData = [{
      label: 'Offshore',
      backgroundColor: 'rgb(45,152,218)',
      data: this.offshoreData
    },
    {
      label: 'Onsite',
      backgroundColor: 'rgb(255, 99, 132)',
      data: this.onsiteData
    }]



    // Participants by Account BarChart Data
    this.barChartAccountLabel = [];
    this.barChartAccountData = [];
    this.offshoreData = [];
    this.onsiteData = [];
    this.serviceData.participants.account.forEach(account => {
      if (account.key !== 'INFSYS' && account.key !== 'INFOSYS' && account.key !== 'INFY' && account.key !== 'INFYMC' && account.key !== 'PROGEON' && account.key !== 'Infosys' && account.key !== 'Others' && account.key !== 'OTHERS' && account.key !== 'NA') {
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
      }
    });
    this.barChartAccountData = [{
      label: 'Offshore',
      backgroundColor: 'rgb(45,152,218)',
      data: this.offshoreData
    },
    {
      label: 'Onsite',
      backgroundColor: 'rgb(255, 99, 132)',
      data: this.onsiteData
    }]
  }

}


