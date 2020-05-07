/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AutoCompleteService } from '../../services/auto-complete.service';
import { MatSnackBar } from '@angular/material';
import { ProjectEndorsementService } from '../../services/project-endorsement.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfigService } from '../../../../services/config.service';
@Component({
  selector: 'app-create-project-endorsement',
  templateUrl: './create-project-endorsement.component.html',
  styleUrls: ['./create-project-endorsement.component.scss']
})
export class CreateProjectEndorsementComponent implements OnInit {
  isSiemensInstance = this.configSvc.instanceConfig.features.siemens.enabled;
  // isSiemensInstance = true;
  requestForm: FormGroup;
  skill_list = [];
  project_code_list = [];

  approver_email_id_list = [];
  autocompleteFieldTypeMapping = {
    employee: 'approver_email_id',
    skill: 'skill',
    project_code: 'project_code'
  };
  skill;
  endorsementDetails: any;
  project: boolean;
  type = 'user';
  approver_email_id;
  project_code: any;
  description;
  loader = true;

  constructor(
    private ac: AutoCompleteService,
    private router: Router,
    private snackBar: MatSnackBar,
    private projectEndorsementService: ProjectEndorsementService,
    private route: ActivatedRoute,
    private configSvc: ConfigService
  ) { }

  ngOnInit() {
    if (this.isSiemensInstance) {
      this.requestForm = new FormGroup({
        skill: new FormControl('', Validators.required),
        approver_email_id: new FormControl('', Validators.required),
        level: new FormControl('', Validators.required),
        description: new FormControl('', Validators.required)
      });
    } else {
      this.requestForm = new FormGroup({
        skill: new FormControl('', Validators.required),
        approver_email_id: new FormControl('', Validators.required),
        project_code: new FormControl('', Validators.required),
        description: new FormControl('', Validators.required)
      });
    }

    this.loader = false;
  }

  onAutoCompleteFieldChange(value, field) {
    this.ac.search(field, value).subscribe(res => {
      this[`${this.autocompleteFieldTypeMapping[field]}_list`] = res;
    });
  }
  noProject() {
   
    this.projectEndorsementService.getList(this.type).subscribe(res => {
      this.endorsementDetails = res;
      if (this.endorsementDetails.all_request.length > 0) {
        this.project = false;
        const tab = 'endorsements';
        this.router.navigate(['/my-skills'], {
          queryParams: { tab }
        });
      } else {
        this.project = true;
      }
     
    });
  }

  displaySkill(obj) {
    if (obj) {
      return obj.skill_name;
    }
    return '';
  }
  displayProjectCode(obj) {
    if (obj) {
      return obj.project_code;
    }
    return '';
  }
  displayApproverEmail(obj) {
    if (obj) {
      return obj.emailId;
    }
    return '';
  }
  onCreate() {
    this.project = false;
  }

  createRequest(myFormData) {
    this.project = false;
    if (this.isSiemensInstance) {
      if (myFormData.status === 'INVALID') {
        return;
      }
      const values = myFormData.value;
      if (!values.skill.skill_id || values.skill.skill_id === '') {
        this.snackBar.open('Invalid Skill', 'Close', { duration: 1500 });
        return;
      }
      if (!values.approver_email_id.emailId || values.approver_email_id.emailId === '') {
        this.snackBar.open('Invalid Approver Email Id', 'Close', {
          duration: 1500
        });
        return;
      }
      if (!values.level) {
        this.snackBar.open('Invalid level', 'Close', { duration: 1500 });
        return;
      }
      if (!values.description) {
        this.snackBar.open('Invalid Description', 'Close', { duration: 1500 });
        return;
      }
      const postObj = {
        skill_id: values.skill.skill_id,
        approver_email_id: values.approver_email_id.emailId,
        project_code: values.level,
        description: values.description,
        skill_name: values.skill.skill_name
      };
      this.projectEndorsementService.add(postObj).subscribe(
        res => {
          this.snackBar.open('Request Sent', 'Close', { duration: 1500 });
          const tab = 'endorsements';
          this.router.navigate(['/my-skills'], {
            queryParams: { tab }
          });
        },
        err => {
          this.snackBar.open('Invalid level', 'Close', { duration: 1500 });
        }
      );
    }
    if (!this.isSiemensInstance) {
      if (myFormData.status === 'INVALID') {
        return;
      }
      const values = myFormData.value;
      if (!values.skill.skill_id || values.skill.skill_id === '') {
        this.snackBar.open('Invalid Skill', 'Close', { duration: 1500 });
        return;
      }
      if (!values.approver_email_id.emailId || values.approver_email_id.emailId === '') {
        this.snackBar.open('Invalid Approver Email Id', 'Close', {
          duration: 1500
        });
        return;
      }
      if (!values.project_code) {
        this.snackBar.open('Invalid Project Code', 'Close', { duration: 1500 });
        return;
      }
      if (!values.description) {
        this.snackBar.open('Invalid Description', 'Close', { duration: 1500 });
        return;
      }
      const postObj = {
        skill_id: values.skill.skill_id,
        approver_email_id: values.approver_email_id.emailId,
        project_code: values.project_code,
        description: values.description,
        skill_name: values.skill.skill_name
      };
      this.projectEndorsementService.add(postObj).subscribe(
        res => {
          this.snackBar.open('Request Sent', 'Close', { duration: 1500 });
          const tab = 'endorsements';
          this.router.navigate(['my-skills'], {
            queryParams: { tab }
          });
        },
        err => {
          this.snackBar.open('Invalid Project Code', 'Close', { duration: 1500 });
        }
      );
    }
  }
}
