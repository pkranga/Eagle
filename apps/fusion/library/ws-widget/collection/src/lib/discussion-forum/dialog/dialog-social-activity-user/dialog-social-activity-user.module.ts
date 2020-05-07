/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { DialogSocialActivityUserComponent } from './dialog-social-activity-user.component'
import {
  MatTabsModule,
  MatProgressSpinnerModule,
  MatDialogModule,
  MatIconModule,
  MatDividerModule,
} from '@angular/material'
import { UserImageModule } from '../../../_common/user-image/user-image.module'

@NgModule({
  declarations: [DialogSocialActivityUserComponent],
  imports: [
    CommonModule,
    MatTabsModule,
    MatDividerModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    UserImageModule,
  ],
  entryComponents: [DialogSocialActivityUserComponent],
})
export class DialogSocialActivityUserModule { }
