/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import {
  MatTabsModule,
  MatFormFieldModule,
  MatInputModule,
  MatSnackBarModule,
  MatIconModule,
  MatMenuModule,
  MatCardModule,
  MatButtonModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatAutocompleteModule,
  MatCheckboxModule,
  MatDialogModule,
  MatRadioModule,
  MatDividerModule,
  MatTableModule,
  MatProgressSpinnerModule,
  MatPaginatorModule,
  MatTooltipModule,
} from '@angular/material'

import { TrainingDashboardRoutingModule } from './training-dashboard-routing.module'
import { HomeComponent } from './components/home/home.component'
import { FeedbackCardComponent } from './components/feedback-card/feedback-card.component'
import { FeedbackFormComponent } from './components/feedback-form/feedback-form.component'
import { FeedbackListComponent } from './components/feedback-list/feedback-list.component'
import { JitCardComponent } from './components/jit-card/jit-card.component'
import { JitFormComponent } from './components/jit-form/jit-form.component'
import { JitListComponent } from './components/jit-list/jit-list.component'
import { TrainingApprovalComponent } from './components/training-approval/training-approval.component'
import { TrainingApprovalCardComponent } from './components/training-approval-card/training-approval-card.component'
import { TrainingFeedbackComponent } from './components/training-feedback/training-feedback.component'
import { TrainingJitComponent } from './components/training-jit/training-jit.component'
import { TrainingRejectDialogComponent } from './components/training-reject-dialog/training-reject-dialog.component'
import { TrainingScheduleComponent } from './components/training-schedule/training-schedule.component'
import { TrainingApiService } from '../../apis/training-api.service'
import { TrainingService } from '../../services/training.service'
import { TrainingPrivilegesResolver } from '../../resolvers/training-privileges.resolver'

@NgModule({
  declarations: [
    HomeComponent,
    FeedbackCardComponent,
    FeedbackFormComponent,
    FeedbackListComponent,
    JitCardComponent,
    JitFormComponent,
    JitListComponent,
    TrainingApprovalComponent,
    TrainingApprovalCardComponent,
    TrainingFeedbackComponent,
    TrainingJitComponent,
    TrainingRejectDialogComponent,
    TrainingScheduleComponent,
  ],
  imports: [
    CommonModule,
    TrainingDashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MatSnackBarModule,
    MatIconModule,
    MatMenuModule,
    MatCardModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatDialogModule,
    MatRadioModule,
    MatDividerModule,
    MatTableModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatTooltipModule,
  ],
  entryComponents: [TrainingRejectDialogComponent],
  providers: [TrainingApiService, TrainingService, TrainingPrivilegesResolver],
})
export class TrainingDashboardModule {}
