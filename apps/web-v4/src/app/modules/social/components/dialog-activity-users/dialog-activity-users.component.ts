/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatTabChangeEvent
} from '@angular/material';
import { AuthService } from '../../../../services/auth.service';
import { SocialService } from '../../../../services/social.service';
import {
  TActivityType,
  IActivityUsersPartial,
  IActivityUsersResult,
  IDialogActivityUsers
} from '../../../../models/social.model';
import { FetchStatus } from '../../../../models/status.model';
import { UserService } from '../../../../services/user.service';
import { IUserFollow, IUserFollowEntity } from '../../../../models/user.model';
import { HttpErrorResponse } from '@angular/common/http';

const TAB_INDEX_ACTIVITY_TYPE_MAPPING = {
  0: 'like',
  1: 'upvote',
  2: 'downvote'
};

@Component({
  selector: 'app-dialog-activity-users',
  templateUrl: './dialog-activity-users.component.html',
  styleUrls: ['./dialog-activity-users.component.scss']
})
export class DialogActivityUsersComponent implements OnInit {
  commonRequestForActivityUsers = {
    postId: this.data.postId,
    pgNo: 0,
    pgSize: 20
  };

  activityUsersFetchRequest: {
    like: IActivityUsersPartial;
    upvote: IActivityUsersPartial;
    downvote: IActivityUsersPartial;
  } = {
    like: { ...this.commonRequestForActivityUsers, activityType: 'like' },
    upvote: { ...this.commonRequestForActivityUsers, activityType: 'upvote' },
    downvote: {
      ...this.commonRequestForActivityUsers,
      activityType: 'downvote'
    }
  };

  activityUsersResult: {
    like: { data: IActivityUsersResult; fetchStatus: FetchStatus };
    upvote: { data: IActivityUsersResult; fetchStatus: FetchStatus };
    downvote: { data: IActivityUsersResult; fetchStatus: FetchStatus };
  } = {
    like: { data: undefined, fetchStatus: 'none' },
    upvote: { data: undefined, fetchStatus: 'none' },
    downvote: { data: undefined, fetchStatus: 'none' }
  };

  selectedTabIndex = 0;
  userId = this.authSvc.userId;
  userFollowData: IUserFollow;
  userFollowFetchStatus: FetchStatus;

  constructor(
    public dialogRef: MatDialogRef<DialogActivityUsersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDialogActivityUsers,
    private socialSvc: SocialService,
    private userSvc: UserService,
    private authSvc: AuthService
  ) {}

  ngOnInit() {
    try {
      for (const index in TAB_INDEX_ACTIVITY_TYPE_MAPPING) {
        if (TAB_INDEX_ACTIVITY_TYPE_MAPPING[index] === this.data.activityType) {
          this.selectedTabIndex = Number(index);
          break;
        }
      }
    } catch (e) {
      this.selectedTabIndex = 0;
    }
    this.fetchUserFollowers();
    this.fetchActivityUsers(this.data.activityType);
  }

  fetchActivityUsers(activityType: TActivityType) {
    if (
      this.activityUsersResult[activityType].fetchStatus === 'fetching' ||
      this.activityUsersResult[activityType].fetchStatus === 'done'
    ) {
      return;
    }
    this.activityUsersResult[activityType].fetchStatus = 'fetching';
    this.socialSvc
      .fetchActivityUsers(this.activityUsersFetchRequest[activityType])
      .subscribe(
        data => {
          if (data && data.total) {
            if (!this.activityUsersResult[activityType].data) {
              this.activityUsersResult[activityType].data = data || {
                total: 0,
                users: []
              };
            } else {
              this.activityUsersResult[activityType].data.users = [
                ...this.activityUsersResult[activityType].data.users,
                ...data.users
              ];
            }
            if (
              data.total >
              this.activityUsersResult[activityType].data.users.length
            ) {
              this.activityUsersResult[activityType].fetchStatus = 'hasMore';
            } else {
              this.activityUsersResult[activityType].fetchStatus = 'done';
            }
          } else {
            this.activityUsersResult[activityType].fetchStatus = 'none';
          }
          this.activityUsersFetchRequest[activityType].pgNo += 1;
        },
        (err: HttpErrorResponse) => {
          if (err.status === 404) {
            this.activityUsersResult[activityType].fetchStatus = 'none';
          } else {
            this.activityUsersResult[activityType].fetchStatus = 'error';
          }
        }
      );
  }

  private fetchUserFollowers() {
    this.userFollowFetchStatus = 'fetching';
    this.userSvc.fetchUserFollow(this.authSvc.userId).subscribe(
      data => {
        this.userFollowData = data || { followers: [], following: [] };
        this.userFollowFetchStatus = 'done';
      },
      err => {
        this.userFollowData = { followers: [], following: [] };
        this.userFollowFetchStatus = 'error';
      }
    );
  }

  ifFollowing(id: string): boolean {
    if (this.userFollowData.following.map(user => user.id).includes(id)) {
      return true;
    }
    return false;
  }

  follow(user: IUserFollowEntity) {
    this.userFollowData.following.push(user);
    this.userSvc
      .followUser({ followsourceid: this.authSvc.userId, followtargetid: user.id })
      .subscribe();
  }

  unFollow(user: IUserFollowEntity) {
    this.userFollowData.following = this.userFollowData.following.filter(userData => userData.id !== user.id);
    this.userSvc
      .unFollowUser({ followsourceid: this.authSvc.userId, followtargetid: user.id })
      .subscribe();
  }

  toggleFollow(user: IUserFollowEntity) {
    this.ifFollowing(user.id) ? this.unFollow(user) : this.follow(user);
  }

  tabChange(event: MatTabChangeEvent) {
    if (
      !this.activityUsersResult[TAB_INDEX_ACTIVITY_TYPE_MAPPING[event.index]]
        .data
    ) {
      this.fetchActivityUsers(TAB_INDEX_ACTIVITY_TYPE_MAPPING[event.index]);
    }
  }
}
