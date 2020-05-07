/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';

@ Component({
  selector: 'app-bubble-chart',
  templateUrl: './bubble-chart.component.html',
  styleUrls: ['./bubble-chart.component.scss']
})
export class BubbleChartComponent implements OnInit, AfterViewInit {
  @ Input() bubbleData: any;
  @ Input() mainTitle;
  @ Input() height;
  @ Input() weight;
  @ Input() startDate;
  @ Input() endDate;
  @ Input() bubbleChartLabels;
  @ ViewChild('chartContainer', { static: true }) chartContainer: ElementRef< HTMLDivElement>;
  popData: any;
  yearStart:string;
  yearEnd:string;
  public options;
  constructor() {
  }

  ngOnInit() {
    this .popData = {
      datasets: [
        {
          label: 'Time Spent',
          data: this .bubbleData,

          backgroundColor: [
            '#3498db',
            '#c0392b',
            '#fbc531 ',
            '#ff793f',
            '#706fd3',
            '#218c74',
            '#f78fb3',
            '#6F1E51 ',
            '#D980FA',
            '#be2edd ',
            '#6B9080',
            '#563838',
            '#0444BF',
            '#00743F',
            '#011A27',
            '#f6b93b ',
            '#3c6382',
            '#78e08f',
            '#67e6dc',
            '#FC427B',
            '#BDC581',
            '#d35400',
            '#e17055',
            '#55E6C1',
            '#3498db',
            '#c0392b',
            '#fbc531 ',
            '#ff793f',
            '#706fd3',
            '#218c74',
            '#f78fb3',
            '#6F1E51 ',
            '#D980FA',
            '#be2edd ',
            '#6B9080',
            '#563838',
            '#0444BF',
            '#00743F',
            '#011A27',
            '#f6b93b ',
            '#3c6382',
            '#78e08f',
            '#67e6dc',
            '#FC427B',
            '#BDC581',
            '#d35400',
            '#e17055',
            '#55E6C1'
          ]
        }
      ],
      value: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']
    };
  }
  ngAfterViewInit() {
    this .initGraph();
  }

  initGraph() {
    let dateStartYear = this .startDate.split('-')[0];
    let yearEnd;
    let yearStart;
    let dateStart=this .startDate.split('-')[1]
    if(dateStart!='01'){
      if(dateStartYear=== '2018')
      {
        yearStart='2018';
        yearEnd='2019';
      }
      else{
        yearStart='2019';
        yearEnd='2020';
      }
    }
    else{
      if(dateStartYear=== '2019')
      {
        yearStart='2018';
        yearEnd='2019';
      }
      else{
        yearStart='2019';
        yearEnd='2020';
      }
    }
    const canvas = document.createElement('canvas');
    canvas.id = 'userStatChartId';
    this .chartContainer.nativeElement.appendChild(canvas);
    const bubbleChart = new Chart('userStatChartId', {
      type: 'bubble',

      data: this .popData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        hover: {
          mode: 'index'
        },
        scales: {
          xAxes: [
            {
              // type: 'time',
              // time: {
              //   unit: 'month',
              //   displayFormats: {
              //       quarter: 'MMM YYYY'
              //   }
              // },
              ticks: {
                // callback: function(value, index, data) {
                //   return  (value <= 12 ) ? value: '';
                // },

                callback(value) {
                  return (
                    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][
                      value > 12 ? value - 13 : value - 1
                    ] +
                    ' ' +
                    (value > 12 ? yearEnd : yearStart)
                  );
                },

                source: 'labels',
                beginAtZero: false,
                max: 16,
                stepSize: 1,
                suggestedMin: 4
              },
              scaleLabel: {
                display: true,
                labelString: 'Months'
              },
              gridLines: {
                display: false
              }
            }
          ],
          yAxes: [
            {
              gridLines: {
                display: false
              },
              scaleLabel: {
                display: true,
                labelString: '# of courses'
              },

              display: true,
              ticks: {
                beginAtZero: true,

                max: 4,
                stepSize: 1
              }
            }
          ]
        },
        tooltips: {
          callbacks: {
            label(tooltipItem, data: any) {
              let label = data.datasets[tooltipItem.datasetIndex].label || '';
              if (label) {
                label += ' : ';
              }
              label +=
                'in ' +
                data.value[Math.floor(data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].x) - 1] +
                ' on ' +
                data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].text +
                ' is ' +
                data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].actual.toFixed(2) +
                ' mins';
              // ' '+data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].y +' resourses'
              return label;
            }
          }
        }
      }
    });
  }
}
