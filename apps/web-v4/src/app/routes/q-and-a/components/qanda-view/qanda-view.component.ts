/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { IPostCommentRequestPartial, ITimelineResult, IViewConversationRequestPartial, IViewConversationResult } from '../../../../models/social.model';
import { FetchStatus } from '../../../../models/status.model';
import { EditorQuillComponent } from '../../../../modules/editor-quill/components/editor-quill/editor-quill.component';
import { DialogDeletePostComponent } from '../../../../modules/social/components/dialog-delete-post/dialog-delete-post.component';
import { AuthService } from '../../../../services/auth.service';
import { RoutingService } from '../../../../services/routing.service';
import { SocialService } from '../../../../services/social.service';

@Component({
  selector: 'app-qanda-view',
  templateUrl: './qanda-view.component.html',
  styleUrls: ['./qanda-view.component.scss']
})
export class QandaViewComponent implements OnInit {
  @ViewChild('editor', { static: true }) editorQuill: EditorQuillComponent;
  questionData: IViewConversationResult;
  commentData: IViewConversationResult;
  postId: string;
  postFetchStatus: FetchStatus;
  commentFetchStatus: FetchStatus;
  isPostingComment: boolean;
  isPostingReply: boolean;

  commentPostRequest: IPostCommentRequestPartial = {
    postKind: 'Comment',
    parentId: '',
    postCreator: this.auth.userId,
    postContent: {
      body: ''
    }
  };

  commentConversationRequest: IViewConversationRequestPartial = {
    postId: this.postId,
    userId: this.auth.userId,
    answerId: '',
    postKind: ['Comment'],
    sessionId: Date.now(),
    pgNo: 0,
    pgSize: 5,
    sortOrder: 'latest-desc'
  };

  conversationRequest: IViewConversationRequestPartial = {
    postId: this.postId,
    userId: this.auth.userId,
    answerId: '',
    postKind: ['Reply'],
    sessionId: Date.now(),
    pgNo: 0,
    pgSize: 5,
    sortOrder: 'latest-desc'
  };

  replyPostRequest: IPostCommentRequestPartial = {
    postKind: 'Reply',
    parentId: '',
    postCreator: this.auth.userId,
    postContent: {
      body: ''
    }
  };

  userId = this.auth.userId;
  isValidForUserAnswer = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private socialSvc: SocialService,
    public routingSvc: RoutingService,
    private snackBar: MatSnackBar,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.postId = params.id;
      this.conversationRequest.postId = this.postId;
      this.fetchConversationData(true, true);
    });
  }

  fetchConversationData(forceNew: boolean, fetchComments = false) {
    if (forceNew) {
      this.conversationRequest.pgNo = 0;
      this.conversationRequest.sessionId = Date.now();
    }
    this.postFetchStatus = 'fetching';
    this.socialSvc.fetchConversationData(this.conversationRequest).subscribe(
      data => {
        if (data) {
          if (data.mainPost && data.mainPost.id && (!this.questionData || forceNew)) {
            // console.log('assigning new data');
            this.questionData = data;
            if (this.questionData.mainPost.status === 'Draft') {
              this.router.navigate(['qna', 'ask', this.postId]);
            } else if (this.questionData.mainPost.status === 'Inactive') {
              this.router.navigate(['error', 'forbidden']);
            }
            this.postFetchStatus = 'done';
          } else if (
            (!data.mainPost || !data.mainPost.id) &&
            this.questionData
          ) {
            // console.log('Appending replies');
            if (forceNew) {
              this.questionData.replyPost = [];
            }
            this.questionData.replyPost = [
              ...this.questionData.replyPost,
              ...(data.replyPost || [])
            ];
            this.questionData.postCount = data.postCount || 0;
            this.questionData.newPostCount = data.newPostCount || 0;
            this.postFetchStatus = 'done';
          } else if (
            (!data.mainPost || !data.mainPost.id) &&
            !this.questionData
          ) {
            // console.log('No Data');
            this.postFetchStatus = 'none';
          }
          if (fetchComments) {
            this.fetchQuestionComments();
          }
        } else if (!this.questionData) {
          this.postFetchStatus = 'none';
        }
        this.conversationRequest.pgNo += 1;
      },
      err => {
        this.postFetchStatus = 'error';
      }
    );
  }

  private fetchQuestionComments(forceNew = false) {
    if (!this.commentConversationRequest.postId) {
      this.commentConversationRequest.postId = this.postId;
    }
    if (forceNew) {
      this.commentConversationRequest.pgNo = 0;
      this.commentConversationRequest.sessionId = Date.now();
      this.commentData.replyPost = [];
    }
    this.commentFetchStatus = 'fetching';
    this.socialSvc
      .fetchConversationData(this.commentConversationRequest)
      .subscribe(
        data => {
          if (data && data.replyPost) {
            if (!this.commentData) {
              this.commentData = data;
            } else {
              this.commentData.newPostCount = data.newPostCount;
              this.commentData.postCount = data.postCount;
              this.commentData.replyPost = [
                ...this.commentData.replyPost,
                ...data.replyPost
              ];
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

  postComment(postKind: 'Comment') {
    this.isPostingComment = true;
    this.commentPostRequest.parentId = this.postId;
    this.commentPostRequest.postKind = postKind;
    this.socialSvc.postReplyOrComment(this.commentPostRequest).subscribe(
      data => {
        this.commentPostRequest.postContent.body = '';
        this.isPostingComment = false;
        this.fetchQuestionComments(true);
      },
      err => {
        this.isPostingComment = false;
      }
    );
  }

  postReply() {
    this.isPostingReply = true;
    this.replyPostRequest.parentId = this.postId;
    this.replyPostRequest.postKind = 'Reply';
    this.socialSvc.postReplyOrComment(this.replyPostRequest).subscribe(
      data => {
        this.replyPostRequest.postContent.body = '';
        this.isPostingReply = false;
        this.editorQuill.resetEditor();
        this.isValidForUserAnswer = false;
        this.fetchConversationData(true);
      },
      err => {
        this.isPostingReply = false;
      }
    );
  }

  deletePost(successMsg: string) {
    const dialogRef = this.dialog.open(DialogDeletePostComponent, {
      data: { postId: this.postId }
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.router.navigate(['qna', 'me']);
        this.snackBar.open(successMsg);
      }
    });
  }

  onAnswerAccept(itemId: string) {
    try {
      const itemIndex = this.questionData.replyPost.findIndex(
        reply => reply.id === itemId
      );
      const pullItem = this.questionData.replyPost.splice(itemIndex, 1);
      let replyItem: ITimelineResult;
      if (
        this.questionData.acceptedAnswer &&
        this.questionData.acceptedAnswer.id
      ) {
        replyItem = { ...this.questionData.acceptedAnswer };
      }
      this.questionData.acceptedAnswer = pullItem[0];
      if (replyItem) {
        this.questionData.replyPost.push(replyItem);
      }
      const acceptedAnswerElement = document.getElementById('answers');
      if (acceptedAnswerElement) {
        acceptedAnswerElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    } catch (e) {
      console.error(
        'ERROR WHILE FILLING ACCEPTED ANSWER IN CACHE DATA. RE-FETCHING CONVERSATION DATA'
      );
      this.fetchConversationData(true);
    }
  }

  onDeleteSuccess(data: {isAccepted: boolean, id: string}) {
    try {
      if (!data.isAccepted) {
        const itemIndex = this.questionData.replyPost.findIndex(
          reply => reply.id === data.id
        );
        this.questionData.replyPost.splice(itemIndex, 1);
      } else {
        this.questionData.acceptedAnswer = null;
      }
    } catch (e) {}
  }

  onTextChange(event: { htmlText: string; isValid: boolean }) {
    this.replyPostRequest.postContent.body = event.htmlText || '';
    this.isValidForUserAnswer = event.isValid;
  }
}
