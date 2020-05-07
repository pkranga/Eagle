/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import {
  IPostPublishRequestPartial,
  ITimelineRequestPartial,
  ITimeline,
  IDiscussionForumInput
} from '../../../../models/social.model';
import { AuthService } from '../../../../services/auth.service';
import { SocialService } from '../../../../services/social.service';
import { FetchStatus } from '../../../../models/status.model';
import { MatSnackBar } from '@angular/material';
import { EditorQuillComponent } from '../../../editor-quill/components/editor-quill/editor-quill.component';

@Component({
  selector: 'ws-discussion-forum',
  templateUrl: './discussion-forum.component.html',
  styleUrls: ['./discussion-forum.component.scss']
})
export class DiscussionForumComponent implements OnInit {
  @Input() discussionForumInput: IDiscussionForumInput;
  @ViewChild('editorQuill', { static: true }) editorQuill: EditorQuillComponent;
  discussionFetchStatus: FetchStatus;
  discussionRequest: ITimelineRequestPartial = {
    pgNo: 0,
    pgSize: 4,
    postKind: [],
    sessionId: Date.now(),
    type: 'discussionForum',
    userId: this.authSvc.userId,
    source: undefined
  };
  isPostingDiscussion = false;
  discussionResult: ITimeline = {
    hits: 0,
    result: []
  };

  isValidPost = false;
  editorText: string;
  userEmail = this.authSvc.userEmail;
  constructor(private snackBar: MatSnackBar, private authSvc: AuthService, private socialSvc: SocialService) {}

  ngOnInit() {
    if (this.discussionForumInput.initialPostCount) {
      this.discussionRequest.pgSize = this.discussionForumInput.initialPostCount;
    }
    this.discussionRequest.source = {
      contentId: this.discussionForumInput.contentId,
      sourceName: this.discussionForumInput.sourceName
    };
    this.fetchDiscussion();
  }

  fetchDiscussion(refresh = false) {
    this.discussionFetchStatus = 'fetching';
    if (refresh) {
      this.discussionRequest.sessionId = Date.now();
      this.discussionRequest.pgNo = 0;
    }
    this.socialSvc.fetchTimelineData(this.discussionRequest).subscribe(
      data => {
        if (data.hits && data.result) {
          if (refresh) {
            this.discussionResult = {
              hits: 0,
              result: []
            };
          }
          this.discussionResult.hits = data.hits;
          this.discussionResult.result = [...this.discussionResult.result, ...data.result];
          if (data.hits > this.discussionResult.result.length) {
            this.discussionFetchStatus = 'hasMore';
            this.discussionRequest.pgNo += 1;
          } else {
            this.discussionFetchStatus = 'done';
          }
        } else if (!this.discussionResult.result.length) {
          this.discussionFetchStatus = 'none';
        }
      },
      err => {
        this.discussionFetchStatus = 'error';
      }
    );
  }

  publishConversation(failMsg: string) {
    this.isPostingDiscussion = true;
    const postPublishRequest: IPostPublishRequestPartial = {
      postContent: {
        abstract: '',
        body: '',
        title: this.editorText
      },
      postCreator: this.authSvc.userId,
      postKind: 'Blog',
      source: {
        id: this.discussionForumInput.contentId,
        name: this.discussionForumInput.sourceName
      }
    };
    this.socialSvc.publishPost(postPublishRequest).subscribe(
      data => {
        this.editorText = undefined;
        this.isValidPost = false;
        this.isPostingDiscussion = false;
        this.editorQuill.resetEditor();
        this.fetchDiscussion(true);
      },
      err => {
        this.snackBar.open(failMsg);
        this.isPostingDiscussion = false;
      }
    );
  }

  onDeletePost(replyIndex: number) {
    this.discussionResult.result.splice(replyIndex, 1);
    this.discussionResult.hits -= 1;
    if (!this.discussionResult.result.length) {
      this.discussionFetchStatus = 'none';
    }
  }

  onTextChange(eventData: { isValid: boolean; htmlText: string }) {
    this.isValidPost = eventData.isValid;
    this.editorText = eventData.htmlText;
  }
}
