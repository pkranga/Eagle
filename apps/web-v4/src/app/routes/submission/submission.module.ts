/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  MatDialogModule,
  MatRadioModule,
  MatButtonModule,
  MatIconModule,
  MatToolbarModule,
  MatTooltipModule,
  MatFormFieldModule,
  MatInputModule,
  MatCardModule,
  MatChipsModule,
  MatTableModule,
  MatSelectModule,
  MatSlideToggleModule,
  MatPaginatorModule,
  MatSortModule,
  MatTabsModule
} from '@angular/material';
import { ElementFullscreenModule } from '../../modules/element-fullscreen/element-fullscreen.module';
import { SpinnerModule } from '../../modules/spinner/spinner.module';
import { SubmissionRoutingModule } from './submission-routing.module';
import { SubmissionComponent } from './components/submission/submission.component';
import { AceEditorModule } from 'ng2-ace-editor';
import { EducatorHomeComponent } from './components/educator-home/educator-home.component';
import { UtilityModule } from '../../modules/utility/utility.module';
import { ViewContentComponent } from './components/view-content/view-content.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { ViewContentDialogComponent } from './components/view-content-dialog/view-content-dialog.component';

@NgModule({
  declarations: [
    SubmissionComponent,
    EducatorHomeComponent,
    ViewContentComponent,
    FeedbackComponent,
    ViewContentDialogComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SubmissionRoutingModule,
    MatIconModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatCardModule,
    MatTableModule,
    AceEditorModule,
    MatSelectModule,
    UtilityModule,
    SpinnerModule,
    ElementFullscreenModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatChipsModule,
    MatRadioModule,
    MatPaginatorModule,
    MatSortModule,
    MatTabsModule
  ],
  entryComponents: [
    ViewContentDialogComponent
  ]
})
export class SubmissionModule { }
