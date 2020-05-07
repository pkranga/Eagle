/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from '@angular/core'
import { NsGoal, BtnGoalsService } from '@ws-widget/collection'
import { MatDialog, MatSnackBar } from '@angular/material'
import { GoalShareDialogComponent } from '../goal-share-dialog/goal-share-dialog.component'
import { GoalDeleteDialogComponent } from '../goal-delete-dialog/goal-delete-dialog.component'
import { GoalSharedDeleteDialogComponent } from '../goal-shared-delete-dialog/goal-shared-delete-dialog.component'
import { TFetchStatus } from '@ws-widget/utils'
import { Router } from '@angular/router'
// import { NoAccessDialogComponent } from '../no-access-dialog/no-access-dialog.component'

@Component({
  selector: 'ws-app-goal-card[type]',
  templateUrl: './goal-card.component.html',
  styleUrls: ['./goal-card.component.scss'],
})
export class GoalCardComponent implements OnInit {
  @ViewChild('errorDurationUpdate', { static: true })
  errorDurationUpdateMessage!: ElementRef<any>
  @ViewChild('durationUpdate', { static: true })
  durationUpdateMessage!: ElementRef<any>
  @Input() goal: NsGoal.IGoal | null = null
  @Input() type: 'me' | 'others' = 'me'
  @Input() showProgress = true

  @Output() updateGoals = new EventEmitter()
  currentTime: number

  isGoalExpanded: { [goalId: string]: boolean } = {}
  editCommonGoal = false
  updateGoalDurationStatus: TFetchStatus = 'none'
  updatedGoalDuration = 1
  isGoalContentViewMore: { [goalId: string]: boolean } = {}

  goalProgressBarStyle: { left: string } = { left: '0%' }

  constructor(
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private goalSvc: BtnGoalsService,
  ) {
    const now = new Date()
    this.currentTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
    ).getTime()
  }

  ngOnInit() {
    if (this.goal) {
      this.updatedGoalDuration = this.goal.duration || 1
      const progress = Math.round((this.goal.progress || 0) * 100)
      this.goalProgressBarStyle = {
        left: `${Math.min(85, progress + 1)}%`,
      }
    }
    // this.checkNoAccess()
  }

  // checkNoAccess() {
  //   if (this.goal && this.goal.contentProgress) {
  //     console.log('inside')
  //     this.goal.contentProgress.forEach(content => {
  //       if (content && !content.hasAccess) { return true } return false
  //     })
  //   }
  // }

  editGoal() {
    if (this.goal) {
      if (this.goal.type.includes('common')) {
        this.editCommonGoal = true
        this.isGoalExpanded[this.goal.id] = true
      } else {
        this.router.navigate([`/app/goals/edit/${this.type}/${this.goal.id}`])
      }
    }
  }

  updateCommonGoalDuration() {
    if (this.goal) {
      this.updateGoalDurationStatus = 'fetching'
      this.goalSvc
        .updateDurationCommonGoal(
          this.goal.type,
          this.goal.id,
          this.updatedGoalDuration,
        )
        .subscribe(
          () => {
            this.updateGoalDurationStatus = 'done'
            this.updateGoals.emit()
            this.snackbar.open(this.durationUpdateMessage.nativeElement.value)
          },
          () => {
            this.updateGoalDurationStatus = 'error'
            this.snackbar.open(
              this.errorDurationUpdateMessage.nativeElement.value,
            )
          },
        )
    }
  }

  openShareGoalDialog(goal: NsGoal.IGoal) {
    // console.log(this.checkNoAccess())

    // if (this.checkNoAccess()) {
    //   this.dialog.open(NoAccessDialogComponent, {
    //     data: {
    //       type: 'share',
    //     },
    //     width: '600px',
    //   })
    // } else {

    const dialogRef = this.dialog.open(GoalShareDialogComponent, {
      data: goal,
      width: '600px',
    })

    dialogRef.afterClosed().subscribe(shared => {
      if (shared) {
        this.updateGoals.emit()
      }
    })
    // }
  }

  openDeleteDialog() {
    if (this.goal && this.goal.isShared) {
      const dialogRef = this.dialog.open(GoalSharedDeleteDialogComponent, {
        data: this.goal,
      })

      dialogRef.afterClosed().subscribe(deleted => {
        if (deleted) {
          this.updateGoals.emit()
        }
      })
    }

    if (this.goal && !this.goal.isShared) {
      const dialogRef = this.dialog.open(GoalDeleteDialogComponent, {
        data: this.goal,
      })

      dialogRef.afterClosed().subscribe(deleted => {
        if (deleted) {
          this.updateGoals.emit()
        }
      })
    }
  }
}
