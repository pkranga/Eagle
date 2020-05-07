/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

export interface PeriodicElement {
  basic: string;
  advanced: string;
  expert: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    basic:
      'Basic knowledge and understanding of Bid Management. Can prepare bids including cost calculation under guidance and using standards.',
    advanced:
      'Can apply knowledge independently. Has successfully supported the pricing strategy in project acquisition through development of alternatives of project specific scope of supply and related costs. Deep professional knowledge of managing complex projects. Proactively shares knowledge to improve team results.',
    expert:
      'Can prepare bids including cost calculation for complex projects with several partners (e.g. consortiums). Provides guidance and troubleshoot on highly complex issues.'
  }
];
@Component({
  selector: 'app-sample-skill-quotient',
  templateUrl: './sample-skill-quotient.component.html',
  styleUrls: ['./sample-skill-quotient.component.scss']
})
export class SampleSkillQuotientComponent implements OnInit {
  displayedColumns: string[] = ['assessment_date', 'content_name', 'assessment_score', 'percentile'];
  selectedTabIndex = 0;
  dataSource = [];
  skillName: string;
  assessmentGraphData = [];
  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.queryParamMap.subscribe((queryParams: any) => {
      this.skillName = queryParams.get('skill');
    });

    this.assessmentGraphData = [
      {
        assessment_date: '2019-02-02T15:01:25.000Z',
        assessment_score: 96,
        certification_result: null,
        content_name: this.skillName,
        content_type: null,
        email_id: 'thirumalaa',
        lex_id: 'lex_22713881561116426000',
        max_score: 100,
        min_score: 4,
        percentile: 95,
        quotient_type: 'course',
        skill_id: 21569,
        type: 'assessment'
      },
      {
        assessment_date: '2019-02-02T17:06:43.000Z',
        assessment_score: 68,
        certification_result: null,
        content_name: this.skillName,
        content_type: null,
        email_id: 'thirumalaa',
        lex_id: 'lex_32407835671946760000',
        max_score: 100,
        min_score: 4,
        percentile: 59,
        quotient_type: 'course',
        skill_id: 21569,
        type: 'assessment'
      },
      {
        assessment_date: '2019-03-12T17:06:43.000Z',
        assessment_score: 60,
        certification_result: null,
        content_name: this.skillName,
        content_type: null,
        email_id: 'thirumalaa',
        lex_id: 'lex_32407835671946760000',
        max_score: 100,
        min_score: 4,
        percentile: 49,
        quotient_type: 'course',
        skill_id: 21569,
        type: 'assessment'
      },
      {
        assessment_date: '2019-03-22T15:01:25.000Z',
        assessment_score: 76,
        certification_result: null,
        content_name: this.skillName,
        content_type: null,
        email_id: 'thirumalaa',
        lex_id: 'lex_22713881561116426000',
        max_score: 100,
        min_score: 4,
        percentile: 75,
        quotient_type: 'course',
        skill_id: 21569,
        type: 'assessment'
      },
      {
        assessment_date: '2019-04-12T18:54:18.000Z',
        assessment_score: 80,
        certification_result: null,
        content_name: this.skillName,
        content_type: null,
        email_id: 'thirumalaa',
        lex_id: 'lex_4086999395844649000',
        max_score: 100,
        min_score: 5,
        percentile: 57,
        quotient_type: 'course',
        skill_id: 21569,
        type: 'assessment'
      },
      {
        assessment_date: '2019-05-02T15:01:25.000Z',
        assessment_score: 86,
        certification_result: null,
        content_name: this.skillName,
        content_type: null,
        email_id: 'thirumalaa',
        lex_id: 'lex_22713881561116426000',
        max_score: 100,
        min_score: 4,
        percentile: 85,
        quotient_type: 'course',
        skill_id: 21569,
        type: 'assessment'
      }
    ];
  }
  onTabChange(selectedIndex) {
    if (selectedIndex === 1) {
      this.selectedTabIndex = 1;
    }
  }
}
