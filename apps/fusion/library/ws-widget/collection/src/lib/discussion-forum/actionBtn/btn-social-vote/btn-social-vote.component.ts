/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, Input } from '@angular/core'
import { ConfigurationsService } from '@ws-widget/utils'
import { MatSnackBar, MatDialog } from '@angular/material'
import { DialogSocialActivityUserComponent } from '../../dialog/dialog-social-activity-user/dialog-social-activity-user.component'
import { WsDiscussionForumService } from '../../ws-discussion-forum.services'
import { NsDiscussionForum } from '../../ws-discussion-forum.model'

@Component({
  selector: 'ws-widget-btn-social-vote',
  templateUrl: './btn-social-vote.component.html',
  styleUrls: ['./btn-social-vote.component.scss'],
})
export class BtnSocialVoteComponent implements OnInit {
  @Input() voteType: 'downVote' | 'upVote' | 'none' = 'none'
  @Input() iconType: 'thumbs' | 'triangle' = 'thumbs'
  @Input() postId = ''
  @Input() postCreatorId = ''
  @Input() activity: NsDiscussionForum.IPostActivity | null = null

  userId = ''
  isUpdating = false
  constructor(
    private configSvc: ConfigurationsService,
    private socialSvc: WsDiscussionForumService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {
    if (this.configSvc.userProfile) {
      this.userId = this.configSvc.userProfile.userId || ''
    }
  }

  ngOnInit() { }

  upVote(invalidUserMsg: string) {
    if (this.postCreatorId === this.userId) {
      this.snackBar.open(invalidUserMsg)
      return
    }
    if (this.activity && this.activity.userActivity.upVote) {
      return
    }
    this.isUpdating = true
    const request: NsDiscussionForum.IPostActivityUpdateRequest = {
      activityType: NsDiscussionForum.EActivityType.UPVOTE,
      id: this.postId,
      userId: this.userId,
    }
    this.socialSvc.updateActivity(request).subscribe(
      _ => {
        if (this.activity) {
          if (this.activity.userActivity.downVote) {
            this.activity.userActivity.downVote = false
            this.activity.activityData.downVote -= 1
          } else {
            this.activity.userActivity.upVote = true
            this.activity.activityData.upVote += 1
          }
        }
        this.isUpdating = false
      },
      () => {
        this.isUpdating = false
      },
    )
  }

  downVote(invalidUserMsg: string) {
    if (this.postCreatorId === this.userId) {
      this.snackBar.open(invalidUserMsg)
      return
    }
    if (this.activity && this.activity.userActivity.downVote) {
      return
    }
    this.isUpdating = true
    const request: NsDiscussionForum.IPostActivityUpdateRequest = {
      activityType: NsDiscussionForum.EActivityType.DOWNVOTE,
      id: this.postId,
      userId: this.userId || '',
    }
    this.socialSvc.updateActivity(request).subscribe(
      _ => {
        if (this.activity) {
          if (this.activity.userActivity.upVote) {
            this.activity.userActivity.upVote = false
            this.activity.activityData.upVote -= 1
          } else {
            this.activity.userActivity.downVote = true
            this.activity.activityData.downVote += 1
          }
          this.isUpdating = false
        }
      },
      () => {
        this.isUpdating = false
      },
    )
  }

  openVotesDialog(voteType: NsDiscussionForum.EActivityType.DOWNVOTE | NsDiscussionForum.EActivityType.UPVOTE) {
    const data: NsDiscussionForum.IDialogActivityUsers = {
      postId: this.postId,
      activityType: voteType,
    }
    this.dialog.open(DialogSocialActivityUserComponent, {
      data,
    })
  }
}
