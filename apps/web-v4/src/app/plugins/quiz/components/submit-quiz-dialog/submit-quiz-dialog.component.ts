/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TQuizSubmissionState } from '../../model/quiz.model';

@Component({
  selector: 'app-submit-quiz-dialog',
  templateUrl: './submit-quiz-dialog.component.html',
  styleUrls: ['./submit-quiz-dialog.component.scss']
})
export class SubmitQuizDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<SubmitQuizDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public submissionState: TQuizSubmissionState
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {}
}
