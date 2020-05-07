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
  ICommonGoalsCheckRequest,
  IGoalAddUpdateRequest,
  IUserGoalAddUpdateRequest
} from '../../../../models/goal.model';

@Component({
  selector: 'app-goal-accept-dialog',
  templateUrl: './goal-accept-dialog.component.html',
  styleUrls: ['./goal-accept-dialog.component.scss']
})
export class GoalAcceptDialogComponent implements OnInit {
  @ViewChild('goalAccepted', { static: true }) goalAccepted: ElementRef;
  @ViewChild('goalRejected', { static: true }) goalRejected: ElementRef;
  @ViewChild('errorOccurred', { static: true }) errorOccurred: ElementRef;

  userCommonGoalId = '';
  commonGoalsCheckInProgress = false;

  goalAddInProgress = true;

  constructor(
    private goalsSvc: GoalsService,
    private snackBar: MatSnackBar,
    private telemetrySvc: TelemetryService,
    public dialogRef: MatDialogRef<GoalAcceptDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IUserGoalSharedWith
  ) {}

  ngOnInit() {
    this.commonGoalsCheckInProgress = true;
    const request: ICommonGoalsCheckRequest = {} as ICommonGoalsCheckRequest;
    request.goal_id = this.data.goal_id;
    request.goal_title = this.data.goal_title;
    request.goal_desc = this.data.goal_desc || '';
    request.goal_content_id = this.data.goal_content_id;
    this.goalsSvc.commonGoalsCheck(request).subscribe(
      data => {
        this.userCommonGoalId = data.user_commongoalid;
        this.commonGoalsCheckInProgress = false;
      },
      err => {
        this.commonGoalsCheckInProgress = false;
        this.dialogRef.close();
        this.snackBar.open(this.goalAccepted.nativeElement.value);
      }
    );
  }

  addToMyGoal() {
    this.goalAddInProgress = false;
    const request: IGoalAddUpdateRequest = {
      goal_data: []
    } as IGoalAddUpdateRequest;
    request.goal_data[0] = {} as IUserGoalAddUpdateRequest;
    request.goal_data[0].goal_content_id = this.data.goal_content_id;
    request.goal_data[0].goal_desc = this.data.goal_desc;
    request.goal_data[0].goal_id = this.data.goal_id;
    request.goal_data[0].goal_title = this.data.goal_title;
    request.goal_data[0].goal_type = 'shared';
    request.goal_data[0].user_action = 'accept';
    request.goal_data[0].shared_by = this.data.shared_by;
    request.goal_data[0].goal_duration = this.data.goal_duration;
    request.goal_data[0].shared_on = this.data.shared_on;
    if (this.data.goal_type) {
      request.goal_data[0].shared_goal_type = this.data.goal_type;
    }
    if (this.userCommonGoalId) {
      request.goal_data[0].user_commongoalid = this.userCommonGoalId;
    }

    this.goalsSvc.addUpdateGoal(request).subscribe(
      response => {
        this.snackBar.open(this.goalAccepted.nativeElement.value);
        this.goalAddInProgress = true;
        // this.cancelModal();
        this.dialogRef.close();
        // this.refreshGoal.emit('accept');
        this.telemetrySvc.goalTelemetryEvent(
          'accepted',
          response.response[0].goal_id,
          this.data.goal_content_id,
          []
        );
      },
      err => {
        this.goalAddInProgress = true;
        this.snackBar.open(this.errorOccurred.nativeElement.value);
      }
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
