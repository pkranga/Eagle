/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import {
  MatButtonModule,
  MatIconModule,
  MatTooltipModule,
  MatFormFieldModule,
  MatChipsModule,
  MatDialogModule,
  MatProgressSpinnerModule,
  MatInputModule,
} from '@angular/material'

import { UserAutocompleteModule } from '../_common/user-autocomplete/user-autocomplete.module'

import { BtnContentShareComponent } from './btn-content-share.component'
import { BtnContentShareDialogComponent } from './btn-content-share-dialog/btn-content-share-dialog.component'

@NgModule({
  declarations: [BtnContentShareComponent, BtnContentShareDialogComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    UserAutocompleteModule,
  ],
  exports: [BtnContentShareComponent],
  entryComponents: [BtnContentShareComponent, BtnContentShareDialogComponent],
})
export class BtnContentShareModule { }
