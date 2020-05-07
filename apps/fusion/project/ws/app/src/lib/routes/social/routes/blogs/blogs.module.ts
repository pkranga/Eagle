/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { BlogsEditModule } from './blogs-edit/blogs-edit.module'
import { BlogsViewModule } from './blogs-view/blogs-view.module'
import { MyBlogsModule } from './my-blogs/my-blogs.module'
import { RecentBlogsModule } from './recent-blogs/recent-blogs.module'

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BlogsEditModule,
    BlogsViewModule,
    MyBlogsModule,
    RecentBlogsModule,
  ],
})
export class BlogsModule {}
