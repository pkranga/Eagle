/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { SkillQuotientService } from '../../services';
import { FormControl, NgForm } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from '../../../../../../node_modules/rxjs/operators';
import { AutoCompleteService } from '../../services/auto-complete.service';
import { ProjectEndorsementService } from '../../services/project-endorsement.service';
import * as mySkills from '../../../../models/my-skills.model';
import { IProjectEndorsement } from '../../../../models/my-skills.model';
import { ConfigService } from '../../../../services/config.service';
// import {} from '../../images/skills-tag-cloud.png'
/**
 * CODE_REVIEW:
 * No shadow variable name
 * parseInt with a radix = 10
 *
 * nested api calls when there is no dependency.
 * that too 6 times, why cant you use a service which does this job
 * also there  is forkJoin, just in case if you dont know
 *
 * why is there no Types for any variable
 *
 * Worst code ever. You guys re-write this.
 * Any single file without a file, and the file will be deleted
 *
 */
@Component({
  selector: 'app-skill-quotient',
  templateUrl: './skill-quotient.component.html',
  styleUrls: ['./skill-quotient.component.scss']
})
export class SkillQuotientComponent implements OnInit {
  isSiemensInstance = this.configSvc.instanceConfig.features.siemens.enabled;
  // isSiemensInstance = true;
  isAdmin: mySkills.IAdmin;
  isApprover: mySkills.IApprover;
  popularSkills: mySkills.IPopularSkills[];
  rolesData: mySkills.IGetRoles[];
  allSkillsData: mySkills.IAllSkills;
  skillsData: mySkills.ISkills[];
  projectEndorsementData: mySkills.IProjectEndorsement;
  allRequest = [];
  allSkills: mySkills.IAllSkills;
  showManager: boolean;
  type: string;
  loader = true;
  role = false;
  skill = false;
  pageNo = 1;
  selectedTabIndex = 0;
  selectedInnerTabIndex = 0;
  selectedTabName: string;
  project = false;
  ref: boolean;
  filteredOptions: Array<mySkills.ISearchObj> = [];
  skillForm: FormGroup;
  searchObj = {
    skill_name: '',
    skill_id: 0,
    image_url: '',
    certification_count: 0,
    course_count: 0,
    track: ''
  };
  tagCloud: string;
  allSkillsObj = {
    search: '',
    category: '',
    horizon: '',
    criticality: '',
    pageNo: 1
  };
  skillControl = new FormControl();
  searchText: string;
  categoryFilter: string;
  horizonFilter: string;
  criticalityFilter: string;
  categoriesList: Set<string>;
  horizonList: Set<string>;
  criticalityList: Set<string>;
  criticality: Array<{
    key: string;
    doc_count: number;
  }> = [];
  categories: Array<{
    key: string;
    doc_count: number;
  }> = [];
  query = '';
  horizons: Array<{
    key: string;
    doc_count: number;
  }> = [];
  dataChunks = [];
  tagCloudData1 = [
    {
      text: 'Process Analytics Products',
      weight: '12px'
    },
    {
      text: 'Gas Chromatograph',
      weight: '25px'
    },
    {
      text: 'Bid Management',
      weight: '25px'
    },
    {
      text: 'PD Commissioning',
      weight: '18px'
    },
    {
      text: 'Risk & Opportunity Management',
      weight: '25px'
    }
  ];
  tagCloudData2: any[] = [
    {
      text: 'Intercultural Skills',
      weight: '12px'
    },
    {
      text: 'System Integration Analytics',
      weight: '18px'
    },
    {
      text: 'Electrical Analysis & studies',
      weight: '25px'
    },
    // {
    //   text: "Risk & Opportunity Management",
    //   weight: '18px'
    // },
    {
      text: 'Functional Safety',
      weight: '12px'
    }
    // {
    //   text:'Functional Safety Basic',
    //   weight: 6
    // },
    // {
    //   text:'PD Engineering Advanced',
    //   weight: 6
    // },
  ];
  pieChartData = [
    {
      key: 'Default Score',
      y: 2,
      color: '#fa8231'
    },
    {
      key: 'Certification Score',
      y: 0.82,
      color: '#f7b731'
    },
    {
      key: 'Not Scored',
      y: 2.18,
      color: '#487eb0'
    }
  ];
  lineData1 = [
    {
      key: 'Completed All Courses',
      y: 1
    },
    {
      key: 'Completed NodeJS',
      y: 2.4
    },
    {
      key: 'Completed Angular',
      y: 3.6
    },
    {
      key: 'Goal to complete Mongo DB',
      y: 4.5
    }
  ];
  // searchList:Array<any>= [];
  search = false;

  constructor(
    private projectEndorsementService: ProjectEndorsementService,
    private router: Router,
    private skillSvc: SkillQuotientService,
    public matSnackBar: MatSnackBar,
    private route: ActivatedRoute,
    private autoComplete: AutoCompleteService,
    private form1: FormBuilder,
    private configSvc: ConfigService,
    private activatedRoute: ActivatedRoute
  ) {
    this.skillControl.valueChanges.pipe(distinctUntilChanged()).subscribe((value: string) => {
      this.autoCompleteAllSkills(value, 'skill');
    });
  }
  onSkillTag(skillName) {
    this.router.navigate(['/my-skills/skill-quotient'], {
      queryParams: { skill: skillName }
    });
  }
  chartData() {
    this.lineData1 = [
      {
        key: 'Completed All Courses',
        y: 1
      },
      {
        key: 'Completed NodeJS',
        y: 2.4
      },
      {
        key: 'Completed Angular',
        y: 3.6
      },
      {
        key: 'Goal to complete Mongo DB',
        y: 4.5
      }
    ];
    this.pieChartData = [
      {
        key: 'Default Score',
        y: 2,
        color: '#fa8231'
      },
      {
        key: 'Certification Score',
        y: 0.82,
        color: '#f7b731'
      },
      {
        key: 'Not Scored',
        y: 2.18,
        color: '#487eb0'
      }
    ];
  }
  ngOnInit() {
    this.dataChunks.push(this.tagCloudData1);
    this.dataChunks.push(this.tagCloudData2);
    // let single_chunk = [];
    // this.tagCloudData.forEach((e, i) => {
    //   single_chunk.push(e);
    //   if (i % 3 == 0) {
    //     this.dataChunks.push(single_chunk);
    //     single_chunk = [];
    //   }
    // });
    // this.skillForm = new FormGroup({
    //   search: new FormControl(),
    //   categories: new FormControl(),
    //   horizon: new FormControl()
    // });
    if (this.isSiemensInstance) {
      this.showManager = true;
      this.activatedRoute.queryParamMap.subscribe(queryParams => {
        this.selectedTabName = queryParams.get('tab');

        if (this.selectedTabName === 'roles') {
          this.selectedTabIndex = 1;
        } else if (this.selectedTabName === 'endorsements' && this.showManager === true) {
          this.selectedTabIndex = 2;
        } else if (this.selectedTabName === 'faq' && this.showManager === true) {
          this.selectedTabIndex = 3;
        } else if (this.selectedTabName === 'faq' && this.showManager === false) {
          this.selectedTabIndex = 3;
        } else {
          this.selectedTabIndex = 0;
        }
      });
    } else {
      this.skillSvc.getAdmin().subscribe(res => {
        this.isAdmin = res;
        this.showManager = this.isAdmin.is_admin;
        this.activatedRoute.queryParamMap.subscribe(queryParams => {
          this.selectedTabName = queryParams.get('tab');
  
          if (this.selectedTabName === 'roles') {
            this.selectedTabIndex = 1;
          } else if (this.selectedTabName === 'endorsements' && this.showManager === true) {
            this.selectedTabIndex = 2;
          } else if (this.selectedTabName === 'approve-endorsements' && this.showManager === true) {
            this.selectedTabIndex = 3;
          } else if (this.selectedTabName === 'allSkills' && this.showManager === true) {
            this.selectedTabIndex = 4;
          } else if (this.selectedTabName === 'allSkills' && this.showManager === false) {
            this.selectedTabIndex = 2;
          } else if (this.selectedTabName === 'faq' && this.showManager === true) {
            this.selectedTabIndex = 5;
          } else if (this.selectedTabName === 'faq' && this.showManager === false) {
            this.selectedTabIndex = 3;
          } else {
            this.selectedTabIndex = 0;
          }
        });
      });
    }
    this.skillForm = this.form1.group({
      search: [''],
      horizon: [''],
      categories: [''],
      criticality: ['']
    });
    // this.skillSvc.getApprover().subscribe(res => {
    //   this.isApprover = res;
    //   this.showManager = this.isApprover.is_approver;
    // });

    this.getSkills();
    if (!this.isSiemensInstance){
      this.getPopularSkills();
    }
    this.getRoles();
    this.type = 'user';
    this.chartData();
    this.getProjectEndorsement(this.type);
    this.skillSvc.allSkills(this.allSkillsObj).subscribe(response => {
      this.allSkillsData = response;
      this.allSkills = response.skill_list;
      if (!this.isSiemensInstance) {
        this.categories = response.category_wise_skill_count;
        const category = [];
        this.categories.map(categoryKey => {
          category.push(categoryKey.key);
        });
        this.categoriesList = new Set(category);

        this.horizons = response.horizon_wise_skill_count;
        const horizon = [];
        this.horizons.forEach(horizonKey => {
          horizon.push(horizonKey.key);
        });
        this.horizonList = new Set(horizon);
      }
    });
    // const tabIndex = this.route.snapshot.queryParamMap.get('tab');
    // this.ref = this.route.snapshot.queryParamMap.get('ref') === 'close' ? true : false;
    // this.selectedTabIndex = parseInt(tabIndex, 10);
    // if (this.selectedTabIndex === 0) {
    //   this.getSkills();
    //   this.getPopularSkills();
    //   this.chartData();
    //   // this .loader = false;
    // } else if (this.selectedTabIndex === 1) {
    //   setTimeout(() => {
    //     this.getRoles();

    //     // this .loader = false;
    //   }, 1000);

    // } else if (this.selectedTabIndex === 2 && this.showManager === true) {
    //   this.type = 'user';
    //   this.getProjectEndorsement(this.type);
    // } else if (this.selectedTabIndex === 2 && this.showManager === false) {
    //   this.getAllSkills(this.allSkillsObj);
    //   // this .loader = false;
    // } else if (this.selectedTabIndex === 4 && this.showManager === true) {
    //   this.getAllSkills(this.allSkillsObj);
    //   // this .loader = false;
    // }
    // this .loader = false;
  }
  onCreateRole() {
    this.router.navigate(['/my-skills/add-role']);
  }
  onCreateRequest() {
    this.router.navigate(['/my-skills/create-project-endorsement']);
  }
  openSnackBar() {
    this.matSnackBar.open('Successfully Added Role', 'close', {
      duration: 3000
    });
  }

  getSkills() {
    this.skillSvc.getSkills().subscribe(skillsResponse => {
      this.skillsData = skillsResponse;
      this.loader = false;
    });
  }

  getRoles() {
    this.skillSvc.getRoles().subscribe(rolesResponse => {
      this.rolesData = rolesResponse;
    });
  }

  getPopularSkills() {
    this.skillSvc.popularSkills().subscribe(popularSkillResponse => {
      this.popularSkills = popularSkillResponse;
    });
  }

  getAllSkills(allSkillsObj) {
    this.skillSvc.allSkills(allSkillsObj).subscribe(response => {
      this.allSkillsData = response;
      this.allSkills = response.skill_list;
      this.categories = response.category_wise_skill_count;
      this.horizons = response.horizon_wise_skill_count;
      this.loader = false;
    });
  }

  getProjectEndorsement(type) {
    this.projectEndorsementService.getList(type).subscribe(res => {
      this.projectEndorsementData = res;
    });
  }
  onPress(event: any) {
    if (event.keyCode === 13) {
      if (!this.isSiemensInstance) {
        this.searchAllSkills(event.target.value);
      } else {
        this.searchSkills(event.target.value);
      }
    }
  }
  onTabChange(selectedIndex) {
    this.selectedTabIndex = selectedIndex;
    if (!this.isSiemensInstance) {
      if (this.selectedTabIndex === 0) {
        this.getSkills();
        this.getPopularSkills();
        this.chartData();
        this.router.navigate(['/my-skills'], {
          queryParams: { tab: 'skills' }
        });
      } else if (this.selectedTabIndex === 1) {
        this.skillSvc.getRoles().subscribe(rolesResponse => {
          this.rolesData = rolesResponse;
          if (this.rolesData.length === 0) {
            this.onCreateRole();
          } else {
            this.router.navigate(['/my-skills'], {
              queryParams: { tab: 'roles' }
            });
          }
        });
      } else if (this.selectedTabIndex === 2 && this.showManager === true) {
        this.type = 'user';
        this.getProjectEndorsement(this.type);
        // this.allRequest = this.projectEndorsementData.all_request
        if (this.projectEndorsementData.all_request.length === 0) {
          this.onCreateRequest();
        } else {
          this.router.navigate(['/my-skills'], {
            queryParams: { tab: 'endorsements' }
          });
        }
      } else if (this.selectedTabIndex === 3 && this.showManager === true) {
        this.router.navigate(['/my-skills'], {
          queryParams: { tab: 'approve-endorsements' }
        });
      } else if (this.selectedTabIndex === 2 && this.showManager === false) {
        this.getAllSkills(this.allSkillsObj);
        this.router.navigate(['/my-skills'], {
          queryParams: { tab: 'allSkills' }
        });
      } else if (this.selectedTabIndex === 4 && this.showManager === true) {
        this.getAllSkills(this.allSkillsObj);
        this.router.navigate(['/my-skills'], {
          queryParams: { tab: 'allSkills' }
        });
      } else if (this.selectedTabIndex === 5 && this.showManager === true) {
        this.router.navigate(['/my-skills'], {
          queryParams: { tab: 'faq' }
        });
      } else if (this.selectedTabIndex === 3 && this.showManager === false) {
        this.router.navigate(['/my-skills'], {
          queryParams: { tab: 'faq' }
        });
      }
    } else {
      if (this.selectedTabIndex === 0) {
        this.getSkills();
        this.chartData();
        this.router.navigate(['/my-skills'], {
          queryParams: { tab: 'skills' }
        });
      } else if (this.selectedTabIndex === 1) {
        this.skillSvc.getRoles().subscribe(rolesResponse => {
          this.rolesData = rolesResponse;
          if (this.rolesData.length === 0) {
            this.onCreateRole();
          } else {
            this.router.navigate(['/my-skills'], {
              queryParams: { tab: 'roles' }
            });
          }
        });
      } else if (this.selectedTabIndex === 2) {
        this.selectedInnerTabIndex = 0;
        this.type = 'user';
        this.getProjectEndorsement(this.type);
        if (this.projectEndorsementData.all_request.length === 0) {
          this.onCreateRequest();
        } else {
          this.router.navigate(['/my-skills'], {
            queryParams: { tab: 'endorsements' }
          });
        }
      } else if (this.selectedTabIndex === 3) {
        this.router.navigate(['/my-skills'], {
          queryParams: { tab: 'faq' }
        });
      } else if (this.selectedTabIndex === 3) {
        this.router.navigate(['/my-skills'], {
          queryParams: { tab: 'faq' }
        });
      }
    }
  }
  autoCompleteAllSkills(value, field) {
    this.autoComplete.search(field, value).subscribe(res => {
      this.filteredOptions = [];
      res.map(cur => {
        this.searchObj = {
          skill_name: cur.skill_name,
          skill_id: cur.skill_id,
          image_url: cur.image_url,
          certification_count: cur.certification_count,
          course_count: cur.course_count,
          track: cur.track
        };
        this.filteredOptions.push(this.searchObj);
      });
    });
  }
  searchAllSkills(value) {
    this.loader = true;
    this.searchText = value;
    this.allSkillsObj = {
      search: this.searchText,
      category: this.categoryFilter,
      horizon: this.horizonFilter,
      criticality: this.criticalityFilter,
      pageNo: 1
    };

    this.getAllSkills(this.allSkillsObj);
  }

  searchSkills(skillName) {
    this.router.navigate(['/my-skills/skill-quotient'], {
      queryParams: { skill: skillName }
    });
  }
  filter(filterName, type) {
    this.loader = true;
    if (this.isSiemensInstance) {
      if (type === 'criticality') {
        this.criticalityFilter = filterName;
      }
    } else {
      if (type === 'category') {
        this.categoryFilter = filterName;
      } else {
        this.horizonFilter = filterName;
      }
    }
    this.allSkillsObj = {
      search: this.searchText,
      category: this.categoryFilter,
      horizon: this.horizonFilter,
      criticality: this.criticalityFilter,
      pageNo: 1
    };
    this.getAllSkills(this.allSkillsObj);
  }
  viewAllSkills() {
    this.router.navigate(['/my-skills/all-skills']);
  }
  reset() {
    this.loader = true;
    // this .searchText = '';
    this.skillForm.controls.search.setValue('');
    this.skillForm.controls.categories.setValue('');
    this.skillForm.controls.horizon.setValue('');
    this.skillForm.controls.criticality.setValue('');
    // this .skillForm.value.allSkills = '';
    this.categoryFilter = '';
    this.horizonFilter = '';
    this.categoryFilter = '';
    this.allSkillsObj = {
      search: '',
      category: '',
      horizon: '',
      criticality: '',
      pageNo: 1
    };

    this.getAllSkills(this.allSkillsObj);
  }
  createSkillGroup() {
    this.router.navigate(['/my-skills/add-skill-group']);
  }
  more() {
    this.pageNo += 1;
    this.allSkillsObj = {
      search: '',
      category: '',
      horizon: '',
      criticality: '',
      pageNo: this.pageNo
    };
    this.getAllSkills(this.allSkillsObj);
  }
  refreshRole() {
    setTimeout(() => {
      this.skillSvc.getRoles().subscribe(res => {
        this.rolesData = res;
      });
    }, 1000);
  }
}
