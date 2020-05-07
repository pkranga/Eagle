/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import {
  MatIconModule,
  MatButtonModule,
  MatTooltipModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatProgressSpinnerModule,
} from '@angular/material'

import { BtnMailUserComponent } from './btn-mail-user.component'
import { BtnMailUserDialogComponent } from './btn-mail-user-dialog/btn-mail-user-dialog.component'

@NgModule({
  declarations: [BtnMailUserComponent, BtnMailUserDialogComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  exports: [BtnMailUserComponent],
  entryComponents: [BtnMailUserComponent, BtnMailUserDialogComponent],
})
export class BtnMailUserModule { }
