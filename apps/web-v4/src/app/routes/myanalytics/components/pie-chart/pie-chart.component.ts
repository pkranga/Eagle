/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit , AfterViewInit, ElementRef, ViewChild , Input} from '@angular/core';
import {Chart} from 'chart.js';
@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit, AfterViewInit  {
  @Input() pieChartData;
  @Input() pieChartLabel;
  @Input() pieId: string;
  isChart = false;
  // @ViewChild('pieChartContainer') pieChartContainer: ElementRef<HTMLDivElement>;
  // @ViewChild('abc') pieChartContainer: ElementRef<HTMLDivElement>;
  constructor() { }

  ngOnInit() {
  }
  ngAfterViewInit() {
    this.initGraph();

  }
  initGraph() {
    const canvas = document.createElement('canvas');
    canvas.id = this.pieId + '1';
    // alert(this.pieId)
    const pieChartContainer = <HTMLElement>document.getElementById(this.pieId);
    pieChartContainer.appendChild(canvas);
    const pieChart = new Chart(canvas.id, {
      type: 'pie',

      data: {
        labels: this.pieChartLabel,
        datasets: [
          {
              fill: true,
              backgroundColor: [
                'rgb(0,103,144)', 'rgb(255,115,0)', 'rgb(255,175,0)'],
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
          position: 'bottom',
          fullWidth: true
        },
        // title: {
        //           display: true,
        //           text: 'What happens when you lend your favorite t-shirt to a girl ?',
        //           position: 'top'
        //       },
        rotation: -0.7 * Math.PI
      }
      });
    }
}
