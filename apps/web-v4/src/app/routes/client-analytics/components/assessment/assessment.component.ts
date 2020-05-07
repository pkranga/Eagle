/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input } from '@angular/core';
import { element } from 'protractor';
import { parseHostBindings } from '@angular/compiler';
import { ClientAnalyticsService } from '../../services/client-analytics.service';
import { Globals } from '../../utils/globals';
import { FetchStatus } from '../../../../models/status.model';

@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.scss']
})
export class AssessmentComponent implements OnInit {
  @Input() clientData;
  graphData = [];
  assessmnetObj = {
    key: '',
    y: ''
  };
  data;
  obj = {};
  dict = new Map();
  analyticsFetchStatus: FetchStatus = 'fetching';
  constructor(private clientSvc: ClientAnalyticsService,
    private globals: Globals,

  ) { }

  ngOnInit() {
    this.analyticsFetchStatus = 'fetching';
    this.chartData(this.clientData);
    this.analyticsFetchStatus = 'done';

  }
  changePage(event) {

  }
  public onFilteredGet() {
    this.analyticsFetchStatus = 'fetching';
    this.clientSvc.getFilteredServers(this.globals.filter_trend, this.dict, this.globals.selectedStartDate, this.globals.selectedEndDate).subscribe(
      filterRes => {
        this.data = filterRes;
        this.chartData(this.data);
        this.analyticsFetchStatus = 'done';
      },
      err => {
        this.analyticsFetchStatus = 'error';
      }
    );
  }
  public callFilteredGet() {
    this.onFilteredGet();
  }

  chartData(data) {
    data.org_assessment_ranges.map(ele => {

      this.obj = {
        name: ele.content_name,
        data: [
          {
            key: '0-25',
            y: ele.assessment_ranges[0].doc_count || 0,
            // color:'#ffa600'
            color: 'rgb(179, 55, 113)'
          },
          {
            key: '25-50',
            y: ele.assessment_ranges[1].doc_count || 0,
            // color:'#a05195'
            color: 'rgb(250, 130, 49)'
          },
          {
            key: '50-75',
            y: ele.assessment_ranges[2].doc_count || 0,
            // color:'#f95d6a'
            color: 'rgb(247, 183, 49)'
          },
          {
            key: '75-100',
            y: ele.assessment_ranges[3].doc_count || 0,
            // color:'#2f4b7c'
            color: 'rgb(106, 176, 76)'
          }
        ]
      };

      this.graphData.push(this.obj);
    });
  }
}
