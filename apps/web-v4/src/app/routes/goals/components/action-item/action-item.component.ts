/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  IUserGoalSharedWith,
} from '../../../../models/goal.model';
import { TelemetryService } from '../../../../services/telemetry.service';
import {
  MatSnackBar,
  MatDialog,
} from '@angular/material';
import { GoalAcceptDialogComponent } from '../goal-accept-dialog/goal-accept-dialog.component';
import { GoalRejectDialogComponent } from '../goal-reject-dialog/goal-reject-dialog.component';

import { UtilityService } from '../../../../services/utility.service';
import { GoalsService } from '../../../../services/goals.service';

@Component({
  selector: 'app-action-item',
  templateUrl: './action-item.component.html',
  styleUrls: ['./action-item.component.scss']
})
export class ActionItemComponent implements OnInit {
  @Input() goal: IUserGoalSharedWith;
  @Output() refreshGoal = new EventEmitter();

  public showChildren: boolean;
  sharedBy: string;

  constructor(
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private telemetrySvc: TelemetryService,
    private utility: UtilityService,
    private goalsService: GoalsService
  ) {
    this.showChildren = false;
  }

  ngOnInit() {
    this.sharedBy = this.goal.shared_by
      ? this.goal.shared_by.split('@')[0]
      : '';
  }

  toggleChild() {
    this.showChildren = !this.showChildren;
  }

  openAcceptDialog() {
    const dialogRef = this.dialog.open(GoalAcceptDialogComponent, {
      width: '700px',
      data: this.goal
    });

    // this.modelRefGoalAccept.show()
    // this.commonGoalsCheckInProgress = false
  }

  openRejectDialog() {
    const dialogRef = this.dialog.open(GoalRejectDialogComponent, {
      width: '700px',
      data: this.goal
    });
  }
}
