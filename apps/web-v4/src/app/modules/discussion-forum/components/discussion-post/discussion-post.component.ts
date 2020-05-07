/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import {
  ITimelineResult,
  IPostUpdateRequestPartial,
  IPostCommentRequestPartial,
  IViewConversationRequestPartial
} from '../../../../models/social.model';
import { AuthService } from '../../../../services/auth.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { DialogDeletePostComponent } from '../../../social/components/dialog-delete-post/dialog-delete-post.component';
import { SocialService } from '../../../../services/social.service';
import { EditorQuillComponent } from '../../../editor-quill/components/editor-quill/editor-quill.component';
import { FetchStatus } from '../../../../models/status.model';

@Component({
  selector: 'ws-discussion-post',
  templateUrl: './discussion-post.component.html',
  styleUrls: ['./discussion-post.component.scss']
})
export class DiscussionPostComponent implements OnInit {
  @Input() post: ITimelineResult;
  @Output() deleteSuccess = new EventEmitter<boolean>();
  @ViewChild('discussionReplyEditor', { static: true }) discussionReplyEditor: EditorQuillComponent;
  editMode = false;
  postPublishEnabled = false;
  updatedBody: string;
  userId = this.authSvc.userId;
  userEmail = this.authSvc.userEmail;
  replyPlaceholderToggler = false;
  isValidReply = false;
  replyBody: string;
  isPostingReply = false;
  replyFetchStatus: FetchStatus;
  conversationRequest: IViewConversationRequestPartial = {
    postId: undefined,
    userId: this.authSvc.userId,
    answerId: '',
    postKind: [],
    sessionId: Date.now(),
    sortOrder: 'latest-desc',
    pgNo: 0,
    pgSize: 2
  };
  postReplies: ITimelineResult[] = [];
  isNewRepliesAvailable = false;
  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private authSvc: AuthService,
    private socialSvc: SocialService
  ) {}

  ngOnInit() {
    this.conversationRequest.postId = this.post.id;
    this.fetchPostReplies();
  }

  deletePost(failMsg: string) {
    const dialogRef = this.dialog.open(DialogDeletePostComponent, {
      data: { postId: this.post.id }
    });
    dialogRef.afterClosed().subscribe(
      data => {
        if (data) {
          this.deleteSuccess.emit(true);
        }
      },
      err => {
        this.snackBar.open(failMsg);
      }
    );
  }

  editPost(failMsg: string) {
    this.post.postContent.title = this.updatedBody;
    this.editMode = false;
    const postUpdateRequest: IPostUpdateRequestPartial = {
      editor: this.authSvc.userId,
      id: this.post.id,
      meta: {
        abstract: '',
        body: '',
        title: this.updatedBody
      },
      postKind: 'Blog'
    };
    this.socialSvc.updatePost(postUpdateRequest).subscribe(
      data => {
        this.updatedBody = undefined;
      },
      err => {
        this.editMode = true;
        this.snackBar.open(failMsg);
      }
    );
  }

  onTextChange(eventData: { isValid: boolean; htmlText: string }) {
    this.postPublishEnabled = eventData.isValid;
    this.updatedBody = eventData.htmlText;
  }

  publishReply(failureMsg: string) {
    this.isPostingReply = true;
    const request: IPostCommentRequestPartial = {
      parentId: this.post.id,
      postContent: {
        body: this.replyBody
      },
      postCreator: this.authSvc.userId,
      postKind: 'Reply',
      source: this.post.source
    };
    this.socialSvc.postReplyOrComment(request).subscribe(
      _ => {
        this.fetchPostReplies(true);
        this.isPostingReply = false;
        this.replyPlaceholderToggler = !this.replyPlaceholderToggler;
        this.discussionReplyEditor.resetEditor();
        this.isValidReply = false;
        this.replyBody = undefined;
      },
      err => {
        this.snackBar.open(failureMsg);
        this.isPostingReply = false;
      }
    );
  }

  onReplyTextChange(eventData: { isValid: boolean; htmlText: string }) {
    this.isValidReply = eventData.isValid;
    this.replyBody = eventData.htmlText;
  }

  fetchPostReplies(forceNew = false) {
    if (this.replyFetchStatus === 'fetching') {
      return;
    }
    if (forceNew) {
      this.conversationRequest.pgNo = 0;
      this.conversationRequest.sessionId = Date.now();
    }
    this.replyFetchStatus = 'fetching';
    this.isNewRepliesAvailable = false;
    this.socialSvc.fetchConversationData(this.conversationRequest).subscribe(data => {
      if (data) {
        this.isNewRepliesAvailable = data.newPostCount ? true : false;
        if (forceNew) {
          this.postReplies = [];
        }
        this.postReplies = [...this.postReplies, ...(data.replyPost || [])];
        if (data.postCount) {
          this.replyFetchStatus = 'hasMore';
        } else {
          this.replyFetchStatus = this.postReplies.length ? 'done' : 'none';
        }
        this.conversationRequest.pgNo += 1;
      }
    });
  }

  onDeleteReply(replyIndex: number) {
    this.postReplies.splice(replyIndex, 1);
  }
}
