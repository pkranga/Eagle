/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input, AfterViewChecked,Output, EventEmitter } from '@angular/core';
import { Chart } from 'chart.js';
import{Globals} from "../../utils/globals";
import { SubmissionRoutingModule } from '../../../submission/submission-routing.module';
@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit {
  @Input() barChartLabel;
  @Input() barChartData;
  @Output() filterEvent = new EventEmitter<string>();
  @Input() barId: string;
  @Input() xAxisLabels: string;
  @Input() yAxisLabels: string;
  @Input() type:string;
  isExecuted: boolean;
  // skill=['Negotiation skills','PD_Gas Chromatograph','PD Integration Analytics','PD_Process Analytics']
  // system = ['1LMS', 'SABA', 'LEWO', 'GLP'];
  // country=['USA','CHINA','GERMANY','INDIA','POLAND']
  constructor(private globals:Globals) { }

  ngOnInit() { }
  ngAfterViewChecked() {
    if (document.getElementById(this.barId) && !this.isExecuted) {
      this.initBarGraph();
    }
  }
  initBarGraph() {
    this.isExecuted = true;
    const canvas = document.createElement('canvas');
    canvas.id = this.barId + '1';
    const horizontalBarChartContainer = document.getElementById(this.barId) as HTMLElement;
    horizontalBarChartContainer.appendChild(canvas);
    const horizontalBarChart = new Chart(canvas.id, {
      type: 'bar',
      data: {
        labels: this.barChartLabel,
        datasets: this.barChartData
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        legend: {
          display: false
        },
        'onClick': function (evt, item: any) {
          let filter = item[0]._view.label;

             if (this.globals.filter_trend.find(x => x === `"` + this.type+ `"` + ':' + `"` + filter + `"`) === undefined) {
               this.globals.filter_trend.push(`"` + this.type + `"` + ':' + `"` + filter + `"`);
             }
             sessionStorage.setItem('Array_Trend', JSON.stringify(this.globals.filter_trend));
             this.getfilterEvent();

          // this.refinerName = `'${refiner}'` + `:['${item[0]._view.label}']`;
        }.bind(this),
        scales: {
          xAxes: [
            {
              ticks: {
                autoSkip: false,
                maxTicksLimit: 20,
                display: true,
                maxRotation: 0,
                fontFamily: '\'Open Sans Bold\', sans-serif',
                fontSize: 9,
                callback: function(value, index, values) {
                    return value.substring(0,8);  
                 
              }.bind(this)
              },
              scaleLabel: {
                display: true,
                labelString: this.xAxisLabels,

              },
              gridLines: {
                drawBorder: true,
                display: false
              },
  
              stacked: true
            }
          ],
          yAxes: [
            {
              gridLines: {
                drawBorder: true,
                display: false
              },
              ticks: {
                fontFamily: '\'Open Sans Bold\', sans-serif',
                fontSize: 11,
                autoSkip: true
              },
              scaleLabel: {
                display: true,
                labelString: this.yAxisLabels
              },
              stacked: true
            }
          ]
        }
      }
    });
  }
  public getfilterEvent() {
    this.filterEvent.emit('Filter Data');
  }
}
