/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  MatDialogModule,
  MatInputModule,
  MatToolbarModule,
  MatCardModule,
  MatIconModule,
  MatButtonModule,
  MatTabsModule,
  MatRadioModule,
  MatDividerModule,
  MatSnackBarModule,
  MatTooltipModule,
  MatMenuModule
} from '@angular/material';

import { InstructorLedTrainingRoutingModule } from './instructor-led-training-routing.module';
import { InstructorLedTrainingComponent } from './components/instructor-led-training/instructor-led-training.component';
import { TrainingApprovalComponent } from './components/training-approval/training-approval.component';
import { TrainingRejectDialogComponent } from './components/training-reject-dialog/training-reject-dialog.component';
import { TrainingRequestCardComponent } from './components/training-request-card/training-request-card.component';
import { UtilityModule } from '../../modules/utility/utility.module';
import { SpinnerModule } from '../../modules/spinner/spinner.module';
import { TrainingJitComponent } from './components/training-jit/training-jit.component';
import { JitCardComponent } from './components/jit-card/jit-card.component';
import { TrainingModule } from '../../modules/training/training.module';
import { TrainingFeedbackComponent } from './components/training-feedback/training-feedback.component';
import { FeedbackListComponent } from './components/feedback-list/feedback-list.component';
import { FeedbackCardComponent } from './components/feedback-card/feedback-card.component';
import { SchedulesComponent } from './components/schedules/schedules.component';
import { SchedulesService } from './services/schedules.service';
import { DemoMaterialModule } from './materialmodule';
@NgModule({
  declarations: [
    InstructorLedTrainingComponent,
    TrainingApprovalComponent,
    TrainingRejectDialogComponent,
    TrainingRequestCardComponent,
    TrainingJitComponent,
    JitCardComponent,
    TrainingFeedbackComponent,
    FeedbackListComponent,
    FeedbackCardComponent,
    SchedulesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,
    MatToolbarModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    MatRadioModule,
    MatDividerModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatMenuModule,
    UtilityModule,
    DemoMaterialModule,
    SpinnerModule,
    TrainingModule,
    InstructorLedTrainingRoutingModule
  ],
  entryComponents: [TrainingRejectDialogComponent],
  providers:[SchedulesService]
})
export class InstructorLedTrainingModule { }
