/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GoalsRoutingModule } from './goals-routing.module';
import { ContentPickerModule } from '../../modules/content-picker/content-picker.module';

// material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import {
  MatButtonModule,
  MatExpansionModule,
  MatTabsModule,
  MatRadioModule,
  MatListModule,
  MatProgressBarModule,
  MatStepperModule,
  MatFormFieldModule,
  MatInputModule,
  MatChipsModule,
  MatProgressSpinnerModule,
  MatCardModule,
  MatDialogModule,
  MatSnackBarModule,
  MatTableModule,
  MatCheckboxModule
} from '@angular/material';

import { GoalsComponent } from './components/goals/goals.component';
import { SpinnerModule } from '../../modules/spinner/spinner.module';
import { AddGoalComponent } from './components/add-goal/add-goal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoalItemComponent } from './components/goal-item/goal-item.component';
import { OthersGoalItemComponent } from './components/others-goal-item/others-goal-item.component';
import { ShareGoalComponent } from './components/share-goal/share-goal.component';
import { ProgressSpinnerModule } from '../../modules/progress-spinner/progress-spinner.module';
import { ActionRequiredComponent } from './components/action-required/action-required.component';
import { ActionItemComponent } from './components/action-item/action-item.component';
import { DeleteSharedGoalComponent } from './components/delete-shared-goal/delete-shared-goal.component';
import { SharedGoalProgressComponent } from './components/shared-goal-progress/shared-goal-progress.component';
import { DaysRemainingPipe } from './pipes/days-remaining.pipe';
import { FormatMailPipe } from './pipes/format-mail.pipe';
import { GoalAcceptDialogComponent } from './components/goal-accept-dialog/goal-accept-dialog.component';
import { GoalRejectDialogComponent } from './components/goal-reject-dialog/goal-reject-dialog.component';
import { MultilineSnackbarComponent } from './components/multiline-snackbar/multiline-snackbar.component';
import { UserGoalDeleteDialogComponent } from './components/user-goal-delete-dialog/user-goal-delete-dialog.component';
import { SharedGoalDeleteDialogComponent } from './components/shared-goal-delete-dialog/shared-goal-delete-dialog.component';

@NgModule({
  declarations: [
    GoalsComponent,
    AddGoalComponent,
    GoalItemComponent,
    OthersGoalItemComponent,
    ShareGoalComponent,
    ActionRequiredComponent,
    ActionItemComponent,
    GoalAcceptDialogComponent,
    GoalRejectDialogComponent,
    DeleteSharedGoalComponent,
    UserGoalDeleteDialogComponent,
    SharedGoalDeleteDialogComponent,
    SharedGoalProgressComponent,
    MultilineSnackbarComponent,
    DaysRemainingPipe,
    FormatMailPipe,
    GoalAcceptDialogComponent,
    GoalRejectDialogComponent,
    MultilineSnackbarComponent
  ],
  imports: [
    CommonModule,
    GoalsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ContentPickerModule,
    MatToolbarModule,
    MatIconModule,
    MatChipsModule,
    MatButtonModule,
    MatDialogModule,
    MatCheckboxModule,
    MatInputModule,
    MatTableModule,
    MatExpansionModule,
    MatTabsModule,
    MatRadioModule,
    MatCardModule,
    MatListModule,
    MatDialogModule,
    MatProgressBarModule,
    MatStepperModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    SpinnerModule,
    ProgressSpinnerModule
  ],
  entryComponents: [
    ShareGoalComponent,
    GoalAcceptDialogComponent,
    GoalRejectDialogComponent,
    UserGoalDeleteDialogComponent,
    SharedGoalDeleteDialogComponent,
    MultilineSnackbarComponent
  ]
})
export class GoalsModule {}
