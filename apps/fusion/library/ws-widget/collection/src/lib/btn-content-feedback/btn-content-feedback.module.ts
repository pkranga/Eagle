/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { MatButtonModule, MatIconModule, MatTooltipModule, MatDialogModule, MatFormFieldModule, MatInputModule } from '@angular/material'
import { BtnContentFeedbackComponent } from './btn-content-feedback.component'
import { BtnContentFeedbackDialogComponent } from './btn-content-feedback-dialog/btn-content-feedback-dialog.component'

@NgModule({
  declarations: [BtnContentFeedbackComponent, BtnContentFeedbackDialogComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule,
    MatDialogModule,
    MatFormFieldModule,
  ],
  exports: [BtnContentFeedbackComponent],
  entryComponents: [BtnContentFeedbackComponent, BtnContentFeedbackDialogComponent],
})
export class BtnContentFeedbackModule { }
