/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-donut-graph',
  templateUrl: './donut-graph.component.html',
  styleUrls: ['./donut-graph.component.scss']
})
export class DonutGraphComponent implements OnInit {

  @Input() height: Number;
  @Input() showlabels: boolean;
  @Input() graphData: Array<any>[];
  options_pie: any;
  @Input() showLegend: boolean;
  @Input() graphTitle;
  @Input() bottom: boolean;
  constructor() { }

  ngOnInit() {
    this.onPieChartCreate();
  }

  onPieChartCreate() {
    const height = this.height || 320;
    const labels = (this.showlabels !== undefined ) ? this.showlabels :  true;
    this.bottom = this.bottom || false;

    this.options_pie = {
      chart: {
        type: 'pieChart',
        height: 245,
        donut: true,
        x: function (d) {
          return d.key;
        },
        y: function (d) {
          return (d.y);
        },
        color: ['#B33771', '#F97F51', '#58B19F', 'rgb(106, 176, 76)'],
        valueFormat: (d3.format('d')),
        showLegend: this.showLegend ,
        showLabels: false,
        duration: 50,
        labelThreshold: 0,
        labelSunbeamLayout: false,
        useInteractiveGuideline: false,
        showValues: true,
        pie: {
          startAngle: function(d) { return d.startAngle / 2 - Math.PI / 2; },
          endAngle: function(d) { return d.endAngle / 2 - Math.PI / 2; }
      },
      margin: {
        left: 5,
        right: 40,
        top: 30
      },
      'legend': {
        margin: {
          left: 0,
          right: 0
        },
        'width': 300,
        'maxKeyLength': 10,
        'padding': 16,
        'updateState': false,
        },
        callback: function () {
          d3.selectAll('.nv-pieLabels text  ').style('fill', 'white');
          d3.selectAll('.nv-pie').style('cursor' , 'pointer' );
          d3.selectAll('.nvd3.nv-pie path').style('fill-opacity', 1);
          d3.selectAll('#donut-graph svg').style('height', '150px');
        }
      }
    };
  }

}
