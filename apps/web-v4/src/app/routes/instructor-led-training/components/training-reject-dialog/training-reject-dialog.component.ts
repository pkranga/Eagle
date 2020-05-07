/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Inject, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { ITrainingRequest } from '../../../../models/training.model';
import { TrainingsService } from '../../../../services/trainings.service';

@Component({
  selector: 'app-training-reject-dialog',
  templateUrl: './training-reject-dialog.component.html',
  styleUrls: ['./training-reject-dialog.component.scss']
})
export class TrainingRejectDialogComponent implements OnInit {
  rejectForm: FormGroup = new FormGroup({
    reason: new FormControl()
  });
  @ViewChild('rejected', { static: true }) rejected: TemplateRef<any>;
  @ViewChild('rejectionFailed', { static: true }) rejectionFailed: TemplateRef<any>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public request: ITrainingRequest,
    private dialogRef: MatDialogRef<TrainingRejectDialogComponent>,
    private snackbar: MatSnackBar,
    private trainingSvc: TrainingsService
  ) {}

  ngOnInit() {}

  onReject() {
    this.trainingSvc.rejectTrainingRequest(this.rejectForm.value.reason, this.request.offering_id).subscribe(
      () => {
        this.snackbar.openFromTemplate(this.rejected);
        this.dialogRef.close(true);
      },
      () => {
        this.snackbar.openFromTemplate(this.rejectionFailed);
      }
    );
  }
}
