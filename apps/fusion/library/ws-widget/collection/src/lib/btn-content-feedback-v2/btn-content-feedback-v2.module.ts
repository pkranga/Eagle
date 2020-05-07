/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import {
  MatButtonModule,
  MatIconModule,
  MatTooltipModule,
  MatDialogModule,
  MatProgressSpinnerModule,
  MatFormFieldModule,
  MatInputModule,
  MatSnackBarModule,
} from '@angular/material'

import { EditorQuillModule } from '../discussion-forum/editor-quill/editor-quill.module'

import { BtnContentFeedbackV2Component } from './components/btn-content-feedback-v2/btn-content-feedback-v2.component'
import { BtnContentFeedbackDialogV2Component } from './components/btn-content-feedback-dialog-v2/btn-content-feedback-dialog-v2.component'
import { FeedbackSnackbarComponent } from './components/feedback-snackbar/feedback-snackbar.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

@NgModule({
  declarations: [
    BtnContentFeedbackV2Component,
    BtnContentFeedbackDialogV2Component,
    FeedbackSnackbarComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EditorQuillModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
  ],
  exports: [
    BtnContentFeedbackV2Component,
    BtnContentFeedbackDialogV2Component,
    FeedbackSnackbarComponent,
  ],
  entryComponents: [BtnContentFeedbackDialogV2Component, FeedbackSnackbarComponent],
})
export class BtnContentFeedbackV2Module { }
