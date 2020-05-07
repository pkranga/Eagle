/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Inject } from '@angular/core';
import { ShareService } from '../../../../services/share.service';
import { MatSnackBar, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { IContent } from '../../../../models/content.model';

export interface IQueryMailComponentDialogData {
  content: IContent;
  userEmails: string[];
}

@Component({
  selector: 'app-query-mail',
  templateUrl: './query-mail.component.html',
  styleUrls: ['./query-mail.component.scss']
})
export class QueryMailComponent implements OnInit {
  mailSendInProgress = false;
  sendStatus: 'SUCCESS' | 'INVALID_ID';
  constructor(
    public snackBar: MatSnackBar,
    private shareSvc: ShareService,
    public dialogRef: MatDialogRef<QueryMailComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: IQueryMailComponentDialogData
  ) { }

  ngOnInit() {
  }

  send(txtBody: string, successMsg, errorToast, invalidIdToast) {
    this.mailSendInProgress = true;
    this.shareSvc
      .shareApi(
        this.data.content,
        this.data.userEmails.map(u => ({ email: u })),
        txtBody,
        'query'
      )
      .subscribe((data) => {
        this.mailSendInProgress = false;
        if (data.response === 'Request Accepted!' && (!data.invalidIds || data.invalidIds.length === 0)) {
          this.sendStatus = 'SUCCESS';
          this.snackBar.open(
            successMsg,
          );
          this.dialogRef.close();
        } else if (data.invalidIds && data.invalidIds.length) {
          this.sendStatus = 'INVALID_ID';
          this.snackBar.open(invalidIdToast);
        }
      }, (err) => {
        this.mailSendInProgress = false;
        this.snackBar.open(
          errorToast
        );
      });
  }
}
