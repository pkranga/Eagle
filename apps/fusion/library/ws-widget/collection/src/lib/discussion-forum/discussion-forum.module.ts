/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { DiscussionForumComponent } from './components/discussion-forum/discussion-forum.component'
import { DiscussionPostComponent } from './components/discussion-post/discussion-post.component'
import { DiscussionReplyComponent } from './components/discussion-reply/discussion-reply.component'
import {
  MatInputModule,
  MatFormFieldModule,
  MatIconModule,
  MatToolbarModule,
  MatButtonModule,
  MatTooltipModule,
  MatChipsModule,
  MatMenuModule,
  MatCardModule,
  MatProgressSpinnerModule,
  MatCheckboxModule,
} from '@angular/material'
import { EditorQuillModule } from './editor-quill/editor-quill.module'
import { UserImageModule } from '../_common/user-image/user-image.module'
import { BtnSocialVoteModule } from './actionBtn/btn-social-vote/btn-social-vote.module'
import { BtnSocialLikeModule } from './actionBtn/btn-social-like/btn-social-like.module'
import { DialogSocialActivityUserModule } from './dialog/dialog-social-activity-user/dialog-social-activity-user.module'
import { DialogSocialDeletePostModule } from './dialog/dialog-social-delete-post/dialog-social-delete-post.module'

@NgModule({
  declarations: [DiscussionForumComponent, DiscussionPostComponent, DiscussionReplyComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatTooltipModule,
    MatMenuModule,
    MatChipsModule,
    MatCardModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    BtnSocialVoteModule,
    BtnSocialLikeModule,
    EditorQuillModule,
    UserImageModule,
    DialogSocialActivityUserModule,
    DialogSocialDeletePostModule,
  ],
  exports: [DiscussionForumComponent],
  entryComponents: [DiscussionForumComponent],
})
export class DiscussionForumModule { }
