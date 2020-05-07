/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input, AfterViewChecked } from '@angular/core';
import { Chart } from 'chart.js';
import { isInside } from 'angular-calendar/modules/common/util';

@Component({
  selector: 'app-horizontal-bar-chart',
  templateUrl: './horizontal-bar-chart.component.html',
  styleUrls: ['./horizontal-bar-chart.component.scss']
})
export class HorizontalBarChartComponent implements OnInit, AfterViewChecked {
  @Input() barChartLabel;
  @Input() barChartData;
  @Input() barId: string;
  isExecuted: boolean
  constructor() { }

  ngOnInit() {
  }
  ngAfterViewChecked() {
    if (document.getElementById(this.barId) && !this.isExecuted) {
      this.initBarGraph();
    }
  }

  initBarGraph() {
    this.isExecuted = true
    const canvas = document.createElement('canvas');
    canvas.id = this.barId + '1';
    const horizontalBarChartContainer = <HTMLElement>document.getElementById(this.barId);
    horizontalBarChartContainer.appendChild(canvas);
    const horizontalBarChart = new Chart(canvas.id, {
      type: 'horizontalBar',
      data: {
        labels: this.barChartLabel,
        datasets: this.barChartData
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
}
