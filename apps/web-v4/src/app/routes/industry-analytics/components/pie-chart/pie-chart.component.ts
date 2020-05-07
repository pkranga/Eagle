/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { PieChartData } from '../../../../models/org-learning-analytics.model';
import { Chart } from 'chart.js';


@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit {
  @ViewChild('chartContainer', { static: true }) chartContainer: ElementRef<HTMLDivElement>;
  @Input() pieChartLabel;
  @Input() pieChartData;
  constructor() { }

  ngOnInit() {
    this.initPieGraph();
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
            backgroundColor: ['rgb(63, 81, 181)', 'rgb(252, 167, 93)'],
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
}
