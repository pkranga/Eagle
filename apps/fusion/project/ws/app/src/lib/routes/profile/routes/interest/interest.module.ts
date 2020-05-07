/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { InterestComponent } from './components/interest/interest.component'
// import { PipeLimitToModule } from '@ws-shared/util'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import {
  MatButtonModule,
  MatSnackBarModule,
  MatChipsModule,
  MatCardModule,
  MatIconModule,
  MatInputModule,
  MatAutocompleteModule,
  MatProgressSpinnerModule,
} from '@angular/material'
import { PipeLimitToModule } from '@ws-widget/utils'

@NgModule({
  declarations: [InterestComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatSnackBarModule,
    MatChipsModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    PipeLimitToModule,
  ],
  exports: [InterestComponent],
})
export class InterestModule {}
