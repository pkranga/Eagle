/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IPostCommentRequestPartial,
  IViewConversationRequestPartial,
  IViewConversationResult
} from '../../../../models/social.model';
import { FetchStatus } from '../../../../models/status.model';
import { DialogDeletePostComponent } from '../../../../modules/social/components/dialog-delete-post/dialog-delete-post.component';
import { AuthService } from '../../../../services/auth.service';
import { RoutingService } from '../../../../services/routing.service';
import { SocialService } from '../../../../services/social.service';

@Component({
  selector: 'ws-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.scss']
})
export class BlogsComponent implements OnInit {
  conversation: IViewConversationResult;
  isFirstConversationRequestDone = false;
  conversationRequest: IViewConversationRequestPartial = {
    postId: undefined,
    userId: this.authSvc.userId,
    answerId: '',
    postKind: [],
    sessionId: Date.now(),
    sortOrder: 'latest-desc',
    pgNo: 0,
    pgSize: 10
  };
  fetchStatus: FetchStatus;
  canUserEdit = false;
  commentEnabled = false;
  commentText: string;
  postingComment = false;
  resetEditor = false;
  userEmail = this.authSvc.userEmail;

  constructor(
    public routingSvc: RoutingService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private authSvc: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private socialSvc: SocialService
  ) {}
  paramSubscription;
  ngOnInit() {
    this.paramSubscription = this.route.data.subscribe(data => {
      const conv = data.playerDetails.conversation;
      if (conv && conv.mainPost) {
        this.isFirstConversationRequestDone = true;
        this.conversation = conv;
      }
    });
    this.route.paramMap.subscribe(params => {
      this.conversationRequest.postId = params.get('resourceId');
      this.fetchConversationData();
    });
  }

  fetchConversationData(forceNew = false) {
    if (this.fetchStatus === 'fetching') {
      return;
    }
    this.fetchStatus = 'fetching';
    if (forceNew) {
      this.conversationRequest.sessionId = Date.now();
      this.conversationRequest.pgNo = 0;
    }
    this.socialSvc.fetchConversationData(this.conversationRequest).subscribe(
      data => {
        this.conversationRequest.pgNo += 1;
        if (!this.isFirstConversationRequestDone && data && data.mainPost) {
          this.conversation = data;
          if (this.conversation.mainPost.status === 'Draft') {
            this.router.navigate(['blog-post', 'edit', this.conversationRequest.postId]);
          } else if (this.conversation.mainPost.status === 'Inactive') {
            this.router.navigate(['error', 'forbidden']);
          }
          this.isFirstConversationRequestDone = true;
          if (
            this.conversation &&
            this.conversation.mainPost &&
            this.conversation.mainPost.postCreator &&
            this.authSvc.userId === this.conversation.mainPost.postCreator.postCreatorId
          ) {
            this.canUserEdit = true;
          }
          this.fetchStatus = 'done';
        } else if (this.isFirstConversationRequestDone) {
          if (data && data.replyPost && data.replyPost.length) {
            if (forceNew) {
              this.conversation.replyPost = [...data.replyPost];
            } else {
              this.conversation.replyPost = [...this.conversation.replyPost, ...data.replyPost];
            }
            this.conversation.newPostCount = data.newPostCount;
            this.conversation.postCount = data.postCount;
          }
          this.fetchStatus = 'done';
        } else {
          if (!this.conversation) {
            this.fetchStatus = 'none';
          } else {
            this.fetchStatus = 'done';
          }
        }
      },
      err => {
        if (!this.conversation) {
          this.fetchStatus = 'none';
        }
      }
    );
  }

  deleteBlog(successMsg: string) {
    const dialogRef = this.dialog.open(DialogDeletePostComponent, {
      data: { postId: this.conversationRequest.postId }
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.router.navigate(['blog-post', 'me']);
        this.snackBar.open(successMsg);
      }
    });
  }

  publishComment(failureMsg: string) {
    this.postingComment = true;
    const request: IPostCommentRequestPartial = {
      parentId: this.conversationRequest.postId,
      postContent: {
        body: this.commentText
      },
      postCreator: this.authSvc.userId,
      postKind: 'Reply'
    };
    this.socialSvc.postReplyOrComment(request).subscribe(
      _ => {
        this.fetchConversationData(true);
        this.postingComment = false;
        this.resetEditor = true;
        setTimeout(() => {
          this.resetEditor = false;
        }, 0);
        this.commentEnabled = false;
        this.commentText = undefined;
      },
      err => {
        this.snackBar.open(failureMsg);
        this.postingComment = false;
      }
    );
  }

  onDeleteReply(replyIndex: number) {
    this.conversation.replyPost.splice(replyIndex, 1);
  }

  onTextChange(eventData: { isValid: boolean; htmlText: string }) {
    this.commentEnabled = eventData.isValid;
    this.commentText = eventData.htmlText;
  }
}
