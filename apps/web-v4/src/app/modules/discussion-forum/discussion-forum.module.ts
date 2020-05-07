/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilityModule } from '../utility/utility.module';
import { SocialModule } from '../social/social.module';
import { SpinnerModule } from '../spinner/spinner.module';
import { EditorQuillModule } from '../editor-quill/editor-quill.module';
import {
  MatInputModule,
  MatFormFieldModule,
  MatIconModule,
  MatToolbarModule,
  MatButtonModule,
  MatTooltipModule,
  MatMenuModule,
  MatCardModule
} from '@angular/material';

import { DiscussionForumComponent } from './components/discussion-forum/discussion-forum.component';
import { DiscussionReplyComponent } from './components/discussion-reply/discussion-reply.component';
import { DiscussionPostComponent } from './components/discussion-post/discussion-post.component';

@NgModule({
  declarations: [DiscussionForumComponent, DiscussionReplyComponent, DiscussionPostComponent],
  imports: [
    CommonModule,
    UtilityModule,
    EditorQuillModule,
    SocialModule,
    SpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatTooltipModule,
    MatMenuModule,
    MatCardModule
  ],
  exports: [DiscussionForumComponent]
})
export class DiscussionForumModule {}
