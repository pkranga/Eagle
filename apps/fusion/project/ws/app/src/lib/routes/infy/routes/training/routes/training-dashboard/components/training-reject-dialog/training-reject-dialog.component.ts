/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, Inject } from '@angular/core'
import { FormGroup, FormControl } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material'
import { noop } from 'rxjs'
import { ITrainingRequest } from '../../../../models/training-api.model'
import { TrainingApiService } from '../../../../apis/training-api.service'

@Component({
  selector: 'ws-app-training-reject-dialog',
  templateUrl: './training-reject-dialog.component.html',
  styleUrls: ['./training-reject-dialog.component.scss'],
})
export class TrainingRejectDialogComponent implements OnInit {
  rejectForm: FormGroup = new FormGroup({
    reason: new FormControl(),
  })

  constructor(
    @Inject(MAT_DIALOG_DATA) public request: ITrainingRequest,
    private dialogRef: MatDialogRef<TrainingRejectDialogComponent>,
    private trainingApi: TrainingApiService,
  ) {}

  ngOnInit() {}

  onReject() {
    this.trainingApi
      .rejectTrainingRequest(this.rejectForm.value.reason, this.request.offering_id)
      .subscribe(() => {
        this.dialogRef.close(true)
      },         noop)
  }
}
