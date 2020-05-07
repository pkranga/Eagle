/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { MatDialog, MatSnackBar } from '@angular/material'
import { ConfigurationsService } from '@ws-widget/utils'
import { DialogSocialDeletePostComponent, NsDiscussionForum, WsDiscussionForumService } from '@ws-widget/collection'

@Component({
  selector: 'ws-app-blog-reply',
  templateUrl: './blog-reply.component.html',
  styleUrls: ['./blog-reply.component.scss'],
})
export class BlogReplyComponent implements OnInit {
  @Input() reply: NsDiscussionForum.ITimelineResult | null = null
  @Output() deleteSuccess = new EventEmitter<boolean>()

  editMode = false
  replyPostEnabled = false
  updatedBody: string | undefined = ''
  userId = ''
  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private configSvc: ConfigurationsService,
    private discussionSvc: WsDiscussionForumService,
  ) {
    if (this.configSvc.userProfile) {
      this.userId = this.configSvc.userProfile.userId || ''
    }
  }

  ngOnInit() { }

  deleteReply(failMsg: string) {
    if (this.reply) {
      const dialogRef = this.dialog.open(DialogSocialDeletePostComponent, {
        data: { postId: this.reply.id },
      })
      dialogRef.afterClosed().subscribe(
        data => {
          if (data) {
            this.deleteSuccess.emit(true)
          }
        },
        () => {
          this.snackBar.open(failMsg)
        },
      )
    }
  }

  editReply(failMsg: string) {
    let postUpdateRequest: NsDiscussionForum.IPostUpdateRequest
    if (this.reply) {
      this.reply.postContent.body = this.updatedBody || ''
      this.editMode = false
      postUpdateRequest = {
        editor: this.userId,
        id: this.reply.id,
        meta: {
          abstract: '',
          body: this.updatedBody || '',
          title: '',
        },
        postKind: NsDiscussionForum.EPostKind.REPLY,
      }
      this.discussionSvc.updatePost(postUpdateRequest).subscribe(
        () => {
          this.updatedBody = undefined
        },
        () => {
          this.editMode = true
          this.snackBar.open(failMsg)
        },
      )
    }
  }

  onTextChange(eventData: { isValid: boolean; htmlText: string }) {
    this.replyPostEnabled = eventData.isValid
    this.updatedBody = eventData.htmlText
  }
}
