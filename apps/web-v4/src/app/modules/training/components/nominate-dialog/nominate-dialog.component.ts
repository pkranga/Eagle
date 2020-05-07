/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, ViewChild, TemplateRef, Inject } from '@angular/core';
import { COMMA, ENTER, SEMICOLON } from '@angular/cdk/keycodes';
import { MatChipInputEvent, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { ITrainingOffering } from '../../../../models/content.model';
import { TrainingsService } from '../../../../services/trainings.service';
import { ConfigService } from '../../../../services/config.service';

@Component({
  selector: 'app-nominate-dialog',
  templateUrl: './nominate-dialog.component.html',
  styleUrls: ['./nominate-dialog.component.scss']
})
export class NominateDialogComponent implements OnInit {
  @ViewChild('successSnackbar', { static: true }) successSnackbarRef: TemplateRef<any>;
  @ViewChild('errorSnackbar', { static: true }) errorSnackbarRef: TemplateRef<any>;
  validSuffix = this.configSvc.instanceConfig.platform.validDomainMail;
  errorType: 'NoDomain' | 'InvalidDomain' | 'None' = 'None';
  sendStatus: 'none' | 'success' | 'sending' | 'error' = 'none';
  emailIds: {
    email: string;
    prefix: string;
  }[] = [];
  readonly separatorKeyCodes: number[] = [COMMA, ENTER, SEMICOLON];

  constructor(
    @Inject(MAT_DIALOG_DATA) public offering: ITrainingOffering,
    public dialogRef: MatDialogRef<NominateDialogComponent>,
    private snackBar: MatSnackBar,
    private trainingsSvc: TrainingsService,
    private configSvc: ConfigService
  ) {}

  ngOnInit() {}

  add(event: MatChipInputEvent) {
    const input = event.input;
    const value = event.value.trim();
    if (value) {
      const indexOfAt = value.indexOf('@');
      let suffix = '';
      let prefix = value;
      if (indexOfAt > -1) {
        suffix = value.substring(indexOfAt + 1);
        prefix = value.substring(0, indexOfAt);
      }
      if (this.validSuffix[suffix]) {
        this.errorType = 'None';
        this.emailIds.push({ email: value, prefix });
        if (input) {
          input.value = '';
        }
      } else if (suffix === '') {
        this.errorType = 'NoDomain';
      } else {
        this.errorType = 'InvalidDomain';
      }
    }
  }

  remove(email: string): void {
    this.emailIds = this.emailIds.filter(emailObj => emailObj.email !== email);
  }

  send() {
    const emails = this.emailIds.map(emailObj => emailObj.email);
    this.sendStatus = 'sending';
    this.dialogRef.disableClose = true;

    const nominateSubsription = this.trainingsSvc.nominateUsers(emails, this.offering.offering_id).subscribe(
      () => {
        this.sendStatus = 'success';
        this.snackBar.openFromTemplate(this.successSnackbarRef);
      },
      () => {
        this.sendStatus = 'error';
        this.dialogRef.disableClose = false;
        this.snackBar.openFromTemplate(this.errorSnackbarRef);
      },
      () => {
        this.dialogRef.disableClose = false;
        this.dialogRef.close('submitted');
        nominateSubsription.unsubscribe();
      }
    );
  }
}
