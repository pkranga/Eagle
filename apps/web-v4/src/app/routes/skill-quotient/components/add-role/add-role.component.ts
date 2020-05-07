/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { SkillQuotientService } from '../../services/skill-quotient.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import * as mySkills from '../../../../models/my-skills.model';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.scss']
})
export class AddRoleComponent implements OnInit {
  availableRoles: mySkills.IGetExistingRoles[];
  rolesData: mySkills.IGetRoles[];
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  myControl;
  options: any;
  searchText;
  skillId: string;
  roleStatus = false;
  selectedSkillsId = [];
  selectedSkills: any = [];
  noRoles = false;
  addRole = {
    roleId: '',
    type: ''
  };
  selectable = true;
  removable = true;

  createRole = {
    roleName: 'testing1',
    skillId: [''],
    type: ''
  };
  loader = true;
  constructor(
    private SkillSvc: SkillQuotientService,
    private _formBuilder: FormBuilder,
    public matSnackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    this.SkillSvc.getAvailableRoles().subscribe(response => {
      this.availableRoles = response;
      this.loader = false;
    });
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this.myControl = new FormControl();
  }

  openSnackBar1() {
    this.matSnackBar.open('Name should not be empty', 'close', {
      duration: 3000
    });
  }
  onAutoComplete($event) {
    if ($event != undefined) {
      this.searchText = $event;
      this.SkillSvc.autocomplete(this.searchText).subscribe(response => {
        this.options = response;
      });
    }
  }

  displayFn() {
    return '';
  }

 
  remove(skill): void {
    this.selectedSkills = this.selectedSkills.filter(s => s.skillId != skill.skillId);
  }
  onOptionSelected(skill) {
    this.selectedSkills.push(skill);
  }
  addPredefinedRole(roleId) {
    this.addRole = {
      roleId,
      type: 'user_common'
    };
    if (roleId != undefined) {
      const tab ='roles';
      this.SkillSvc.getAddRoles(this.addRole).subscribe(resData => {
        this.matSnackBar.open('Successfully Added Role', 'Close', {
          duration: 1500
        });
        this.roleStatus = true;

        this.router.navigate(['/my-skills'], {
          queryParams: { tab }
        });
      });
    }
  }
  onNoRoles() {
    this.SkillSvc.getRoles().subscribe(response => {
      this.rolesData = response;
      if (this.rolesData.length != 0) {
        this.noRoles = false;
        const tab = 'roles';
        this.router.navigate(['/my-skills'], {
          queryParams: { tab }
        });
      } else {
        this.noRoles = true;
      }
    });
  }
  onCreateRole() {
    this.noRoles = false;
  }
  createNewRole(roleName, skillId) {
    this.createRole = {
      roleName,
      skillId: this.selectedSkills.map(s => s.skill_id),
      type: 'user'
    };
    if (roleName != undefined && skillId != undefined && /\S/.test(roleName) && /\S/.test(skillId)) {
      this.SkillSvc.getAddRoles(this.createRole).subscribe(
        resData => {
          this.matSnackBar.open('Sucessfully Added Role', 'Close', {
            duration: 1500
          });
          this.roleStatus = true;
          const tab= 'roles';
          this.router.navigate(['/my-skills'], {
            queryParams: { tab }
          });
        },
        err => {
          this.matSnackBar.open(err.error.message, 'Close', {
            duration: 1500
          });
        }
      );
    } else if (roleName === undefined || skillId === undefined) {
      this.openSnackBar1();
    } else if (roleName.trim() || skillId.trim()) {
      this.openSnackBar1();
    }
  }
}
