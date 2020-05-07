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
import { IUserProgressGoal } from '../../../../models/goal.model';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { GoalsService } from '../../../../services/goals.service';

@Component({
  selector: 'app-goal-details-dialog',
  templateUrl: './goal-details-dialog.component.html',
  styleUrls: ['./goal-details-dialog.component.scss']
})
export class GoalDetailsDialogComponent implements OnInit {
  @ViewChild('successToast', { static: true }) successToast: ElementRef<any>;
  @ViewChild('failureToast', { static: true }) failureToast: ElementRef<any>;
  constructor(
    public dialogRef: MatDialogRef<GoalDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public goal: IUserProgressGoal,
    private goalsSvc: GoalsService,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit() {}

  copyGoal() {
    this.goalsSvc
      .createGoal({
        goal_content_id: this.goal.goal_content_id,
        goal_title: this.goal.goal_title,
        goal_desc: this.goal.goal_desc,
        goal_duration: this.goal.goal_duration,
        goal_type:
          this.goal.goal_type.indexOf('common') >= 0 ? 'common' : 'user'
      })
      .subscribe(
        response => {
          this.snackbar.open(this.successToast.nativeElement.value);
        },
        err => {
          console.log(err);
        }
      );
  }
}
