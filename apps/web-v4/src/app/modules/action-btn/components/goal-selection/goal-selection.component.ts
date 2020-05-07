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
import { MAT_DIALOG_DATA, MatSnackBar, MatDialogRef } from '@angular/material';
import { GoalsService } from '../../../../services/goals.service';
import { IUserGoal } from '../../../../models/goal.model';
import { FormControl, Validators } from '@angular/forms';

interface IGoalSelectionUnit {
  goal: IUserGoal;
  hasContent: boolean;
  isUpdating?: boolean;
}

@Component({
  selector: 'app-goal-selection',
  templateUrl: './goal-selection.component.html',
  styleUrls: ['./goal-selection.component.scss']
})
export class GoalSelectionComponent implements OnInit {
  @ViewChild('goalUpdateSuccess', { static: true }) goalUpdateSuccess: ElementRef;
  @ViewChild('failedGoalToast', { static: true }) failedGoalToast: ElementRef;

  goals: IGoalSelectionUnit[] = [];
  isFetching = true;
  hasErrorInFetching = false;
  goalCreationEnabled = false;
  isCreating = false;

  goalNameFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(10)
  ]);
  goalDurationFormControl = new FormControl('', [
    Validators.required,
    Validators.min(1),
    Validators.pattern('^[1-9][0-9]*')
  ]);

  constructor(
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<GoalSelectionComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { contentId: string; title: string; contentDuration: number },
    private goalSvc: GoalsService
  ) { }

  ngOnInit() {
    if (this.data.contentDuration) {
      this.data.contentDuration = Math.floor(this.data.contentDuration / 3600);
    }
    this.goalSvc.userGoals.subscribe(
      goals => {
        if (!goals) {
          this.goalSvc.updateUserGoals();
          return;
        }
        this.goals = goals.map(
          (goal): IGoalSelectionUnit => ({
            goal,
            hasContent: goal.goal_content_id.includes(this.data.contentId)
          })
        );
        this.isFetching = false;
        if (this.goals.length === 0) {
          this.goalCreationEnabled = true;
        }
      },
      error => {
        this.isFetching = false;
        this.hasErrorInFetching = true;
      }
    );
  }
  updateGoal(unitGoal: IGoalSelectionUnit) {
    // console.log('unitGoal >', unitGoal);
    if (unitGoal.hasContent) {
      unitGoal.isUpdating = true;
      this.goalSvc
        .removeContentFromGoal(unitGoal.goal, this.data.contentId)
        .subscribe(
        () => {
          this.snackBar.open(this.goalUpdateSuccess.nativeElement.value);
          unitGoal.isUpdating = false;
        },
        () => {
          this.snackBar.open(this.failedGoalToast.nativeElement.value);
          unitGoal.isUpdating = false;
        }
        );
    } else {
      this.goalSvc
        .addContentToGoal(unitGoal.goal, this.data.contentId)
        .subscribe(
        () => {
          this.snackBar.open(this.goalUpdateSuccess.nativeElement.value);
        },
        err => {
          this.snackBar.open(this.failedGoalToast.nativeElement.value);
        }
        );
    }
  }
  goalTrackBy(index: number, item: IGoalSelectionUnit) {
    return item.goal.goal_id;
  }

  cancelGoalCreation() {
    this.goalCreationEnabled = false;
    if (this.goals.length === 0) {
      this.dialogRef.close();
    }
  }

  createGoal(name: string, duration, createGoalToast: string) {
    // console.log('GOAL CREATION :: FIX THIS', name, duration);
    let request;
    this.isCreating = true;
    try {
      request = {
        goal_content_id: [this.data.contentId],
        goal_desc: '',
        goal_duration: parseInt(duration, 10) || 0,
        goal_title: name,
        goal_type: 'user'
      };
    } catch (e) {
      request = {
        goal_content_id: [this.data.contentId],
        goal_desc: '',
        goal_duration: 1,
        goal_title: name,
        goal_type: 'user'
      };
    }
    this.goalSvc.createGoal(request).subscribe(
      data => {
        console.log('goal:', data);
        this.isCreating = false;
        this.goalCreationEnabled = false;
        this.snackBar.open(createGoalToast);
      },
      err => {
        this.isCreating = false;
        this.goalCreationEnabled = false;
        this.snackBar.open(this.failedGoalToast.nativeElement.value);
      }
    );
  }
}
