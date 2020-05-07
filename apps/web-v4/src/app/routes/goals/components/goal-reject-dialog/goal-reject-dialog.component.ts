/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Inject
} from '@angular/core';
import { GoalsService } from '../../../../services/goals.service';
import { MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TelemetryService } from '../../../../services/telemetry.service';
import {
  IUserGoalSharedWith,
  IGoalAddUpdateRequest,
  IUserGoalAddUpdateRequest
} from '../../../../models/goal.model';

@Component({
  selector: 'app-goal-reject-dialog',
  templateUrl: './goal-reject-dialog.component.html',
  styleUrls: ['./goal-reject-dialog.component.scss']
})
export class GoalRejectDialogComponent implements OnInit {
  removeGoalInProgress = true;

  @ViewChild('goalAccepted', { static: true }) goalAccepted: ElementRef;
  @ViewChild('goalRejected', { static: true }) goalRejected: ElementRef;
  @ViewChild('errorOccurred', { static: true }) errorOccurred: ElementRef;

  constructor(
    private goalsSvc: GoalsService,
    private snackBar: MatSnackBar,
    private telemetrySvc: TelemetryService,
    public dialogRef: MatDialogRef<GoalRejectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IUserGoalSharedWith
  ) {}

  ngOnInit() {}

  removeFromSharedGoal(rejectGoalDescription: string) {
    this.removeGoalInProgress = false;
    const request: IGoalAddUpdateRequest = {
      goal_data: []
    } as IGoalAddUpdateRequest;
    request.goal_data[0] = {} as IUserGoalAddUpdateRequest;
    request.goal_data[0].goal_content_id = this.data.goal_content_id;
    request.goal_data[0].goal_desc = this.data.goal_desc;
    request.goal_data[0].goal_id = this.data.goal_id;
    request.goal_data[0].goal_title = this.data.goal_title;
    request.goal_data[0].goal_type = 'shared';
    request.goal_data[0].user_action = 'reject';
    request.goal_data[0].shared_by = this.data.shared_by;
    request.goal_data[0].goal_duration = this.data.goal_duration;
    if (this.data.goal_type) {
      request.goal_data[0].shared_goal_type = this.data.goal_type;
    }
    request.goal_data[0].status_message = rejectGoalDescription;
    this.goalsSvc.addUpdateGoal(request).subscribe(
      success => {
        this.removeGoalInProgress = true;
        this.telemetrySvc.goalTelemetryEvent(
          'rejected',
          this.data.goal_id,
          this.data.goal_content_id,
          []
        );
        this.snackBar.open(this.goalRejected.nativeElement.value);
        this.dialogRef.close();
        // this.refreshGoal.emit('reject');
      },
      err => {
        this.removeGoalInProgress = true;
        this.snackBar.open(this.errorOccurred.nativeElement.value);
      }
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
