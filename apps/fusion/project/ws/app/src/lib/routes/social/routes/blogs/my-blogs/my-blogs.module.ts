/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MyBlogComponent } from './components/my-blog.component'
import { MatToolbarModule, MatIconModule, MatTabsModule, MatButtonModule } from '@angular/material'
import { RouterModule } from '@angular/router'
import { BlogsResultModule } from '../blogs-result/blogs-result.module'
import { BtnPageBackModule } from '@ws-widget/collection'

@NgModule({
  declarations: [MyBlogComponent],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    RouterModule,
    MatTabsModule,
    BlogsResultModule,
    MatButtonModule,
    BtnPageBackModule,
  ],
  exports: [MyBlogComponent],
})
export class MyBlogsModule { }
