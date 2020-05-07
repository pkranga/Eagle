/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BlogEditComponent } from './components/blog-edit/blog-edit.component';
import { RecentBlogsComponent } from './components/recent-blogs/recent-blogs.component';
import { BlogViewComponent } from './components/blog-view/blog-view.component';
import { MyBlogsComponent } from './components/my-blogs/my-blogs.component';

const routes: Routes = [
  {
    path: '',
    component: RecentBlogsComponent
  },
  {
    path: 'edit',
    component: BlogEditComponent
  },
  {
    path: 'edit/:id',
    component: BlogEditComponent
  },
  {
    path: 'me',
    component: MyBlogsComponent
  },
  {
    path: 'me/:tab',
    component: MyBlogsComponent
  },
  {
    path: ':id',
    component: BlogViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogPostRoutingModule {}
