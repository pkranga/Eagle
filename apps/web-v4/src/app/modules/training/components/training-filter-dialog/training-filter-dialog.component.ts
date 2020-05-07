/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { ITrainingFilterForm, ITrainingLocation } from '../../../../models/training.model';
import { TrainingsApiService } from '../../../../apis/trainings-api.service';

@Component({
  selector: 'app-training-filter-dialog',
  templateUrl: './training-filter-dialog.component.html',
  styleUrls: ['./training-filter-dialog.component.scss']
})
export class TrainingFilterDialogComponent implements OnInit {
  filterForm: FormGroup = new FormGroup({
    location: new FormControl(),
    fromDate: new FormControl(this.savedForm ? this.savedForm.fromDate : undefined),
    toDate: new FormControl(this.savedForm ? this.savedForm.toDate : undefined),
  });

  trainingLocations$: Observable<ITrainingLocation[]>
  currentDate = new Date();

  constructor(
    public dialogRef: MatDialogRef<TrainingFilterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public savedForm: ITrainingFilterForm,
    private trainingsApi: TrainingsApiService
  ) { }

  ngOnInit() {
    this.trainingLocations$ = this.trainingsApi.getTrainingLocations();
  }

  onApplyFilters() {
    if (!this.filterForm.valid) {
      return;
    }

    this.dialogRef.close(this.filterForm.value);
  }

}
