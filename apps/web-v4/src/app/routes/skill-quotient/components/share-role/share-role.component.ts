/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SkillQuotientService } from '../../services/skill-quotient.service';
import { AutoCompleteService } from '../../services/auto-complete.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormControl, NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { IRoleQuotientResponse, ISearchAutocomplete } from '../../../../models/my-skills.model';
import { debounceTime, distinctUntilChanged } from '../../../../../../node_modules/rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
@Component({
  selector: 'app-share-role',
  templateUrl: './share-role.component.html',
  styleUrls: ['./share-role.component.scss']
})
export class ShareRoleComponent implements OnInit {

  selectable = true;
  roleId: string;
  shareControl = new FormControl();
  filteredOptions = [];
  roleQuotientData: IRoleQuotientResponse;
  roleName: string;
  roleSkills = [];
  searchText: string;
  options: ISearchAutocomplete;
  selectedSkills: Array<any> = [];
  emailIdList: Array<any> = [];
  noRoles = false;
  roleStatus = false;
  shareForm: FormGroup;
  removable = true;
  skill_id: string;
  loader = true;

  shareRole = {
    role_name: '',
    role_id: '',
    email_id: [''],
    description: ''
  };
  @ViewChild('emailInput', { static: false }) emailInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;
  constructor(
    private route: ActivatedRoute,
    private ac: AutoCompleteService,
    private snackBar: MatSnackBar,
    private _formBuilder: FormBuilder,
    private SkillSvc: SkillQuotientService,
    private router: Router,
    private form1: FormBuilder,

  ) {
    this.shareControl.valueChanges.pipe(

      distinctUntilChanged()
    )
      .subscribe((value: string) => {
        this.autoCompleteEmailId(value, 'assign_role');
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

    this.shareForm = new FormGroup({
      roleName: new FormControl(),
      message: new FormControl()
    });

    this.shareForm = this.form1.group({
      roleName: [''],
      emailId: [''],
      message: ''
    });

  }
  onClose() {
    const tab = 'roles';
    this.router.navigate(['my-skills'], {
      queryParams: { tab }
    });
  }
  openSnackBar1() {
    this.snackBar.open('Successfully shared role', 'close', {
      duration: 3000
    });
  }

  autoCompleteAllSkills($event, type) {
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
        this.emailIdList.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.shareControl.setValue(null);
    }
  }
  remove(emailId): void {
    const index = this.emailIdList.indexOf(emailId);

    if (index >= 0) {
      this.emailIdList.splice(index, 1);
    }
  }
  onOptionSelected(emailId) {
    this.emailIdList.push(emailId);
    this.emailInput.nativeElement.value = '';
    this.shareControl.setValue(null);
  }

  onNoRoles() {
    this.noRoles = true;
  }
  onCreateRole() {
    this.noRoles = false;
  }
  autoCompleteEmailId(text, field) {
    this.ac.search(field, text).subscribe(res => {
      this.filteredOptions = res;
    });
  }
  editRole(roleName, message) {
    this.shareRole = {
      role_name: roleName,
      role_id: this.roleId,
      email_id: this.emailIdList,
      description: message
    }
    if (this.emailIdList.length === 0) {
      this.snackBar.open('Invalid Email Id', 'close', {
        duration: 3000
      });
    }
    else {
      this.SkillSvc.shareRole(this.shareRole).subscribe(response => {
        this.openSnackBar1();
        const tab = 'roles';
        this.router.navigate(['my-skills'], {
          queryParams: { tab }
        });
      }

      );
    }

  }
}
