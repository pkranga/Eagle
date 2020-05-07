/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SkillQuotientService } from '../../services/skill-quotient.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { IRoleQuotientResponse, ISearchAutocomplete } from '../../../../models/my-skills.model';
import { MatChipInputEvent } from '@angular/material/chips';
import { FormControl, NgForm } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from '../../../../../../node_modules/rxjs/operators';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
@Component({
  selector: 'app-edit-role',
  templateUrl: './edit-role.component.html',
  styleUrls: ['./edit-role.component.scss']
})
export class EditRoleComponent implements OnInit {
  selectable = true;
  roleId: string;
  myControl = new FormControl();
  roleQuotientData: IRoleQuotientResponse;
  roleName: string;
  roleSkills = [];
 editRoleControl = new FormControl();
  searchText: string;
  options: ISearchAutocomplete;
  selectedSkills: Array<any> = [];
  noRoles = false;
  roleStatus = false;
  removable = true;
  skill_id: string;
  loader = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  updateRole = {
    role_name: '',
    skill_id: [''],
    role_id: ''
  };
  @ViewChild('skillInput', { static: false }) skillInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;
  constructor(
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private _formBuilder: FormBuilder,
    private SkillSvc: SkillQuotientService,
    private router: Router
  ) { 
    this.editRoleControl.valueChanges.pipe(

      distinctUntilChanged()
    )
      .subscribe((value: string) => {
        this.onAutoComplete(value);
      });
  }

  ngOnInit() {
    this.roleId = this.route.snapshot.queryParamMap.get('roleId');
    this.SkillSvc.getRoleQuotient(this.roleId).subscribe(response => {
      this.roleQuotientData = response;
      this.roleName = this.roleQuotientData.role_quotient_details.role_name;
      this.roleId = this.roleQuotientData.role_quotient_details.role_id;
      this.roleQuotientData.role_quotient_details.skills.map(cur => {
        this.selectedSkills.push({
          skill_id: cur.skill_id,
          skill_name: cur.skill_name
        });
      });
      this.loader = false;
    });

    this.myControl = new FormControl();
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }

  openSnackBar1() {
    this.snackBar.open('Name should not be empty', 'close', {
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
  add(event: MatChipInputEvent): void {
    // Add fruit only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our fruit
      if ((value || '').trim()) {
        this.selectedSkills.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.myControl.setValue(null);
    }
  }
  remove(skill): void {
    this.selectedSkills = this.selectedSkills.filter(s => s.skill_id != skill.skill_id);
  }
  onOptionSelected(skill) {
    this.selectedSkills.push(skill);
    this.skillInput.nativeElement.value = '';
    this.myControl.setValue(null);
  }

  onNoRoles() {
    this.noRoles = true;
  }
  onCreateRole() {
    this.noRoles = false;
  }
  editRole(roleName, selectedSkills) {
    this.updateRole = {
      role_name: roleName,
      skill_id: this.selectedSkills.map(s => s.skill_id),
      role_id: this.roleId
    };

    if (roleName != undefined && selectedSkills != undefined && /\S/.test(roleName) && /\S/.test(selectedSkills)) {
      this.SkillSvc.updateRole(this.updateRole).subscribe(resData => {
        this.snackBar.open('Role Updated Successfully', 'Close', {
          duration: 1500
        });
        const tab = 'roles';
        this.router.navigate(['my-skills'], {
          queryParams: { tab }
        });
        this.loader = false;
      });
    } else if (roleName === '') {
      this.openSnackBar1();
    } else if (selectedSkills.length === 0) {
      this.snackBar.open('Select a Skill for your Role', 'Close', {
        duration: 1500
      });
    } else if (roleName.trim() || selectedSkills.trim()) {
      this.openSnackBar1();
    }
  }
}
