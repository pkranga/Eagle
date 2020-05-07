/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input } from '@angular/core';
import { GoalsService } from '../../../../services/goals.service';
import { IUserGoal } from '../../../../models/goal.model';
import { TelemetryService } from '../../../../services/telemetry.service';
import { MatDialog } from '@angular/material';
import { UserGoalDeleteDialogComponent } from '../user-goal-delete-dialog/user-goal-delete-dialog.component';

@Component({
  selector: 'app-goal-item',
  templateUrl: './goal-item.component.html',
  styleUrls: ['./goal-item.component.scss']
})
export class GoalItemComponent implements OnInit {
  @Input()
  goal: IUserGoal;

  hasDeadlineCrossed: boolean;

  showContentPicker: boolean;

  checkedContent: { [identifier: string]: boolean } = {};

  constructor(public dialog: MatDialog) {}

  ngOnInit() {
    if (this.goal.goal_end_date) {
      const date = new Date(parseInt(this.goal.goal_end_date, 10));
      this.hasDeadlineCrossed =
        new Date().setHours(0, 0, 0, 0) > date.setHours(0, 0, 0, 0) &&
        this.goal.goalProgress < 1;
    }

    this.goal.goal_content_id.forEach(item => {
      this.checkedContent[item] = true;
    });
  }

  openDeleteDialog() {
    const dialogRef = this.dialog.open(UserGoalDeleteDialogComponent, {
      width: '700px',
      data: this.goal
    });
  }
}
