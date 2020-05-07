/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ITimelineResult, IPostUpdateRequestPartial } from '../../../../models/social.model';
import { MatDialog, MatSnackBar } from '@angular/material';

import { DialogDeletePostComponent } from '../../../../modules/social/components/dialog-delete-post/dialog-delete-post.component';

import { AuthService } from '../../../../services/auth.service';
import { SocialService } from '../../../../services/social.service';

@Component({
  selector: 'app-blog-reply',
  templateUrl: './blog-reply.component.html',
  styleUrls: ['./blog-reply.component.scss']
})
export class BlogReplyComponent implements OnInit {
  @Input() reply: ITimelineResult;
  @Output() deleteSuccess = new EventEmitter<boolean>();

  editMode = false;
  replyPostEnabled = false;
  updatedBody: string;
  userId = this.authSvc.userId;
  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private authSvc: AuthService,
    private socialSvc: SocialService
  ) {}

  ngOnInit() {}

  deleteReply(failMsg: string) {
    const dialogRef = this.dialog.open(DialogDeletePostComponent, {
      data: { postId: this.reply.id }
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

  editReply(failMsg: string) {
    this.reply.postContent.body = this.updatedBody;
    this.editMode = false;
    const postUpdateRequest: IPostUpdateRequestPartial = {
      editor: this.authSvc.userId,
      id: this.reply.id,
      meta: {
        abstract: '',
        body: this.updatedBody,
        title: ''
      },
      postKind: 'Reply'
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
