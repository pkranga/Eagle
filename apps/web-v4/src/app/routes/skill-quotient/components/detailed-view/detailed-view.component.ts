/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { SkillQuotientService, RouteDataService } from '../../services';
import { MatSort } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import * as mySkills from '../../../../models/my-skills.model';
import { ConfigService } from '../../../../services/config.service';
@Component({
  selector: 'app-detailed-view',
  templateUrl: './detailed-view.component.html',
  styleUrls: ['./detailed-view.component.scss']
})
export class DetailedViewComponent implements OnInit {
  isSiemensInstance = this.configSvc.instanceConfig.features.siemens.enabled;
  // isSiemensInstance = true;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @Input() skillQuotientData: mySkills.ISkillQuotientResponse;
  loader = true;
  isAdmin: mySkills.IAdmin;
  skillName: string;
  showManager: boolean;
  totalQuotient: number;
  skillImage: string;
  courseCount: number;
  certificationCount: number;
  assessmentQuotient: string;
  certificationQuotient: string;
  contentCreatedQuotient: string;
  assessmentData: Array<mySkills.IAssessment>;
  certificationData: Array<mySkills.ICertification>;
  availableCourses: Array<mySkills.IAvaialableCourse>;
  availableAssessments = [];
  availableCertifications: Array<mySkills.IAvailableCertification>;
  contentCreatedData = [];
  traineeData = [];
  certifiedData = [];
  skillQuotientDataResponse = [];
  defaultQuotient: number;
  projectEndorsementData = [];
  donutChartData = [];
  pieChartData = [];
  popularSkillData = [];
  displayedColumns: string[] = ['assessment_date', 'content_name', 'assessment_score', 'percentile'];
  panelOpenState: boolean;
  dataSource = [];
  assessmentGraphData = [];
  certificationGraphData = [];
  orgWideData: Array<mySkills.IOrgWideStats>;
  popularChartData = [];
  totalSkillQuotient: string;
  availableCourseOrgData: mySkills.IAvailableCourseOrgData;
  availableCourseOrgPieData = [];
  availableCertificationOrgData: mySkills.IAvailableCourseOrgData;
  availableCourseAndOrgData = [];
  availableCertificationOrgPieData: mySkills.IAvailableCertificationData[];
  relatedSkills: Array<mySkills.IRelatedSkillData>;
  category: string;
  horizon: string;
  criticality: string;
  selectedIndex = 0;
  constructor(
    private skillSvc: SkillQuotientService,
    private routeData: RouteDataService,
    private router: Router,
    private configSvc: ConfigService
  ) {}

  ngOnInit() {
    this.getData();
  }
  relatedSkill(skillId) {
    this.loader = true;
    this.relatedSkills = [];
    this.skillSvc.getSkillQuotient(skillId).subscribe(response => {
      this.skillQuotientData = response;
      this.getData();
    });
  }

  addEndorsement() {
    this.router.navigate(['/my-skills/create-project-endorsement']);
  }
  getData() {
    this.relatedSkills = undefined;
    this.assessmentData = undefined;
    this.certificationData = undefined;
    this.availableCourses = [];
    this.availableAssessments = [];
    this.availableCertifications = [];
    this.contentCreatedData = [];
    this.projectEndorsementData = [];
    this.donutChartData = [];
    this.pieChartData = [];
    this.popularSkillData = [];
    this.dataSource = [];
    this.assessmentGraphData = [];
    this.certificationGraphData = [];
    this.orgWideData = undefined;
    this.popularChartData = [];
    this.availableCourseOrgData = undefined;
    this.availableCourseOrgPieData = [];
    this.availableCertificationOrgData = undefined;
    this.availableCourseAndOrgData = [];
    this.availableCertificationOrgPieData = [];
    this.relatedSkills = this.skillQuotientData.related_skills;
    this.skillName = this.skillQuotientData.skill_quotient.skill_name;
    this.totalQuotient = this.skillQuotientData.skill_quotient.total_skill_quotient;
    if (this.totalQuotient) {
      this.totalSkillQuotient = this.totalQuotient.toFixed(2);
    } else {
      this.totalSkillQuotient = '0';
    }
    this.skillImage = this.skillQuotientData.skill_quotient.image_url;
    this.courseCount = this.skillQuotientData.skill_quotient.course_count;
    this.category = this.skillQuotientData.skill_quotient.category;
    this.horizon = this.skillQuotientData.skill_quotient.horizon;
    this.criticality = this.skillQuotientData.skill_quotient.criticality;
    this.certificationCount = this.skillQuotientData.skill_quotient.certification_count;
    this.assessmentData = this.skillQuotientData.assessment;
    this.certificationData = this.skillQuotientData.certification;
    if (this.certificationData && this.assessmentData) {
      this.assessmentGraphData = this.assessmentData.slice(0, 5);
      this.certificationGraphData = this.certificationData.slice(0, 5);
    }
    this.contentCreatedData = this.skillQuotientData.content_created;
    this.projectEndorsementData = this.skillQuotientData.project_endorsement;
    this.availableCourses = this.skillQuotientData.available_course;
    this.availableCertifications = this.skillQuotientData.available_certification;
    this.defaultQuotient = this.skillQuotientData.default_quotient;
    this.orgWideData = this.skillQuotientData.org_wide_stats;
    this.assessmentQuotient = parseFloat(this.skillQuotientData.skill_quotient.assessment_skill_quotient).toFixed(2);
    this.certificationQuotient = parseFloat(this.skillQuotientData.skill_quotient.certification_skill_quotient).toFixed(
      2
    );
    this.contentCreatedQuotient = parseFloat(
      this.skillQuotientData.skill_quotient.content_created_skill_quotient
    ).toFixed(2);
    this.orgWideData.map(cur => {
      this.popularSkillData.push(cur);
    });
    this.popularChartData = [
      {
        key: 'Beginner',
        y: this.popularSkillData[1].doc_count,
        color: '#ee5253'
      },
      {
        key: 'Certified',
        y: this.popularSkillData[2].doc_count,
        color: '#10ac84'
      },
      {
        key: 'Practitioner',
        y: this.popularSkillData[3].doc_count,
        color: '#feca57'
      }
    ];
    if (this.skillQuotientData.type === 'assessment') {
      this.donutChartData = [
        {
          key: 'Default Score',
          y: this.defaultQuotient,
          color: '#fa8231'
        },
        {
          key: 'Assessment Score',
          y: this.assessmentQuotient,
          color: '#f7b731'
        },

        {
          key: 'Not Scored',
          y: 5 - this.totalQuotient,
          color: '#487eb0'
        }
      ];
    } else if (this.skillQuotientData.type === 'certification' && this.contentCreatedData.length > 0) {
      this.donutChartData = [
        {
          key: 'Default Score',
          y: this.defaultQuotient,
          color: '#fa8231'
        },
        {
          key: 'Certification Score',
          y: this.certificationQuotient,
          color: '#f7b731'
        },
        {
          key: 'Content Created Score',
          y: this.contentCreatedQuotient || 0,
          color: '#10ac84'
        },
        {
          key: 'Not Scored',
          y: 5 - this.totalQuotient,
          color: '#487eb0'
        }
      ];
    } else if (this.skillQuotientData.type === 'certification') {
      this.donutChartData = [
        {
          key: 'Default Score',
          y: this.defaultQuotient,
          color: '#fa8231'
        },
        {
          key: 'Certification Score',
          y: this.certificationQuotient,
          color: '#f7b731'
        },
        {
          key: 'Not Scored',
          y: 5 - this.totalQuotient,
          color: '#487eb0'
        }
      ];
    } else if (this.skillQuotientData.type === 'project_endorsement') {
      this.donutChartData = [
        {
          key: 'Default Score',
          y: this.defaultQuotient,
          color: '#fa8231'
        },
        {
          key: 'Certification Score',
          y: this.certificationQuotient,
          color: '#f7b731'
        },
        {
          key: 'Project Endorsement Score',
          y: this.skillQuotientData.skill_quotient.project_endorsement_skill_quotient,
          color: '#ED4C67'
        },
        {
          key: 'Content Created Score',
          y: this.contentCreatedQuotient,
          color: '#10ac84'
        },
        {
          key: 'Not Scored',
          y: 5 - this.totalQuotient,
          color: '#487eb0'
        }
      ];
    } else if (this.skillQuotientData.type === 'project_experience') {
      this.donutChartData = [
        {
          key: 'Default Score',
          y: this.defaultQuotient,
          color: '#fa8231'
        },
        {
          key: 'Certification Score',
          y: this.certificationQuotient,
          color: '#f7b731'
        },
        {
          key: 'Project Experience Score',
          y: this.skillQuotientData.skill_quotient.project_experience_skill_quotient,
          color: '#ED4C67'
        },
        {
          key: 'Not Scored',
          y: 5 - this.totalQuotient,
          color: '#487eb0'
        }
      ];
    }
    this.traineeData = [
      {
        key: 'Trained',
        y: this.skillQuotientData.skill_quotient.skill_course_comp,
        color: '#f9ca24'
      },
      {
        key: 'Not Trained',
        y: 100 - this.skillQuotientData.skill_quotient.skill_course_comp,
        color: '#bdc3c7'
      }
    ];
    this.certifiedData = [
      {
        key: 'Certified',
        y: this.skillQuotientData.skill_quotient.skill_certification_comp,
        color: '#f39c12'
      },
      {
        key: 'Not Certified',
        y: 100 - this.skillQuotientData.skill_quotient.skill_certification_comp,
        color: '#bdc3c7'
      }
    ];
    // this.loader = false;
    this.availableCourseOrgData = this.skillQuotientData.available_course_org_data;
    this.availableCourses.map((cur: any, i) => {
      const others = this.availableCourseOrgData[cur.lex_id];

      if (others === undefined) {
        return;
      }

      const obj = {
        name: cur.content_name,
        id: cur.lex_id,
        materialUrl: cur.material_url,

        totalUsers: others[4].doc_count || 0,
        legend: i === 0 ? true : false,
        data: [
          {
            key: '0-25%',
            y: others['0'].doc_count || 0,

            color: 'rgb(179, 55, 113)'
          },
          {
            key: '25-50%',
            y: others['1'].doc_count || 0,
            color: 'rgb(250, 130, 49)'
          },
          {
            key: '50-75%',
            y: others['2'].doc_count || 0,
            color: 'rgb(247, 183, 49)'
          },
          {
            key: '75-100%',
            y: others['3'].doc_count + others['4'].doc_count || 0,
            color: 'rgb(106, 176, 76)'
          }
        ]
      };
      this.availableCourseOrgPieData.push(obj);
    });
    this.availableCertificationOrgData = this.skillQuotientData.available_certification_org_data;
    this.availableCertifications.map((cur: any, i) => {
      cur.org_data = this.availableCertificationOrgData[cur.lex_id];
      const others = cur.org_data;

      if (others === undefined) {
        return;
      } else {
        const obj = {
          name: cur.content_name,
          id: cur.lex_id,
          materialUrl: cur.material_url,
          totalUsers: others[1] && others[1].doc_count ? others[1].doc_count : 0,
          legend: i === 0 ? true : false,
          data: [
            {
              key: 'Qualified',
              y: others[1] && others[1].doc_count ? others[1].doc_count : 0,

              color: 'rgb(106, 176, 76)'
            },
            {
              key: 'Not Qualified',
              y: others[0] && others[0].doc_count ? others[0].doc_count : 0,
              color: '#e74c3c'
            }
          ]
        };
        this.availableCertificationOrgPieData.push(obj);
      }
    });
    this.loader = false;
  }
  onTabChange(selectedIndex: number) {
    if (selectedIndex === 2 || selectedIndex === 3) {
      this.getData();
    }
  }
  help() {
    this.skillSvc.getAdmin().subscribe(res => {
      this.isAdmin = res;
      this.showManager = this.isAdmin.is_admin;
    });

    const tab = 'faq';
    this.router.navigate(['/my-skills'], {
      queryParams: { tab }
    });
  }
}
export interface AssessmentDetails {
  date: string;
  course: string;
  score: number;
  percentile: number;
}
