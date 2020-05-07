/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MarkAsCompleteComponent } from './mark-as-complete.component'
import {
  MatCardModule,
  MatIconModule,
  MatDividerModule,
  MatButtonModule,
  MatDialogModule,
  MatProgressSpinnerModule,
  MatSnackBarModule,
  MatTooltipModule,
} from '@angular/material'
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component'
import { RouterModule } from '@angular/router'
import { AppTocService } from '@ws/app/src/lib/routes/app-toc/services/app-toc.service'

@NgModule({
  declarations: [MarkAsCompleteComponent, ConfirmDialogComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule,
    RouterModule,
  ],
  providers: [AppTocService],
  entryComponents: [ConfirmDialogComponent],
  exports: [MarkAsCompleteComponent],
})
export class MarkAsCompleteModule { }
