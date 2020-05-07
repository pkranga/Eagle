/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input, AfterViewChecked, Output, EventEmitter } from '@angular/core';
import { Chart } from 'chart.js';
import { Globals } from "../../utils/globals";

@Component({
  selector: 'app-bar-graph',
  templateUrl: './bar-graph.component.html',
  styleUrls: ['./bar-graph.component.scss']
})
export class BarGraphComponent implements OnInit {
  @Input() barChartLabel;
  @Input() barChartData;
  @Output() filterEvent = new EventEmitter<string>();
  @Input() barId: string;
  @Input() xAxisLabels: string;
  isExecuted: boolean;
  constructor(private globals: Globals) { }

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

        scales: {
          xAxes: [
            {
              ticks: {
                autoSkip: true,
                maxTicksLimit: 20,
                display: true,
                maxRotation: 0
              },
              scaleLabel: {
                display: true,
                labelString: this.xAxisLabels
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
                labelString: 'Users'
              },
              stacked: true
            }
          ]
        }
      }
    });
  }

}
