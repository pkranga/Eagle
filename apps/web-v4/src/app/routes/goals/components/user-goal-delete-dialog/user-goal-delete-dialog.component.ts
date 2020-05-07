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
import { MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { IUserGoal } from '../../../../models/goal.model';
import { GoalsService } from '../../../../services/goals.service';
import { TelemetryService } from '../../../../services/telemetry.service';

@Component({
  selector: 'app-user-goal-delete-dialog',
  templateUrl: './user-goal-delete-dialog.component.html',
  styleUrls: ['./user-goal-delete-dialog.component.scss']
})
export class UserGoalDeleteDialogComponent implements OnInit {
  @ViewChild('goalDeleted', { static: true }) goalDeleted: ElementRef<any>;
  deleteGoalInProgress = false;

  constructor(
    private goalsSvc: GoalsService,
    private snackBar: MatSnackBar,
    private telemetrySvc: TelemetryService,
    public dialogRef: MatDialogRef<UserGoalDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IUserGoal
  ) {}

  ngOnInit() {}

  deleteGoal() {
    this.deleteGoalInProgress = true;
    this.goalsSvc
      .deleteGoal({
        goal_id: this.data.goal_id,
        goal_type: this.data.goal_type
      })
      .subscribe(response => {
        this.deleteGoalInProgress = false;
        this.dialogRef.close();
        this.snackBar.open(this.goalDeleted.nativeElement.value);
        this.telemetrySvc.goalTelemetryEvent(
          'removed',
          this.data.goal_id,
          this.data.goal_content_id,
          undefined
        );
      });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
