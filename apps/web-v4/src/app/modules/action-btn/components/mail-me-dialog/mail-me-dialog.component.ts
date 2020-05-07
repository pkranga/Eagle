/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

export interface IMailMeDialogComponentData {
  title: string;
  description: string;
}

export interface IMailMeDialogComponentResponseData {
  send: boolean;
  mailBody: string;
  successToast: string;
  errorToast: string;
}

@Component({
  selector: 'app-mail-me-dialog',
  templateUrl: './mail-me-dialog.component.html',
  styleUrls: ['./mail-me-dialog.component.scss']
})
export class MailMeDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<MailMeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IMailMeDialogComponentData
  ) {}

  ngOnInit() {}
  close(mailBody, successToast, errorToast) {
    this.dialogRef.close({
      send: true,
      mailBody,
      successToast,
      errorToast
    });
  }
}
