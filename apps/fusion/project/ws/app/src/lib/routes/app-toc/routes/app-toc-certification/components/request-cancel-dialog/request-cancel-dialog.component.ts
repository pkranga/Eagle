/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, Inject } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material'
import { TCertificationRequestType } from '../../models/certification.model'

@Component({
  selector: 'ws-app-request-cancel-dialog',
  templateUrl: './request-cancel-dialog.component.html',
  styleUrls: ['./request-cancel-dialog.component.scss'],
})
export class RequestCancelDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public requestType: TCertificationRequestType,
    private dialogRef: MatDialogRef<RequestCancelDialogComponent, { confirmCancel: boolean }>,
  ) {}

  ngOnInit() {}

  cancelRequest() {
    this.dialogRef.close({
      confirmCancel: true,
    })
  }
}
