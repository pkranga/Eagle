/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { IUserActionDialogData } from '../../../../models/certification.model';

@Component({
  selector: 'ws-user-action-confirm-dialog',
  templateUrl: './user-action-confirm-dialog.component.html',
  styleUrls: ['./user-action-confirm-dialog.component.scss']
})
export class UserActionConfirmDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IUserActionDialogData,
    public dialogRef: MatDialogRef<UserActionConfirmDialogComponent>
  ) {}

  ngOnInit() {}

  onAction() {
    this.dialogRef.close({
      confirmAction: true,
      requestType: this.data.approvalItem.record_type,
      action: this.data.actionType,
      certificationId: this.data.approvalItem.certification,
      slotNo: this.data.approvalItem.slotno,
      icfdId: this.data.approvalItem.icfdid
    });
  }
}
