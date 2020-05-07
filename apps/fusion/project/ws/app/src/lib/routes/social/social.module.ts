/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { SocialRoutingModule } from './social-routing.module'
import { BlogsModule } from './routes/blogs/blogs.module'
import { QnaModule } from './routes/qna/qna.module'
import { PostFetchResolverService } from './resolvers/post-fetch-resolver.service'
import { SocialTimelineResolverService } from './resolvers/social-timeline-resolver.service'

@NgModule({
  declarations: [],
  imports: [CommonModule, SocialRoutingModule, BlogsModule, QnaModule],
  providers: [PostFetchResolverService, SocialTimelineResolverService],
})
export class SocialModule { }
