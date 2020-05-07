/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FeedbackRoutingModule } from './feedback-routing.module'
import { FeedbackComponent } from '../feedback/components/feedback/feedback.component'
import { FormsModule } from '@angular/forms'

import {
  MatToolbarModule,
  MatIconModule,
  MatCardModule,
  MatButtonModule,
  MatInputModule,
  MatSnackBarModule,
  MatTabsModule,
  MatFormFieldModule,
} from '@angular/material'
@NgModule({
  declarations: [FeedbackComponent],
  imports: [
    CommonModule,
    FeedbackRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatSnackBarModule,
    MatTabsModule,
    MatFormFieldModule,
    FormsModule,
  ],
})
export class FeedbackModule {}
