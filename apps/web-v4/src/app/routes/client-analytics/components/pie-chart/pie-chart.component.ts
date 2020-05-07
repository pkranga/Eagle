/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
interface Margin {
  top: number;
  bottom: number;
  left: number;
  right: number;
}
@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit {
  @Input() height: Number;
  @Input() showlabels: boolean;
  @Input() graphData: Array<any>[];
  @Input() margin: Margin;
  options_pie: any;
  constructor() {}

  ngOnInit() {
    this.onPieChartCreate();
  }

  onPieChartCreate() {
    const height = this.height || 320;
    const labels = this.showlabels !== undefined ? this.showlabels : true;
    this.options_pie = {
      chart: {
        type: 'pieChart',
        margin: this.margin,
        height,
        x(d) {
          return d.key;
        },
        y(d) {
          return d.y;
        },
        valueFormat: d3.format('d'),
        showLegend: false,
        showLabels: labels,
        duration: 50,
        labelThreshold: 0,
        labelSunbeamLayout: false,
        useInteractiveGuideline: false,
        showValues: true,
        pie: {},
        callback() {
          d3.selectAll('.nv-pieLabels text  ').style('fill', 'white');
          d3.selectAll('.nv-pie').style('cursor', 'pointer');
          d3.selectAll('.nvd3.nv-pie path').style('fill-opacity', 1);
        }
      }
    };
  }
}
