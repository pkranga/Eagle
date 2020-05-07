/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SkillQuotientService, RouteDataService } from '../../services';

/**
 * CODE_REVIEW
 * popularSkillData = [] converted to any
 * how are you willing to read a cutom property from an array
 *
 */

@Component({
  selector: 'app-popular-skills',
  templateUrl: './popular-skills.component.html',
  styleUrls: ['./popular-skills.component.scss']
})
export class PopularSkillsComponent implements OnInit {
  popularSkillData: any;
  loader = true;
  popularSkillId;
  availableCourse = [];
  availableAssessment = [];
  availableCertification = [];
  pieChartData = [];
  orgWideStatus = [];
  org1;
  org2;
  org3;
  org4;
  skillName;
  courseCount;
  certificationCount;
  constructor(
    private route: ActivatedRoute,
    private skillSvc: SkillQuotientService,
    private routeData: RouteDataService
  ) { }

  ngOnInit() {
    this.popularSkillId = this.routeData.getStoredData('popular_skillId');
    this.skillSvc.popularSkillData(this.popularSkillId).subscribe(response => {
      this.popularSkillData = response;
      this.availableCourse = this.popularSkillData.available_course;
      this.availableAssessment = this.popularSkillData.available_assessment;
      this.availableCertification = this.popularSkillData.available_certification;
      this.skillName = this.availableAssessment[0].skill_name;
      this.orgWideStatus = this.popularSkillData.org_wide_stats;
      this.courseCount = this.availableCourse.length;
      this.certificationCount = this.availableCertification.length;

      this.org1 = this.orgWideStatus[0];
      this.org2 = this.orgWideStatus[1];
      this.org3 = this.orgWideStatus[2];
      this.org4 = this.orgWideStatus[3];
      this.pieChartData = [
        {
          key: 'Beginner',
          y: this.org2.doc_count,
          color: '#f7b731'
        },
        {
          key: 'Certified',
          y: this.org3.doc_count,
          color: '#487eb0'
        },
        {
          key: 'Practitioner ',
          y: this.org4.doc_count,
          color: '#16a085'
        }
      ];
      this.loader = false;
    });
  }
}
