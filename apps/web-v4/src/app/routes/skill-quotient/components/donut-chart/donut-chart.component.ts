/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-donut-chart',
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.scss']
})
export class DonutChartComponent implements OnInit {
  pieData;
  pieOptions;
  @Input() chartData: Array<any> = [];
  @Input() quotient: string;
  @Input() donut: boolean;
  @Input() showLegend: boolean;
  @Input() height: number;
  constructor() { }

  ngOnInit() {
    this.onDonutGraphCreate();
  }
  ngOnChanges() {
    setTimeout(() => {
      this.onDonutGraphCreate();
    }, 1000);
  }
  onDonutGraphCreate() {
    const height = this.height || 250;
    this.pieData = this.chartData;

    this.pieOptions = {
      chart: {
        type: 'pieChart',
        height: this.height,
        x(d) {
          return d.key;
        },
        y(d) {
          return d.y;
        },
        showLabels: false,
        duration: 5,
        labelThreshold: 0.01,
        labelSunbeamLayout: false,
        donut: this.donut,
        title: this.quotient,
        legend: {
          margin: {
            top: 5,
            right: 0,
            bottom: 30,
            left: -23
          },
          position: 'bottom',
          legend: {
            width: 450,
            maxKeyLength: 20,
            padding: 25,
            updateState: false
          }
        },
        tooltip: {
          contentGenerator(e) {
            const series = e.series[0];
            if (series.value === null) {
              return;
            }
            const value = parseFloat(series.value);
            const header =
              '<thead>' +
              '<tr>' +
              '<td class=\'legend-color-guide\'><div style=\'background-color:' +
              series.color +
              ';\'></div></td>' +
              '<td class=\'key\'><strong>' +
              series.key +
              ' : ' +
              value +
              '</strong></td>' +
              '</tr>' +
              '</thead>';

            return (
              '<table>' +
              header +
              '<tbody>' +
              // rows +
              '</tbody>' +
              '</table>'
            );
          }
        },
        showLegend: this.showLegend
        //  subtitle:{
        //    enable:true,
        //    text:'Your Technology Index'
        //  },
      }
    };
  }
}
