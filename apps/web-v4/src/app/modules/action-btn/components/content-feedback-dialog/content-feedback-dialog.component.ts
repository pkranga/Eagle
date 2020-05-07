/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ElementRef
} from '@angular/core';
import { MAT_DIALOG_DATA, MatSnackBar, MatDialogRef } from '@angular/material';
import { UserService } from '../../../../services/user.service';
import { TelemetryService } from '../../../../services/telemetry.service';

@Component({
  selector: 'app-content-feedback-dialog',
  templateUrl: './content-feedback-dialog.component.html',
  styleUrls: ['./content-feedback-dialog.component.scss']
})
export class ContentFeedbackDialogComponent implements OnInit {
  feedbackRequest: any;
  submitInProgress = false;
  ratingLoop: number[] = [];
  numbersPattern = /^[1-9]\d*/;
  @ViewChild('toastSuccess', { static: true }) toastSuccess: ElementRef<any>;
  @ViewChild('toastError', { static: true }) toastError: ElementRef<any>;
  constructor(
    private snackBar: MatSnackBar,
    private telemetrySvc: TelemetryService,
    private userSvc: UserService,
    @Inject(MAT_DIALOG_DATA) public data: { id: string; name: string },
    private dialogRef: MatDialogRef<ContentFeedbackDialogComponent>
  ) {}

  ngOnInit() {
    this.resetFeedbackForm();
  }

  submitFeedback(request) {
    this.submitInProgress = true;
    this.userSvc.submitFeedback(request).subscribe(
      data => {
        this.telemetrySvc.feedbackTelemetryEvent('content', this.data.id);
        this.resetFeedbackForm();
        this.dialogRef.close();
        this.openSnackbar(this.toastSuccess.nativeElement.value);
        this.submitInProgress = false;
      },
      err => {
        this.openSnackbar(this.toastError.nativeElement.value);
        this.submitInProgress = false;
        // console.log('err >', err);
      }
    );
  }

  private openSnackbar(primaryMsg: string, duration: number = 3000) {
    this.snackBar.open(primaryMsg, undefined, {
      duration
    });
  }

  resetFeedbackForm() {
    this.ratingLoop = new Array(5);
    this.ratingLoop.fill(1);
    this.feedbackRequest = {
      contentId: this.data.id,
      feedback: [
        {
          question: 'comment of content',
          meta: 'content',
          answer: ''
        }
      ],
      feedbackSubType: 'Resource',
      feedbackType: 'content',
      rating: '-1'
    };
  }
}
