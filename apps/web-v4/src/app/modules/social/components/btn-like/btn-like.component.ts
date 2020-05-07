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
  selector: 'app-btn-like',
  templateUrl: './btn-like.component.html',
  styleUrls: ['./btn-like.component.scss']
})
export class BtnLikeComponent implements OnInit {
  @Input() postId: string;
  @Input() postCreatorId: string;
  @Input() activity: IPostActivity;
  isUpdating = false;
  constructor(
    private authSvc: AuthService,
    private socialSvc: SocialService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private telemetrySvc: TelemetryService
  ) { }

  ngOnInit() { }

  updateLike(invalidUserMsg: string) {
    if (this.postCreatorId === this.authSvc.userId) {
      this.snackBar.open(invalidUserMsg);
      return;
    }
    if (this.isUpdating) {
      return;
    }
    this.isUpdating = true;
    const request: IPostActivityUpdatePartialRequest = {
      id: this.postId,
      userId: this.authSvc.userId,
      activityType: 'like'
    };
    this.socialSvc.updateActivity(request).subscribe(_ => {
      this.isUpdating = false;
      if (this.activity.userActivity.like) {
        this.activity.userActivity.like = false;
        this.activity.activityData.like -= 1;
        this.telemetrySvc.likeUnlikeBlogTelemetryEvent(false, this.postId);
      } else {
        this.activity.userActivity.like = true;
        this.activity.activityData.like += 1;
        this.telemetrySvc.likeUnlikeBlogTelemetryEvent(true, this.postId);
      }
    });
  }

  openLikesDialog() {
    const data: IDialogActivityUsers = { postId: this.postId, activityType: 'like' };
    const dialogRef = this.dialog.open(DialogActivityUsersComponent, {
      data
    });
  }
}
