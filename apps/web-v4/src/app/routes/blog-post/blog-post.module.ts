/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BlogPostRoutingModule } from './blog-post-routing.module';
import { BlogPostMaterialModule } from './blog-material-module';

import { BlogEditComponent } from './components/blog-edit/blog-edit.component';
import { RecentBlogsComponent } from './components/recent-blogs/recent-blogs.component';
import { BlogViewComponent } from './components/blog-view/blog-view.component';
import { SpinnerModule } from '../../modules/spinner/spinner.module';
import { SocialModule } from '../../modules/social/social.module';
import { MyBlogsComponent } from './components/my-blogs/my-blogs.component';
import { BlogResultsComponent } from './components/blog-results/blog-results.component';
import { EditorQuillModule } from '../../modules/editor-quill/editor-quill.module';
import { UtilityModule } from '../../modules/utility/utility.module';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { BlogReplyComponent } from './components/blog-reply/blog-reply.component';

@NgModule({
  declarations: [
    BlogEditComponent,
    RecentBlogsComponent,
    BlogViewComponent,
    MyBlogsComponent,
    BlogResultsComponent,
    SafeHtmlPipe,
    BlogReplyComponent
  ],
  imports: [
    CommonModule,
    BlogPostRoutingModule,
    BlogPostMaterialModule,
    SpinnerModule,
    SocialModule,
    UtilityModule,
    FormsModule,
    ReactiveFormsModule,
    EditorQuillModule
  ]
})
export class BlogPostModule {}
