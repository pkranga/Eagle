/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { BlogEditComponent } from './routes/blogs/blogs-edit/components/blog-edit.component'
import { RecentBlogComponent } from './routes/blogs/recent-blogs/components/recent-blog.component'
import { MyBlogComponent } from './routes/blogs/my-blogs/components/my-blog.component'
import { BlogViewComponent } from './routes/blogs/blogs-view/components/blog-view.component'
import { PostFetchResolverService } from './resolvers/post-fetch-resolver.service'
import { QnaHomeComponent } from './routes/qna/qna-home/components/qna-home/qna-home.component'
import { QnaEditComponent } from './routes/qna/qna-edit/components/qna-edit/qna-edit.component'
import { QnaViewComponent } from './routes/qna/qna-view/components/qna-view/qna-view.component'
import { SocialTimelineResolverService } from './resolvers/social-timeline-resolver.service'

const routes: Routes = [
  {
    path: 'blogs',
    component: RecentBlogComponent,
  },
  {
    path: 'blogs/edit',
    component: BlogEditComponent,
  },
  {
    path: 'blogs/edit/:id',
    component: BlogEditComponent,
  },
  {
    path: 'blogs/me',
    pathMatch: 'full',
    redirectTo: 'blogs/me/drafts',
  },
  {
    path: 'blogs/me/:tab',
    component: MyBlogComponent,
  },
  {
    path: 'blogs/:id',
    component: BlogViewComponent,
  },
  {
    path: 'qna',
    component: QnaHomeComponent,
    resolve: {
      resolveData: SocialTimelineResolverService,
    },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    data: {
      postKind: ['Query'],
      type: 'all',
    },
  },
  {
    path: 'qna/edit',
    component: QnaEditComponent,
  },
  {
    path: 'qna/edit/:id',
    component: QnaEditComponent,
    resolve: {
      resolveData: PostFetchResolverService,
    },
  },
  {
    path: 'qna/:id',
    component: QnaViewComponent,
    resolve: {
      resolveData: PostFetchResolverService,
    },
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SocialRoutingModule { }
