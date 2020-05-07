/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {Router} from '@angular/router';
import {IData} from '../../../../models/exercise-submission.model';


@Component({
  selector: 'app-view-content-dialog',
  templateUrl: './view-content-dialog.component.html',
  styleUrls: ['./view-content-dialog.component.scss']
})
export class ViewContentDialogComponent implements OnInit {

  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<ViewContentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IData

  ) { }

  ngOnInit() {
  }

  navigateToFeedback() {
    this.dialogRef.close();
    this.router.navigate(
      ['/submission/feedback'],
      { queryParams:
        {
          contentId: this.data.contentId,
          submissionId: this.data.submissionId,
          emailId: this.data.emailId
        }
      }
    );
  }

}
