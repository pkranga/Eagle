/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import {
  IAcceptAnswerPartial,
  IPostCommentRequestPartial,
  IPostUpdateRequestPartial,
  ITimelineResult,
  IViewConversationRequestPartial,
  IViewConversationResult
} from '../../../../models/social.model';
import { FetchStatus } from '../../../../models/status.model';
import { DialogDeletePostComponent } from '../../../../modules/social/components/dialog-delete-post/dialog-delete-post.component';
import { AuthService } from '../../../../services/auth.service';
import { SocialService } from '../../../../services/social.service';

@Component({
  selector: 'app-qnada-reply-view',
  templateUrl: './qnada-reply-view.component.html',
  styleUrls: ['./qnada-reply-view.component.scss']
})
export class QnadaReplyViewComponent implements OnInit {
  @Input() item: ITimelineResult;
  @Input() parentPostCreatorId: string;
  @Input() isAcceptedAnswer = false;

  @Output() acceptAnswerEvent = new EventEmitter<string>();
  @Output() deleteSuccess = new EventEmitter<{ isAccepted: boolean; id: string }>();
  isAcceptingAnswerInProgress = false;
  userId = this.authSvc.userId;
  commentConversationRequest: IViewConversationRequestPartial = {
    postId: '',
    userId: this.authSvc.userId,
    answerId: '',
    postKind: ['Comment'],
    sessionId: Date.now(),
    pgNo: 0,
    pgSize: 5,
    sortOrder: 'latest-desc'
  };
  commentPostRequest: IPostCommentRequestPartial = {
    postKind: 'Comment',
    parentId: '',
    postCreator: this.authSvc.userId,
    postContent: {
      body: ''
    }
  };

  commentData: IViewConversationResult;
  commentFetchStatus: FetchStatus;
  isPostingComment = false;

  editMode = false;
  replyPostEnabled = false;
  updatedBody: string;
  constructor(private socialSvc: SocialService, private authSvc: AuthService, private dialog: MatDialog, private snackBar: MatSnackBar) {}

  ngOnInit() {
    if (this.item && this.item.id) {
      this.commentConversationRequest.postId = this.item.id;
      this.commentPostRequest.parentId = this.item.id;
      this.fetchQuestionComments();
    }
  }

  postComment() {
    this.isPostingComment = true;
    this.socialSvc.postReplyOrComment(this.commentPostRequest).subscribe(
      data => {
        this.isPostingComment = false;
        this.commentPostRequest.postContent.body = '';
        this.fetchQuestionComments(true);
      },
      err => {
        this.isPostingComment = false;
      }
    );
  }

  fetchQuestionComments(forceNew = false) {
    if (!this.commentConversationRequest.postId) {
      this.commentConversationRequest.postId = this.item.id;
    }
    if (forceNew) {
      this.commentConversationRequest.pgNo = 0;
      this.commentConversationRequest.sessionId = Date.now();
      this.commentData.replyPost = [];
    }
    this.commentFetchStatus = 'fetching';
    this.socialSvc.fetchConversationData(this.commentConversationRequest).subscribe(
      data => {
        if (data && data.replyPost) {
          if (!this.commentData) {
            this.commentData = data;
          } else {
            this.commentData.newPostCount = data.newPostCount;
            this.commentData.postCount = data.postCount;
            this.commentData.replyPost = [...this.commentData.replyPost, ...data.replyPost];
          }
        }
        this.commentConversationRequest.pgNo += 1;
        this.commentFetchStatus = 'done';
      },
      err => {
        this.commentFetchStatus = 'error';
      }
    );
  }

  acceptAnswer(acceptAnswerMsg: string) {
    if (this.userId === this.item.postCreator.postCreatorId) {
      this.snackBar.open(acceptAnswerMsg);
      return;
    }
    if (this.isAcceptingAnswerInProgress || this.isAcceptedAnswer) {
      return;
    }
    this.isAcceptingAnswerInProgress = true;
    const requestBody: IAcceptAnswerPartial = {
      acceptedAnswer: this.item.id,
      userId: this.userId
    };
    this.socialSvc.acceptAnswer(requestBody).subscribe(_ => {
      this.isAcceptedAnswer = true;
      this.isAcceptingAnswerInProgress = false;
      this.acceptAnswerEvent.emit(this.item.id);
    });
  }

  deleteReply(failMsg: string) {
    const dialogRef = this.dialog.open(DialogDeletePostComponent, {
      data: { postId: this.item.id }
    });
    dialogRef.afterClosed().subscribe(
      data => {
        if (data) {
          this.deleteSuccess.emit({ isAccepted: this.isAcceptedAnswer, id: this.item.id });
        }
      },
      err => {
        this.snackBar.open(failMsg);
      }
    );
  }

  editReply(failMsg: string) {
    this.item.postContent.body = this.updatedBody;
    this.editMode = false;
    const postUpdateRequest: IPostUpdateRequestPartial = {
      editor: this.authSvc.userId,
      id: '',
      meta: {
        abstract: '',
        body: '',
        title: ''
      },
      postKind: 'Reply'
    };
    postUpdateRequest.id = this.item.id;
    postUpdateRequest.meta = {
      abstract: '',
      title: '',
      body: this.updatedBody
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
    this.replyPostEnabled = eventData.isValid;
    this.updatedBody = eventData.htmlText;
  }
}
