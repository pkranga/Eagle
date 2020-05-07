/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar, MatTableDataSource } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import {
  ISharedGoalsProgressAccData,
  IGoalAddUpdateRequest,
  IUserGoalAddUpdateRequest,
  IUserProgressGoal
} from '../../../../models/goal.model';

import { AuthService } from '../../../../services/auth.service';
import { GoalsService } from '../../../../services/goals.service';
import { TelemetryService } from '../../../../services/telemetry.service';
type TGoalType = 'user' | 'common' | 'remindGoal';

@Component({
  selector: 'app-shared-goal-progress',
  templateUrl: './shared-goal-progress.component.html',
  styleUrls: ['./shared-goal-progress.component.scss']
})
export class SharedGoalProgressComponent implements OnInit {
  @ViewChild('errorOccurred', { static: true }) errorOccurredToast: ElementRef;
  @ViewChild('noPending', { static: true }) noPendingToast: ElementRef;
  @ViewChild('noAccepted', { static: true }) noAcceptedToast: ElementRef;
  @ViewChild('noRejected', { static: true }) noRejectedToast: ElementRef;
  @ViewChild('noReminderSelected', { static: true }) noReminderSelectedToast: ElementRef;
  @ViewChild('reminderMailSent', { static: true }) reminderMailSentToast: ElementRef;
  @ViewChild('noShareAgainSelected', { static: true }) noShareAgainToast: ElementRef;
  @ViewChild('selfShare', { static: true }) selfShareToast: ElementRef;
  @ViewChild('goalSharingSuccessful', { static: true }) goalSharingSuccessfulToast: ElementRef;

  displayedColumns: string[] = ['select', 'user', 'reason'];
  dataSource: MatTableDataSource<any>;
  selection: SelectionModel<any> = new SelectionModel<any>(true, []);

  displayedColumnsPending: string[] = ['select', 'user'];
  dataSourcePending: MatTableDataSource<any>;
  selectionPending: SelectionModel<any> = new SelectionModel<any>(true, []);

  goal: any;

  progressData: ISharedGoalsProgressAccData;
  goalState: string;
  objectEntries = Object.entries;
  contentLoaded = true;
  showChildren = false;
  checkAll = {
    rejected: false,
    pending: false
  };

  totalCount: number;
  shareAPIProgress = false;
  remindAPIProgress = false;
  fetchProgressCountInProgress = false;

  constructor(
    private snackBar: MatSnackBar,
    private goalsService: GoalsService,
    private route: ActivatedRoute,
    private telemetrySvc: TelemetryService,
    private authSvc: AuthService
  ) {}

  ngOnInit() {
    const goalId = this.route.snapshot.params.goalId;
    this.goalsService.toBeSharedGoals.subscribe(data => {
      if (data) {
        this.goal = data.find(item => item.goal_id === goalId);
        this.showGoalProgress();
        this.getProgressData(undefined);
      }
    });
  }

  showGoalProgress() {
    this.fetchProgressCountInProgress = true;
    const sharedGoalObject: IUserProgressGoal = {} as IUserProgressGoal;
    sharedGoalObject.goal_id = this.goal.goal_id;
    sharedGoalObject.goal_type = this.goal.goal_type;
    sharedGoalObject.type = 'count';
    this.goalsService.fetchSharedGoalsProgressCount(sharedGoalObject).subscribe(
      success => {
        this.fetchProgressCountInProgress = false;
        delete success.goal_id;
        this.goal = {
          ...this.goal,
          status: success
        };
        this.totalCount =
          this.goal.status.accepted +
          this.goal.status.rejected +
          this.goal.status.pending;
        this.telemetrySvc.goalTelemetryEvent(
          'progress',
          this.goal.goal_id,
          this.goal.goal_content_id,
          undefined
        );
      },
      err => {
        this.fetchProgressCountInProgress = true;
        // this.hasFailed = true;
        this.snackBar.open(this.errorOccurredToast.nativeElement.value);
      }
    );
  }

  getProgressData(data) {
    this.goalState = data;
    this.contentLoaded = false;
    const goalData = {
      goal_id: this.goal.goal_id,
      goal_type: this.goal.goal_type,
      type: 'goalstatus'
    };
    this.goalsService.fetchSharedGoalsProgressData(goalData).subscribe(
      success => {
        this.contentLoaded = true;
        Object.keys(success).forEach(v => {
          success[v] = success[v].map(v1 => ({ ...v1, checked: false }));
        });
        this.progressData = success;
        this.dataSource = new MatTableDataSource<any>(
          this.progressData.rejected
        );
        this.selection = new SelectionModel<any>(true, []);

        this.dataSourcePending = new MatTableDataSource<any>(
          this.progressData.pending
        );
        this.selectionPending = new SelectionModel<any>(true, []);
      },
      err => {
        this.contentLoaded = true;
        this.snackBar.open(this.errorOccurredToast.nativeElement.value);
      }
    );
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  toggleChild(index) {
    this.progressData.accepted[index].checked = !this.progressData.accepted[
      index
    ].checked;
  }

  isAllSelectedPending() {
    const numSelected = this.selectionPending.selected.length;
    const numRows = this.dataSourcePending.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterTogglePending() {
    this.isAllSelectedPending()
      ? this.selectionPending.clear()
      : this.dataSourcePending.data.forEach(row =>
          this.selectionPending.select(row)
        );
  }

  toggleChildPending(index) {
    this.progressData.rejected[index].checked = !this.progressData.rejected[
      index
    ].checked;
  }

  remindUsers() {
    const emailIds = this.selectionPending.selected.map(v => ({
      email: v.shared_with,
      name: v.shared_with.split('@')[0]
    }));
    if (emailIds.length === 0) {
      this.snackBar.open(this.noReminderSelectedToast.nativeElement.value);
      return;
    }
    this.remindAPIProgress = true;
    const sender = {
      email: this.authSvc.userEmail,
      name: this.authSvc.userEmail.split('@')[0]
    };
    const remindContract = {
      emailTo: emailIds,
      emailType: 'remindGoal',
      ccTo: [sender],
      sharedBy: [sender],
      body: {
        text: '',
        isHTML: false
      },
      timestamp: Date.now(),
      appURL: document.baseURI,
      artifact: [
        {
          identifier: this.goal.goal_id,
          title: this.goal.goal_title,
          description: this.goal.goal_desc || null,
          content: this.goal.goal_content_id
        }
      ]
    };

    this.goalsService.remindUsersOfSharedGoal(remindContract).subscribe(
      success => {
        this.telemetrySvc.shareTelemetryEvent(
          this.goal.goal_id,
          emailIds.map(e => e.email),
          remindContract.body.text,
          'CP_SHARE_REMINDER',
          this.goal.goal_content_id
        );
        this.snackBar.open(
          this.reminderMailSentToast.nativeElement.value +
            `${emailIds.map(v => v.name).join(', ')}.`
        );
        this.getProgressData('pending');
        // this.refresh.emit()
      },
      err => {
        this.snackBar.open(this.errorOccurredToast.nativeElement.value);
      },
      () => {
        this.remindAPIProgress = false;
      }
    );
  }

  shareAgain() {
    const emailIds = this.selection.selected.map(v => v.shared_with);
    if (emailIds.length === 0) {
      this.snackBar.open(this.noShareAgainToast.nativeElement.value);
      return;
    }
    this.shareAPIProgress = true;
    const shareGoalItems: IGoalAddUpdateRequest = {
      goal_data: []
    } as IGoalAddUpdateRequest;
    shareGoalItems.goal_data[0] = {} as IUserGoalAddUpdateRequest;
    shareGoalItems.goal_data[0].goal_id = this.goal.goal_id;
    shareGoalItems.goal_data[0].goal_title = this.goal.goal_title;
    shareGoalItems.goal_data[0].goal_content_id = this.goal.goal_content_id;
    shareGoalItems.goal_data[0].goal_type = 'share_with';
    shareGoalItems.goal_data[0].goal_desc = this.goal.goal_desc || '';
    shareGoalItems.goal_data[0].goal_duration = this.goal.goal_duration || 0;
    shareGoalItems.goal_data[0].shared_goal_type = this.goal.goal_type;
    // tslint:disable-next-line:max-line-length
    const correctedEmailIds = emailIds.map(i =>
      i.includes('@')
        ? i.toLocaleLowerCase().trim()
        : i.toLocaleLowerCase().trim() + 'EMAIL'
    );
    shareGoalItems.goal_data[0].user_list = correctedEmailIds;
    this.goalsService.addUpdateGoal(shareGoalItems).subscribe(
      success => {
        this.telemetrySvc.shareTelemetryEvent(
          this.goal.goal_id,
          emailIds,
          '',
          'CP_SHARE',
          this.goal.goal_content_id
        );
        if (success.response[0].result !== 'failed') {
          this.snackBar.open(
            this.goalSharingSuccessfulToast.nativeElement.value +
              `${emailIds.join(', ')}`
          );
        }
        if (success.response[0].self_shared === 1) {
          this.snackBar.open(this.selfShareToast.nativeElement.value);
        }
        // this.refresh.emit(this.goal);
        this.getProgressData('rejected');
      },
      err => {
        this.snackBar.open(this.errorOccurredToast.nativeElement.value);
      },
      () => {
        this.shareAPIProgress = false;
      }
    );
  }

  onPendingCheckChange(data) {
    this.progressData.pending = this.progressData.pending.map(v1 => ({
      ...v1,
      checked: data
    }));
  }

  onRejectedCheckChange(data) {
    this.progressData.rejected = this.progressData.rejected.map(v1 => ({
      ...v1,
      checked: data
    }));
  }

  onUserCheckChange(data, type) {
    this.checkAll[type] = this.progressData[type].every(v => v.checked);
  }

  toastMessage(type: string) {
    if (type === 'pending') {
      this.snackBar.open(this.noPendingToast.nativeElement.value);
    }

    if (type === 'accepted') {
      this.snackBar.open(this.noAcceptedToast.nativeElement.value);
    }

    if (type === 'rejected') {
      this.snackBar.open(this.noRejectedToast.nativeElement.value);
    }
  }
}
