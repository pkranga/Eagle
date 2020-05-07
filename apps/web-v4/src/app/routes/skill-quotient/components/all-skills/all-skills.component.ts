/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SkillQuotientService } from '../../services';
import * as mySkills from '../../../../models/my-skills.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AutoCompleteService } from '../../services/auto-complete.service';
import { FormControl, NgForm } from '@angular/forms';
import { ConfigService } from '../../../../services/config.service';

import { debounceTime, distinctUntilChanged } from '../../../../../../node_modules/rxjs/operators';
@Component({
  selector: 'app-all-skills',
  templateUrl: './all-skills.component.html',
  styleUrls: ['./all-skills.component.scss']
})
export class AllSkillsComponent implements OnInit {
  isSiemensInstance = this.configSvc.instanceConfig.features.siemens.enabled;
  // isSiemensInstance = true;
  loader = true;
  skillForm: FormGroup;
  searchText: string;
  allSkillsData: mySkills.IAllSkills;
  allSkills: mySkills.IAllSkills;
  skillControl = new FormControl();
  filteredOptions: Array<mySkills.ISearchObj> = [];
  pageNo = 1;
  searchObj = {
    skill_name: '',
    skill_id: 0,
    image_url: '',
    certification_count: 0,
    course_count: 0,
    track: ''
  };
  allSkillsObj = {
    search: '',
    category: '',
    horizon: '',
    criticality: '',
    pageNo: 1
  };
  criticality: Array<{
    key: string;
    doc_count: number;
  }> = [];
  categories: Array<{
    key: string;
    doc_count: number;
  }> = [];
  horizons: Array<{
    key: string;
    doc_count: number;
  }> = [];
  categoryFilter: string;
  horizonFilter: string;
  criticalityFilter: string;
  categoriesList: Set<string>;
  criticalityList = ['Criticality-1', 'Criticality-2', 'Criticality-3'];
  constructor(
    private form1: FormBuilder,
    private skillSvc: SkillQuotientService,
    private router: Router,
    private autoComplete: AutoCompleteService,
    private activatedRoute: ActivatedRoute,
    private configSvc: ConfigService
  ) {
    this.skillControl.valueChanges.pipe(distinctUntilChanged()).subscribe((value: string) => {
      this.autoCompleteAllSkills(value, 'skill');
    });
  }

  ngOnInit() {
    this.skillForm = this.form1.group({
      search: [''],
      horizon: [''],
      categories: [''],
      criticality: ['']
    });
    this.getAllSkills(this.allSkillsObj);
  }

  reset() {
    this.loader = true;
    // this .searchText = '';
    this.skillForm.controls.search.setValue('');
    this.skillForm.controls.categories.setValue('');
    this.skillForm.controls.horizon.setValue('');
    this.skillForm.controls.criticality.setValue('');
    // this .skillForm.value.allSkills = '';
    // this .categoryFilter = '';
    // this .horizonFilter = '';
    this.allSkillsObj = {
      search: '',
      category: '',
      horizon: '',
      criticality: '',
      pageNo: 1
    };

    this.getAllSkills(this.allSkillsObj);
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
  onPress(event: any) {
    if (event.keyCode === 13) {
      this.searchAllSkills(event.target.value);
    }
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
  filter(filterName, type) {
    this.loader = true;
    if (this.isSiemensInstance) {
      this.criticalityFilter = filterName;
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
  createSkillGroup() {
    this.router.navigate(['/my-skills/add-skill-group']);
  }
}
