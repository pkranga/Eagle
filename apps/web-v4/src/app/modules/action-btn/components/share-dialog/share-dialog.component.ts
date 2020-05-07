/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Inject } from '@angular/core';
import { COMMA, ENTER, SEMICOLON } from '@angular/cdk/keycodes';
import {
  MatSnackBar,
  MAT_DIALOG_DATA,
  MatChipInputEvent,
  MatDialogRef
} from '@angular/material';
import { IContent } from '../../../../models/content.model';
import { ShareService } from '../../../../services/share.service';
import { TelemetryService } from '../../../../services/telemetry.service';
import { ConfigService } from '../../../../services/config.service';

interface IUserShareId {
  email: string;
  color: string;
  suffix: string;
}
@Component({
  selector: 'app-share-dialog',
  templateUrl: './share-dialog.component.html',
  styleUrls: ['./share-dialog.component.scss']
})
export class ShareDialogComponent implements OnInit {
  validSuffix = this.configSvc.instanceConfig.platform.validDomainMail;
  platform = this.configSvc.instanceConfig.platform.platform;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA, SEMICOLON];
  userEmailIds: IUserShareId[] = [];
  errorType: 'NoDomain' | 'InvalidDomain' | 'None' = 'None';
  sendInProgress = false;
  sendStatus:
    | 'INVALID_IDS_ALL'
    | 'SUCCESS'
    | 'INVALID_ID_SOME'
    | 'ANY'
    | 'NONE' = 'NONE';
  constructor(
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<ShareDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { content: IContent },
    private shareSvc: ShareService,
    private telemetrySvc: TelemetryService,
    private configSvc: ConfigService
  ) { }

  ngOnInit() { }

  addAll(event: MatChipInputEvent) {
    const input = event.input
    event.value.split(/[,;]+/).map((val: string) => val.trim()).forEach((value: string) => this.add(value))
    input.value = ''
  }

  add(value: string) {
    if (value) {
      const indexOfAt = value.indexOf('@');
      let suffix = '';
      let email = value;
      if (indexOfAt > -1) {
        suffix = value.substring(indexOfAt + 1);
        email = value.substring(0, indexOfAt);
      }
      if (this.validSuffix[suffix]) {
        this.errorType = 'None';
        this.userEmailIds.push({
          color: 'primary',
          email,
          suffix
        });
      } else if (suffix === '') {
        this.errorType = 'NoDomain';
      } else {
        this.errorType = 'InvalidDomain';
      }
    }
  }

  remove(fruit: IUserShareId): void {
    const index = this.userEmailIds.indexOf(fruit);
    if (index >= 0) {
      this.userEmailIds.splice(index, 1);
    }
  }

  share(txtBody, successToast) {
    if (this.userEmailIds.length === 0) {
      return;
    }

    const validEmailIds = this.userEmailIds.map(u => {
      if (u.color === 'accent') {
        return { email: u.email };
      }
      return {
        email: u.email + '@' + this.validSuffix[u.suffix]
      };
    });
    this.sendInProgress = true;
    this.shareSvc.shareApi(this.data.content, validEmailIds, txtBody).subscribe(
      data => {
        this.telemetrySvc.shareTelemetryEvent(
          this.data.content.identifier,
          validEmailIds.map(item => item.email),
          txtBody,
          'CP_SHARE'
        );
        this.sendInProgress = false;
        if (!data.invalidIds || data.invalidIds.length === 0) {
          this.snackBar.open(successToast);
          this.dialogRef.close();
        }
        if (Array.isArray(data.invalidIds) && data.invalidIds.length > 0) {
          const invalidMailSet = new Set(data.invalidIds);
          if (data.response.toLowerCase() !== 'success') {
            this.sendStatus = 'ANY';
          }
          if (this.userEmailIds.length === invalidMailSet.size) {
            this.sendStatus = 'INVALID_IDS_ALL';
          } else {
            this.sendStatus = 'INVALID_ID_SOME';
            this.snackBar.open(successToast);
          }
          this.userEmailIds = this.userEmailIds.filter(unit =>
            invalidMailSet.has(unit.email + '@' + this.validSuffix[unit.suffix])
          );
          this.userEmailIds.forEach(u => (u.color = 'warn'));
        }
      },
      error => {
        this.sendStatus = 'ANY';
        this.sendInProgress = false;
      }
    );
  }
}
