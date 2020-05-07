/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-box-plot-graph',
  templateUrl: './box-plot-graph.component.html',
  styleUrls: ['./box-plot-graph.component.scss']
})
export class BoxPlotGraphComponent implements OnInit {
  @Input() assessmentData: any;
  showing = 0;
  showRight = false;
  showLeft = false;
  public buttonGraphData: Array<any> = [];
  public buttonGraphData1: Array<any> = [];
  options: any;
  // boxPlotData:Array<object> = [];
  constructor() {}

  ngOnInit() {
    if (this.assessmentData) {
      this.onBoxPlotCreate();
    }
  }

  onBoxPlotCreate() {
    this.buttonGraphData = [];
    this.buttonGraphData1 = this.getData();
    this.buttonGraphData1.map((cur: any) => {
      const obj = {
        // label: cur.lex_id,
        // displayName:cur.lex_id.slice(0,25),
        // percent:cur.assessment_score,
        label: cur.content_name,
        displayName: cur.content_name.slice(0, 25),
        percent: cur.percentile,
        score: Math.ceil(cur.assessment_score),
        values: {
          Q1: Math.ceil((cur.max_score - cur.min_score) * (cur.percentile / 100) + cur.min_score) - 2,
          Q3: Math.ceil((cur.max_score - cur.min_score) * (cur.percentile / 100) + cur.min_score) + 2,
          whisker_low: cur.min_score,
          whisker_high: cur.max_score
          // uncomment for reverting  and change nvd3 line.nv-boxplot-median at style.css make  stroke-width : 5px
          // Q1: cur.min_score,
          // Q3: cur.max_score,
          // Q2: Math.ceil(cur.percentile),
          // whisker_low: 0,
          // whisker_high: 100,
        },
        color: this.getColor(Math.ceil(cur.percentile))
        // color:this.getColor(Math.ceil(cur.assessment_score))
      };
      // console.log(Math.ceil(((cur.max_score - cur.min_score )* cur.percentile)));
      this.buttonGraphData.push(obj);
    });

    this.options = {
      chart: {
        type: 'boxPlotChart',
        height: 325,
        // width:(61.4 * this.buttonGraphData.length),
        margin: {
          top: 20,
          right: 20,
          bottom: 60,
          left: 40
        },
        x(d) {
          return d.displayName;
        },
        // y: function(d){return d.values;},
        maxBoxWidth: 0.5,
        yDomain: [0, 100],
        xAxis: {
          rotateLabels: -45,
          tickFormat(d) {
            return '';
          },
          tickPadding: 3
        },
        tooltip: {
          contentGenerator(e) {
            // debugger;
            const series = e.series[0];
            if (series.value === null) {
              return;
            } else if (series.value === undefined) {
              return;
            } else {
              const header =
                '<thead>' +
                '<tr>' +
                // "<td class='legend-color-guide'><div style='background-color: " + series.color + ";'></div></td>" +
                '<td class=\'key\' style=\'margin-bottom:10px;font:weight\'><strong> ' +
                e.data.label +
                ' </strong></td>' +
                '</tr>' +
                '<tr>' +
                '<td class=\'key\'><strong> my Precentile : ' +
                e.data.percent.toFixed(2) +
                '</strong></td>' +
                '</tr>' +
                '<tr>' +
                '<td class=\'key\'><strong> my Score      : ' +
                e.data.score +
                '</strong></td>' +
                '</tr>' +
                '</thead>';
              // style='padding:5px;border-radius:5px;background-color:whitesmoke;border:1px solid black;'
              return (
                '<table >' +
                header +
                '<tbody>' +
                // rows +
                '</tbody>' +
                '</table>'
              );
            }
          }
          // 43.900704225352115
        },
        noData: 'You have not given any assessment',
        callback() {
          d3.selectAll('.nv-axis .tick line').style('display', 'none');
        }
      }
    };
  }
  getColor(score: number) {
    try {
      // debugger;
      if (score > 60 && score < 71) {
        // return '#FFFF00';
        return 'rgb(247, 183, 49)';
      } else if (score > 70 && score < 85) {
        return 'darkorange';
      } else if (score >= 85 && score <= 100) {
        return 'green';
      } else {
        return 'rgb(179, 55, 113)';
      }
    } catch (e) {
      console.error(e);
    }
  }

  getData() {
    this.validate();
    if (this.assessmentData.length > 7 && this.showing <= this.assessmentData.length) {
      return this.assessmentData.slice(this.showing, this.showing + 7);
    } else {
      return this.assessmentData;
    }
  }
  changeData() {
    this.showing += 7;
    this.onBoxPlotCreate();
  }
  changeData2() {
    this.showing -= 7;
    this.onBoxPlotCreate();
  }

  validate() {
    try {
      const num = this.showing + 7;
      if (this.showing >= 0 && num < this.assessmentData.length && this.assessmentData.length > 7) {
        this.showRight = true;
      } else {
        this.showRight = false;
      }

      if (this.showing >= 7 && (num <= this.assessmentData.length || !this.showRight)) {
        this.showLeft = true;
      } else {
        this.showLeft = false;
      }
    } catch (e) {
      console.error(e);
    }
  }
}
