/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import {
  ICertificationDialogData,
  ICertificationDialogResult,
  ICertificationApproverData
} from '../../../../models/certification.model';
import { FormControl, Validators } from '../../../../../../node_modules/@angular/forms';

@Component({
  selector: 'ws-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {
  reasonCtrl: FormControl;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ICertificationDialogData,
    public dialogRef: MatDialogRef<ConfirmDialogComponent, ICertificationDialogResult>
  ) {
    this.reasonCtrl = new FormControl('', [
      Validators.required,
      Validators.maxLength(this.data.approvalItem.record_type === 'result_verification' ? 500 : 1000)
    ]);
  }

  ngOnInit() {}

  sendAction() {
    if (
      (this.data.approvalItem.record_type === 'budget_approval' &&
        this.data.actionType === 'decline' &&
        this.reasonCtrl.invalid) ||
      (this.data.approvalItem.record_type === 'result_verification' && this.reasonCtrl.invalid)
    ) {
      return;
    }
    this.dialogRef.close({
      action: this.data.approvalItem.record_type,
      result: true,
      data: this._getResultData()
    });
  }

  private _getResultData() {
    try {
      const resultData: ICertificationApproverData = {};

      switch (this.data.actionType) {
        case 'accept':
          resultData.status = 'Approved';
          break;
        case 'decline':
          resultData.status = 'Rejected';
          break;
      }

      switch (this.data.approvalItem.record_type) {
        case 'proctor_approval':
          resultData.icfdId = this.data.approvalItem.icfdid;
          break;

        case 'result_verification':
          resultData.certificationId = this.data.approvalItem.certification;
          resultData.uploadId = this.data.approvalItem.upload_id;
          resultData.reason = this.reasonCtrl.value;
          resultData.user = this.data.approvalItem.user;
          break;

        case 'budget_approval':
          resultData.certificationId = this.data.approvalItem.certification;
          resultData.ecdpId = this.data.approvalItem.ecdp_id;
          resultData.sino = this.data.approvalItem.sino;
          resultData.reason = this.reasonCtrl.value;
          break;
      }

      return resultData;
    } catch (e) {
      return null;
    }
  }
}
