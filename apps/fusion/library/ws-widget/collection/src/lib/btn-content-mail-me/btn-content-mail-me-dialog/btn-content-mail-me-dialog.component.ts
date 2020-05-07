/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, Inject } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material'

export interface IWidgetBtnContentMailMeDialogData {
  title: string
  description: string
}
export interface IWidgetMailMeDialogComponentResponse {
  send: boolean
  mailBody: string
  successToast: string
  errorToast: string
}

@Component({
  selector: 'ws-widget-btn-content-mail-me-dialog',
  templateUrl: './btn-content-mail-me-dialog.component.html',
  styleUrls: ['./btn-content-mail-me-dialog.component.scss'],
})
export class BtnContentMailMeDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<BtnContentMailMeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IWidgetBtnContentMailMeDialogData,
  ) { }

  ngOnInit() {
  }
  close(mailBody: string, successToast: string, errorToast: string) {
    this.dialogRef.close({
      errorToast,
      mailBody,
      successToast,
      send: true,
    })
  }

}
