/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { SkillQuotientService, RouteDataService } from '../../services';
import * as mySkills from '../../../../models/my-skills.model';
import { FetchStatus } from '../../../../models/status.model';
import { ConfigService } from '../../../../services/config.service';
/*** CODE_REVIEW
* roleSkillData = [] converted to any
* how are you willing to read a cutom property from an array
*
*/
export interface PeriodicElement {
  skillName: string;
  required: Array<number>;
  acquired: Array<number>;
  status: boolean;
  lp: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { skillName: 'PD Gas Chromatograph', required: [1, 1, 1], acquired: [1, 1, 1], status: true, lp: 'Learning Path' },
  { skillName: 'PD Process Analytics Products', required: [1, 1, 0], acquired: [1, 0, 0], status: false, lp: 'Learning Path' },
  { skillName: 'PD Special Applications Laser', required: [1, 1, 1], acquired: [1, 1, 0], status: false, lp: 'Learning Path' },
  { skillName: 'PD System Integration Analytics', required: [1, 1, 1], acquired: [1, 0, 0], status: false, lp: 'Learning Path' },
  { skillName: 'PD Continuous Gas Analyzer (CGA)', required: [1, 1, 0], acquired: [1, 1, 0], status: true, lp: 'Learning Path' },

];
@Component({
  selector: 'app-role-quotient',
  templateUrl: './role-quotient.component.html',
  styleUrls: ['./role-quotient.component.scss']
})
export class RoleQuotientComponent implements OnInit {
  isSiemensInstance = this.configSvc.instanceConfig.features.siemens.enabled;
  // isSiemensInstance = true;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  loader: boolean = true;
  public isAssessment: boolean = false;
  public isDefault: boolean = false;
  certificationQuotient: string;
  isAdmin: mySkills.IAdmin;
  showManager: boolean;
  pieChartData = [];
  skills = [];
  rolesData = [];
  roleSkillData;
  traineeData = [];
  certifiedData = [];
  rolesDetails;
  skillQuotient: number;
  roleQuotient: string;
  loaderFetchStatus: FetchStatus = 'fetching';
  // assessmentData: Array<any> = [];
  defaultQuotient: number;
  quotient: number;
  roleId: string;
  assessmentQuotient: string;
  availableCertification = [];
  assessmentChartData = [];
  displayedColumnsRole: string[] = ['skillName', 'required', 'acquired', 'status', 'lp'];
  displayedColumns: string[] = ['assessment_date', 'content_name', 'assessment_score', 'percentile'];
  dataSource = ELEMENT_DATA;
  constructor(
    private skillSvc: SkillQuotientService,
    private route: ActivatedRoute,
    private routeData: RouteDataService,
    private router: Router,
    private configSvc: ConfigService
  ) { }

  ngOnInit() {

    this.roleId = this.routeData.getStoredData('role_id');
    if (this.roleId != '785970') {
      this.roleId = this.roleId;
    }
    else {
      this.roleId = '785970'
    }
    if (this.roleId === undefined) {
      this.router.navigate(['/my-skills']);
    }
    // this.role_id = this.route.snapshot.queryParamMap.get('cardId');
    this.skillSvc.getRoles().subscribe(response => {
      this.rolesData = response[0];

      this.skillSvc.getRoleQuotient(this.roleId).subscribe(res => {
        this.roleSkillData = res;
        if (this.isSiemensInstance) {
          this.pieChartData = [
            {
              key: 'Skills Completed',
              y: 40,
              color: '#227093'
            },
            {
              key: 'Skills Not Completed',
              y: 100 - 40,
              color: '#CAD3C8'
            }
          ];
        }

        this.rolesDetails = this.roleSkillData.role_quotient_details;
        this.roleQuotient = this.roleSkillData.total_quotient.toFixed(2);
        this.skills = this.rolesDetails.skills;
        this.skills.map(cur => {
          if (cur.assessment.length > 5) {
            this.assessmentChartData.push(cur.assessment);
            this.assessmentChartData = this.assessmentChartData.splice(0, 5);
          } else {
            this.assessmentChartData.push(cur.assessment);
          }
          cur.available_certification.map(data => {
            this.availableCertification.push(data);
          });
        });
        this.callData();
      });
    });
  }


  callData() {
    this.defaultQuotient = this.roleSkillData.default_quotient;
    if (typeof this.assessmentQuotient != 'number') {
      this.assessmentQuotient = this.roleSkillData.assessment_quotient.toFixed(
        2
      );
    } else {
      this.assessmentQuotient = this.roleSkillData.assessment_quotient.toFixed(
        2
      );
    }

    if (typeof this.certificationQuotient != 'number') {
      this.certificationQuotient = this.roleSkillData.certification_quotient.toFixed(
        2
      );
    } else {
      this.certificationQuotient = this.roleSkillData.certification_quotient.toFixed(
        2
      );
    }

    // this.roleQuotient = parseFloat(String(this.roleQuotient));
    if (!this.isSiemensInstance) {
      this.pieChartData = [
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
          y: 5 - parseFloat(this.roleQuotient),
          color: '#487eb0'
        }
      ];
      this.traineeData = [
        {
          key: 'Trained',
          y: this.roleSkillData.course_comp,
          color: '#f9ca24'
        },
        {
          key: 'Not Trained',
          y: 100 - this.roleSkillData.course_comp,
          color: '#bdc3c7'
        },
      ];
      this.certifiedData = [
        {
          key: 'Certified',
          y: this.roleSkillData.certification_comp,
          color: '#f39c12'
        },
        {
          key: 'Not Certified',
          y: 100 - this.roleSkillData.certification_comp,
          color: '#bdc3c7'
        },
      ];
    }



    this.skills.map(cur => {
      cur.available_course.map((current: any, i) => {
        current.org_data = cur.available_course_org_data[current.lex_id];

        const others = current.org_data;
        if (others === undefined) {
          return;
        } else {
          const obj = {
            name: current.content_name,
            id: current.lex_id,
            materialUrl: current.material_url,
            totalUsers:
              others[4].doc_count + others[3].doc_count + others[2].doc_count,
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
          current.orgWideData = obj;
        }
      });
    });
    this.skills.map(cur => {
      cur.available_certification.map((current: any, i) => {
        current.org_data = cur.available_certification_org_data[current.lex_id];

        const others = current.org_data;
        if (others == undefined) {
          return;
        } else {
          const obj = {
            name: current.content_name,
            id: current.lex_id,
            materialUrl: current.material_url,
            totalUsers:
              others[1] && others[1].doc_count ? others[1].doc_count : 0,
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
          current.orgWideData = obj;
        }
      });
    });
    this.loader = false;
  }
  onTabChange(selectedIndex: number) {
    this.callData();
  }

  onClickSkills(skillName) {
    this.router.navigate(['/my-skills/skill-quotient'], {
      queryParams: { skill: skillName }
    });
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
