/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input, ElementRef, ViewChild, OnChanges, AfterViewInit } from '@angular/core';
import { Chart } from 'chart.js';
@Component({
  selector: 'app-line-graph',
  templateUrl: './line-graph.component.html',
  styleUrls: ['./line-graph.component.scss']
})
export class LineGraphComponent implements OnInit, AfterViewInit, OnChanges {
  LineChart;
  i = 0;
  @Input() lineData1;
  @ViewChild('chartContainer', { static: true }) chartContainer: ElementRef<HTMLDivElement>;
  constructor() {}

  ngOnInit() {}
  ngAfterViewInit() {
    this.onLineGraphCreate();
  }

  ngOnChanges() {
    setTimeout(() => {
      this.onLineGraphCreate();
    }, 1000);
  }

  onLineGraphCreate() {
    const canvas = document.createElement('canvas');
    canvas.id = 'lineChart';
    const lineData = this.lineData1;
    this.chartContainer.nativeElement.innerHTML = '';
    this.chartContainer.nativeElement.appendChild(canvas);
    this.LineChart = new Chart(canvas.id, {
      type: 'line',
      data: {
        labels: ['Apr', 'May', 'Jun', 'Jul'],
        datasets: [
          {
            label: 'Role Quotient',
            // scaleStepWidth: 1,
            borderColor: '#2d98da',
            pointBorderColor: '#2d98da',
            pointBackgroundColor: '#2d98da',
            pointHoverBackgroundColor: '#2d98da',
            pointHoverBorderColor: '#2d98da',
            pointBorderWidth: 10,
            pointHoverRadius: 10,
            pointHoverBorderWidth: 1,
            pointRadius: [1, 1, 1, 1, -90],
            fill: false,
            lineTension: 0.1,
            borderWidth: 4,
            //  data:this.lineData,
            data: [1, 2.4, 3.6]
          },
          {
            data: [1, 2.4, 3.6, 4.5],
            // data:this.lineData1,

            lineTension: 0,
            backgroundColor: '#eb3b5a',
            borderColor: '#eb3b5a',
            fill: false,
            borderDash: [5, 5],
            pointRadius: [-90, -90, -90, 5]
          }
        ]
      },

      options: {
        responsive: true,
        legend: {
          display: false
          // position: 'bottom',
        },
        hover: {
          mode: 'index'
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                drawOnChartArea: false
              },

              scaleLabel: {
                display: true,
                labelString: 'Month'
              }
            }
          ],
          yAxes: [
            {
              gridLines: {
                drawOnChartArea: false
              },
              ticks: {
                beginAtZero: true,
                callback(value) {
                  if (value % 1 === 0) {
                    return value;
                  }
                }
              },

              scaleLabel: {
                display: true,
                labelString: 'Role Quotient'
              }
            }
          ]
        },
        tooltips: {
          callbacks: {
            label(tooltipItem, data: any) {
              const label = tooltipItem.xLabel + ' : ' + lineData[tooltipItem.index].key;
              return label;
            }
          }
        }
      }
    });
  }
}
