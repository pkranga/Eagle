/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, PageEvent } from '@angular/material';
import {ConfigService} from '../../../../services/config.service';

@Component({
  selector: 'app-my-assessments',
  templateUrl: './my-assessments.component.html',
  styleUrls: ['./my-assessments.component.scss']
})
export class MyAssessmentsComponent implements OnInit {
  isSiemensAvailable =this.configSvc.instanceConfig.features.siemens.enabled;
  @Input() loader2: boolean;
  @Input() assessmentData: any;
  @Input() pendingAssessment:number;
  displayedColumns: string[] = ['content_name', 'assessment_score', 'percentile', 'otherRange'];
  dataSource = new MatTableDataSource([]);
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  otherAssessmentData: any;
  assessmentRange: any;
  totalAssessment: any;
  pageNo = 0;
  margin = {
    top: 30,
    right: 20,
    bottom: 30,
    left: 20
  };
  assessmentLabel = ['0-25', '25-50', '50-75', '75-100'];
  constructor(private configSvc: ConfigService) {}

  ngOnInit() {
    this.dataSource = new MatTableDataSource<any>(this.assessmentData.assessment);
    this.dataSource.paginator = this.paginator;
    this.assessmentRange = this.assessmentData.assessment_score_ranges;
    this.assessmentData.assessment.map(cur => {
      cur.scoreRange = [];
      const others = this.assessmentRange[cur.lex_id];
      const obj = {
        name: others.content_name,
        data: [
          {
            key: '0-25',
            y: others['25'] || 0,
            // color:'#ffa600'
            color: 'rgb(179, 55, 113)'
          },
          {
            key: '25-50',
            y: others['50'] || 0,
            // color:'#a05195'
            color: 'rgb(250, 130, 49)'
          },
          {
            key: '50-75',
            y: others['75'] || 0,
            // color:'#f95d6a'
            color: 'rgb(247, 183, 49)'
          },
          {
            key: '75-100',
            y: others['100'] || 0,
            // color:'#2f4b7c'
            color: 'rgb(106, 176, 76)'
          }
        ]
      };
      cur.scoreRange = obj;
    });
  }

  changePage(event: PageEvent) {
    this.pageNo = event.pageIndex * 2;
  }
}
