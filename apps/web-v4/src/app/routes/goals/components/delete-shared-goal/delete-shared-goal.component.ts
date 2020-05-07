/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input } from '@angular/core';
import {
  IUserGoalSharedBy,
  IUserSharedGoalDeleteRequest,
  IUserGoalDeleteDetails,
  GoalUpdateResponse
} from '../../../../models/goal.model';
import { GoalsService } from '../../../../services/goals.service';
import { TelemetryService } from '../../../../services/telemetry.service';

@Component({
  selector: 'app-delete-shared-goal',
  templateUrl: './delete-shared-goal.component.html',
  styleUrls: ['./delete-shared-goal.component.scss']
})
export class DeleteSharedGoalComponent implements OnInit {
  constructor(
    private goalsSvc: GoalsService,
    private telemetrySvc: TelemetryService
  ) {}

  @Input()
  goal: IUserGoalSharedBy;

  deleteUserList: string[] = [];
  goalDeleteInProgress = false;

  sharedWithList: string[] = [];

  ngOnInit() {
    this.sharedWithList = this.goal.shared_users_progress.map(
      user => user.shared_with
    );
  }

  selectionChanged(selection) {
    this.deleteUserList = selection.map(user => user.value);
  }

  selectAllChanged() {
    if (this.deleteUserList.length < this.sharedWithList.length) {
      this.deleteUserList = [...this.sharedWithList];
    } else if (this.deleteUserList.length === this.sharedWithList.length) {
      this.deleteUserList = [];
    }
  }

  deleteSharedGoal() {
    this.goalDeleteInProgress = true;
    const request: IUserSharedGoalDeleteRequest = {
      goal_data: []
    } as IUserSharedGoalDeleteRequest;
    request.goal_data[0] = {} as IUserGoalDeleteDetails;
    request.goal_data[0].goal_id = this.goal.goal_id;
    request.goal_data[0].goal_type = this.goal.goal_type;
    request.goal_data[0].user_list = this.deleteUserList.map(i =>
      i.includes('@')
        ? i.toLocaleLowerCase().trim()
        : i.toLocaleLowerCase().trim() + 'EMAIL'
    );
    request.goal_data[0].goal_content_id = this.goal.goal_content_id;
    request.goal_data[0].goal_duration = this.goal.goal_duration;
    request.goal_data[0].goal_desc = this.goal.goal_desc;
    request.goal_data[0].goal_title = this.goal.goal_title;
    this.goalsSvc.deleteSharedGoal(request).subscribe(
      (data: GoalUpdateResponse[]) => {
        this.telemetrySvc.goalTelemetryEvent(
          'removed',
          this.goal.goal_id,
          this.goal.goal_content_id,
          this.deleteUserList.map(i =>
            i.includes('@')
              ? i.toLocaleLowerCase().trim()
              : i.toLocaleLowerCase().trim() + 'EMAIL'
          )
        );
        this.goalDeleteInProgress = false;
      },
      err => {
        this.goalDeleteInProgress = false;
      }
    );
  }
}
