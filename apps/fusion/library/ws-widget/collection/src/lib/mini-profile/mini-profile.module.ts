/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MiniProfileComponent } from './mini-profile.component'
import {
  MatDialogModule,
  MatProgressSpinnerModule,
  MatCardModule,
  MatDividerModule,
  MatButtonModule,
  MatIconModule,
  MatChipsModule,
  MatTooltipModule,
} from '@angular/material'
import { PipeNameTransformModule } from '@ws-widget/utils'
import { UserImageModule } from '../_common/user-image/user-image.module'
import {
  PipeContentRouteModule,
} from '../_common/pipe-content-route/pipe-content-route.module'
import { ProfileImageModule } from '../_common/profile-image/profile-image.module'
@NgModule({
  declarations: [MiniProfileComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    PipeNameTransformModule,
    UserImageModule,
    MatChipsModule,
    MatDividerModule,
    MatCardModule,
    PipeContentRouteModule,
    MatProgressSpinnerModule,
    ProfileImageModule,
    MatTooltipModule,
  ],
  entryComponents: [MiniProfileComponent],
  exports: [MiniProfileComponent],
})
export class MiniProfileModule { }
