/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { BlogResultComponent } from './components/blog-result.component'
import { RouterModule } from '@angular/router'
import {
  MatMenuModule,
  MatIconModule,
  MatDividerModule,
  MatButtonModule,
  MatProgressSpinnerModule,
} from '@angular/material'
import { PipeSafeSanitizerModule } from '@ws-widget/utils'
import { DialogSocialDeletePostModule, BtnPageBackModule } from '@ws-widget/collection'

@NgModule({
  declarations: [BlogResultComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatMenuModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    PipeSafeSanitizerModule,
    DialogSocialDeletePostModule,
    BtnPageBackModule,
  ],
  exports: [BlogResultComponent],
})
export class BlogsResultModule {}
