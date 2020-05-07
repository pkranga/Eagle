/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input } from '@angular/core';
import {
  IPostActivity,
  IPostActivityUpdatePartialRequest,
  IDialogActivityUsers
} from '../../../../models/social.model';
import { SocialService } from '../../../../services/social.service';
import { AuthService } from '../../../../services/auth.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { TelemetryService } from '../../../../services/telemetry.service';
import { DialogActivityUsersComponent } from '../dialog-activity-users/dialog-activity-users.component';

@Component({
  selector: 'app-btn-vote',
  templateUrl: './btn-vote.component.html',
  styleUrls: ['./btn-vote.component.scss']
})
export class BtnVoteComponent implements OnInit {
  @Input() voteType: 'downVote' | 'upVote';
  @Input() iconType: 'thumbs' | 'triangle' = 'thumbs';
  @Input() postId: string;
  @Input() postCreatorId: string;
  @Input() activity: IPostActivity;

  isUpdating = false;
  constructor(
    private authSvc: AuthService,
    private socialSvc: SocialService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private telemetrySvc: TelemetryService
  ) {}

  ngOnInit() {}

  upVote(invalidUserMsg: string) {
    if (this.postCreatorId === this.authSvc.userId) {
      this.snackBar.open(invalidUserMsg);
      return;
    }
    if (this.activity.userActivity.upVote) {
      return;
    }
    this.isUpdating = true;
    const request: IPostActivityUpdatePartialRequest = {
      activityType: 'upvote',
      id: this.postId,
      userId: this.authSvc.userId
    };
    this.socialSvc.updateActivity(request).subscribe(
      _ => {
        if (this.activity.userActivity.downVote) {
          this.activity.userActivity.downVote = false;
          this.activity.activityData.downVote -= 1;
        } else {
          this.activity.userActivity.upVote = true;
          this.activity.activityData.upVote += 1;
          this.telemetrySvc.upvoteDownvoteBlogTelemetryEvent(
            'UPVOTE',
            this.postId
          );
        }
        this.isUpdating = false;
      },
      _err => {
        this.isUpdating = false;
      }
    );
  }

  downVote(invalidUserMsg: string) {
    if (this.postCreatorId === this.authSvc.userId) {
      this.snackBar.open(invalidUserMsg);
      return;
    }
    if (this.activity.userActivity.downVote) {
      return;
    }
    this.isUpdating = true;
    const request: IPostActivityUpdatePartialRequest = {
      activityType: 'downvote',
      id: this.postId,
      userId: this.authSvc.userId
    };
    this.socialSvc.updateActivity(request).subscribe(
      _ => {
        if (this.activity.userActivity.upVote) {
          this.activity.userActivity.upVote = false;
          this.activity.activityData.upVote -= 1;
        } else {
          this.activity.userActivity.downVote = true;
          this.activity.activityData.downVote += 1;
          this.telemetrySvc.upvoteDownvoteBlogTelemetryEvent(
            'DOWNVOTE',
            this.postId
          );
        }
        this.isUpdating = false;
      },
      _err => {
        this.isUpdating = false;
      }
    );
  }

  openVotesDialog(voteType: 'upvote' | 'downvote') {
    const data: IDialogActivityUsers = {
      postId: this.postId,
      activityType: voteType
    };
    this.dialog.open(DialogActivityUsersComponent, {
      data
    });
  }
}
