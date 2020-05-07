/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RecentBlogComponent } from './components/recent-blog.component'
import { BtnSocialLikeModule, BtnPageBackModule } from '@ws-widget/collection'
import {
  MatIconModule,
  MatMenuModule,
  MatToolbarModule,
  MatCardModule,
  MatProgressSpinnerModule,
  MatButtonModule,
} from '@angular/material'
import { RouterModule } from '@angular/router'

@NgModule({
  declarations: [RecentBlogComponent],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    BtnSocialLikeModule,
    RouterModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    BtnPageBackModule,
  ],
  exports: [RecentBlogComponent],
})
export class RecentBlogsModule { }
