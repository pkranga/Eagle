/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input, ViewChild, OnChanges } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-radar-graph',
  templateUrl: './radar-graph.component.html',
  styleUrls: ['./radar-graph.component.scss']
})
export class RadarGraphComponent implements OnInit, OnChanges {
  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;
  @Input() radarChartLabels = [];
  public lineChartColors: Array<any> = [
    {
      backgroundColor: 'rgb(149,235,149)',
      borderColor: 'rgb(34,177,76)',
      pointBackgroundColor: 'rgb(149,235,149)',
      pointBorderColor: 'rgb(34,177,76)',
      pointHoverBackgroundColor: 'rgb(149,235,149)',
      pointHoverBorderColor: 'rgb(34,177,76)'
    },
    {
      backgroundColor: 'rgb(247,156,124)',
      borderColor: 'rgb(241,90,36)',
      pointBackgroundColor: 'rgba(247,156,124,1)',
      pointBorderColor: 'rgb(241,90,36)',
      pointHoverBackgroundColor: 'rgba(247,156,124,1)',
      pointHoverBorderColor: 'rgba(247,156,124,1)'
    }
  ];
  @Input() public mainTitle = 'Avg # mins across dimensions';
  @Input() public chartData;
  // public radarChartLabel = ['Q1', 'Q2', 'Q3', 'Q4'];
  // public radarChartData = [
  //   {data: [120, 130, 180, 70], label: '2017'},
  //   {data: [90, 150, 200, 45], label: '2018'}
  // ];
  public data: any;
  public labels: any;
  public radarChartType = 'radar';
  constructor() {}
  ngOnInit() {
    this.data = JSON.parse(JSON.stringify(this.chartData));
    this.labels = JSON.parse(JSON.stringify(this.radarChartLabels));
    if (this.chart.chart) {
      this.chart.chart.update();
    }
  }

  ngOnChanges() {}
}
