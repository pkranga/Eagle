/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SkillQuotientService } from '../../services';
import * as mySkills from '../../../../models/my-skills.model';
import { Router } from '@angular/router';
@Component({
  selector: 'app-skills-tab',
  templateUrl: './skills-tab.component.html',
  styleUrls: ['./skills-tab.component.scss']
})
export class SkillsTabComponent implements OnInit {
  filteredOptions;
  skillForm: FormGroup;
  searchText: string;
  allSkillsData: mySkills.IAllSkills;
  allSkills: mySkills.IAllSkills;
  allSkillsObj = {
    search: ''
  };
  imageUrl: '../../images/skilltag.PNG';
  Skills = [
    {
      skill_name: 'Bid Management',
      image_url: 'https://www.elegantthemes.com/blog/wp-content/uploads/2018/09/soft-skills.png',
      course_count: 10,
      certification_count: 3,
      criticality: 'Criticality-1'
    },
    {
      skill_name: 'Organizing and Planning',
      image_url: 'https://www.elegantthemes.com/blog/wp-content/uploads/2018/09/soft-skills.png',
      course_count: 15,
      certification_count: 5,
      criticality: 'Criticality-1'
    }
  ];
  popularSkills = [
    {
      skill_name: 'PD_Continuous Gas Analyzer (CGA)',
      image_url: 'https://www.elegantthemes.com/blog/wp-content/uploads/2018/09/soft-skills.png',
      course_count: 10,
      certification_count: 3,
      criticality: 'Criticality-1'
    },
    {
      skill_name: 'PD_System Integration Analytics',
      image_url: 'https://www.elegantthemes.com/blog/wp-content/uploads/2018/09/soft-skills.png',
      course_count: 15,
      certification_count: 5,
      criticality: 'Criticality-1'
    },
    {
      skill_name: 'PD_Special Applications Laser',
      image_url: 'https://www.elegantthemes.com/blog/wp-content/uploads/2018/09/soft-skills.png',
      course_count: 12,
      certification_count: 8,
      criticality: 'Criticality-2'
    },
    {
      skill_name: 'PD_Process Analytics Products',
      image_url: 'https://www.elegantthemes.com/blog/wp-content/uploads/2018/09/soft-skills.png',
      course_count: 19,
      certification_count: 4,
      criticality: 'Criticality-2'
    },
    {
      skill_name: 'PD_Gas Chromatograph',
      image_url: 'https://www.elegantthemes.com/blog/wp-content/uploads/2018/09/soft-skills.png',
      course_count: 11,
      certification_count: 2,
      criticality: 'Criticality-1'
    }
  ];
  constructor(private form1: FormBuilder, private skillSvc: SkillQuotientService, private router: Router) { }

  ngOnInit() {
    this.skillForm = this.form1.group({
      search: ['', Validators]
    });
  }
  viewAllSkills() {
    this.router.navigate(['/myskills/all-skills']);
  }
  getAllSkills(allSkillsObj) {
    this.skillSvc.allSkills(allSkillsObj).subscribe(response => {
      this.allSkillsData = response;
      this.allSkills = response.skill_list;
      // this.loader = false;
    });
  }
  onPress(event: any) {
    if (event.keyCode === 13) {
      this.searchAllSkills(this.skillForm.value.search, 'skill');
    }
  }
  searchAllSkills(value, data: string) {
    // this.loader = true;
    this.searchText = value;
    this.allSkillsObj = {
      search: this.searchText
    };

    this.getAllSkills(this.allSkillsObj);
  }
  autoCompleteAllSkills(event, string) {

  }
}
