/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, Inject } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { IReqMarkAsComplete } from '../mark-as-complete.model'
import { MarkAsCompleteService } from '../mark-as-complete.service'
import { MatSnackBar } from '@angular/material/snack-bar'

interface IDialogData {
  body: IReqMarkAsComplete
  contentId: string
}

@Component({
  selector: 'ws-widget-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
})
export class ConfirmDialogComponent implements OnInit {

  fetchStatus: 'fetching' | 'fetched' | 'failed' | null = null

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDialogData,
    private markAsCompleteSvc: MarkAsCompleteService,
    private snackBarSvc: MatSnackBar,
  ) { }

  close(): void {
    this.dialogRef.close()
  }

  markAsComplete(): void {
    this.fetchStatus = 'fetching'
    this.markAsCompleteSvc.markAsComplete(this.data.body, this.data.contentId).then(() => {
      this.fetchStatus = 'fetched'
      this.snackBarSvc.open('Marked as Complete')
      this.dialogRef.close('Marked')
    }).catch(() => {
      this.fetchStatus = 'failed'
      this.snackBarSvc.open('Failed')
    })
  }

  ngOnInit() {
  }

}
