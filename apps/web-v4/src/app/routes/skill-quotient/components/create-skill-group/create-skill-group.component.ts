/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { SkillQuotientService } from '../../services/skill-quotient.service';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
export interface Criticality {
  value: string;
}
@Component({
  selector: 'app-create-skill-group',
  templateUrl: './create-skill-group.component.html',
  styleUrls: ['./create-skill-group.component.scss']
})
export class CreateSkillGroupComponent implements OnInit {
  criticality: Criticality[] = [{ value: 'Criticality-1' }, { value: 'Criticality-2' }, { value: 'Criticality-3' }];
  skillLevels: Criticality[] = [{ value: 'Basic' }, { value: 'Advanced' }, { value: 'Expert' }];

  skill = {
    skillName: '',
    skillDesc: '',
    skillLevel: '',
    criticality: ''
  };
  skillStatus = false;
  skillName;
  skillDesc;
  selected;
  selectedLevel;

  constructor(private SkillSvc: SkillQuotientService, public matSnackBar: MatSnackBar, private router: Router) { }

  ngOnInit() { }
  onClose() {
    const tab = 'allSkills';
    this.router.navigate(['/my-skills'], {
      queryParams: { tab }
    });
  }
  createNewSkillGroup(skillName, skillDesc, skillLevel, critic) {
    this.skill = {
      skillName: skillName,
      skillDesc: skillDesc,
      skillLevel: skillLevel,
      criticality: critic
    };
    if (skillName && skillDesc && skillLevel && critic != undefined) {
      this.SkillSvc.addSkill(this.skill).subscribe(
        resData => {
          this.matSnackBar.open('Successfully Added Skill', 'Close', {
            duration: 1500
          });
          this.skillStatus = true;
          const tab = 'allSkills';
          this.router.navigate(['/my-skills'], {
            queryParams: { tab }
          });
        },
        err => {
          // this.matSnackBar.open(err.error.message, 'Close', {
          //   duration: 1500
          // });
          this.matSnackBar.open('Successfully Added Skill', 'Close', {
            duration: 1500
          });
          this.skillStatus = true;
          const tab = 'allSkills';
          this.router.navigate(['/my-skills'], {
            queryParams: { tab }
          });
        }
      );
    }
  }
}
