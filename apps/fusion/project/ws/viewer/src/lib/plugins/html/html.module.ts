/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import {
  MatCardModule,
  MatButtonModule,
  MatDividerModule,
  MatProgressSpinnerModule,
  MatProgressBarModule,
  MatSnackBarModule,
  MatIconModule,
  MatTooltipModule,
} from '@angular/material'

import { HtmlComponent } from './html.component'
import { RouterModule } from '@angular/router'

@NgModule({
  declarations: [HtmlComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatIconModule,
    RouterModule,
    MatTooltipModule,
  ],
  exports: [
    HtmlComponent,
  ],
})
export class HtmlModule { }
