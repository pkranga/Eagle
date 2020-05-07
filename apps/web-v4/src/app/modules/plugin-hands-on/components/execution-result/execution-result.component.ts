/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { IExerciseResponse, EXECUTION_STATUS } from '../../model/handsOn.model';

@Component({
  selector: 'app-execution-result',
  templateUrl: './execution-result.component.html',
  styleUrls: ['./execution-result.component.scss']
})
export class ExecutionResultComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ExecutionResultComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
  ) {}
  ngOnInit() {
  }
  submit() {
    this.dialogRef.close('submit');
  }
  close() {
    this.dialogRef.close();
  }
}
