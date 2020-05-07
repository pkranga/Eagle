/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import {
  MatButtonModule,
  MatIconModule,
  MatTooltipModule,
  MatMenuModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatListModule,
  MatDialogModule,
} from '@angular/material'

import { BtnGoalsComponent } from './btn-goals.component'
import { BtnGoalsDialogComponent } from './btn-goals-dialog/btn-goals-dialog.component'
import { BtnGoalsSelectionComponent } from './btn-goals-selection/btn-goals-selection.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'

@NgModule({
  declarations: [BtnGoalsComponent, BtnGoalsDialogComponent, BtnGoalsSelectionComponent],
  imports: [
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatListModule,
    MatDialogModule,
  ],
  exports: [BtnGoalsComponent],
  entryComponents: [BtnGoalsComponent, BtnGoalsDialogComponent],
})
export class BtnGoalsModule {}
