/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input } from '@angular/core';
import { IUserGoalSharedBy } from '../../../../models/goal.model';
import { GoalsService } from '../../../../services/goals.service';
import { ShareGoalComponent } from '../share-goal/share-goal.component';
import { MatDialog } from '@angular/material';
import { SharedGoalDeleteDialogComponent } from '../shared-goal-delete-dialog/shared-goal-delete-dialog.component';

@Component({
  selector: 'app-others-goal-item',
  templateUrl: './others-goal-item.component.html',
  styleUrls: ['./others-goal-item.component.scss']
})
export class OthersGoalItemComponent implements OnInit {
  @Input()
  goal: IUserGoalSharedBy;

  showContentPicker: boolean;
  showDeleteCard: boolean;
  removeUserPlaylist: boolean;

  checkedContent: { [identifier: string]: boolean } = {};

  constructor(private goalsSvc: GoalsService, public dialog: MatDialog) {}

  ngOnInit() {
    this.goal.goal_content_id.forEach(item => {
      this.checkedContent[item] = true;
    });
  }

  deleteGoal() {
    if (
      !this.goal.shared_users_progress ||
      !this.goal.shared_users_progress.length
    ) {
      const dialogRef = this.dialog.open(SharedGoalDeleteDialogComponent, {
        width: '700px',
        data: this.goal
      });
    } else {
      this.showDeleteCard = !this.showDeleteCard;
    }
  }

  shareGoal() {
    const dialogRef = this.dialog.open(ShareGoalComponent, {
      width: '700px',
      data: this.goal
    });
  }
}
