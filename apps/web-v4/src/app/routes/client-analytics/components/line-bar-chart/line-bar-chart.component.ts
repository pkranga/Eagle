/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-line-bar-chart',
  templateUrl: './line-bar-chart.component.html',
  styleUrls: ['./line-bar-chart.component.scss']
})
export class LineBarChartComponent implements OnInit {
  public static _self: LineBarChartComponent;
  public static type: string;
  options: any;
  data: any;
  @Input() mainTitle: any;
  @Input() y1Axis: any;
  @Input() y2Axis: any;
  @Input() linePlusBarData: any;
  barColor: any;
  constructor() {
    LineBarChartComponent._self = this;
  }

  ngOnInit() {
    this.onBarGraphCreate();
  }
  ngOnChanges() {
    if (this.linePlusBarData) {
      this.data = this.linePlusBarData;
    }
    this.onBarGraphCreate();
  }
  public onBarGraphCreate() {
    this.options = {
      chart: {
        type: 'linePlusBarChart',
        height: 500,
        margin: {
          top: 30,
          right: 75,
          bottom: 50,
          left: 75
        },

        bars: {
          forceY: [0]
        },
        bars2: {
          forceY: [0]
        },
        color: ['#2ca02c', 'darkred'],
        legend: {
          margin: {
            left: 0,
            right: 0,
            top: 1,
            bottom: 5
          }
        },
        xAxis: {
          axisLabel: 'Date',
          tickFormat(d) {
            return d3.time.format('%x')(new Date(d));
          }
        },
        x2Axis: {
          showMaxMin: false,
          tickFormat(d) {
            return d3.time.format('%x')(new Date(d));
          }
        },
        y1Axis: {
          axisLabel: this.y1Axis
          // "axisLabelDistance": 12
        },
        y2Axis: {
          axisLabel: this.y2Axis
        },
        y3Axis: {},
        y4Axis: {},
        callback() {
          d3.selectAll('rect').style('cursor', 'pointer');
          // d3.selectAll('rect').style('fill-opacity' , '0.75' );
        }
      }
    };
  }
}
