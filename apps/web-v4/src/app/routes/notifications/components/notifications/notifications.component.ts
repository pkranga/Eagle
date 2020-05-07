/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';

import { IUserNotification } from '../../../../models/notification.model';
import { IUserPlayList } from '../../../../models/playlist.model';
import { IUserGoalSharedWith } from '../../../../models/goal.model';
import { FetchStatus } from '../../../../models/status.model';

// services
import { RoutingService } from '../../../../services/routing.service';
import { UserService } from '../../../../services/user.service';
import { PlaylistService } from '../../../../services/playlist.service';
import { GoalsService } from '../../../../services/goals.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  recentBadge: IUserNotification;
  sharedPlaylists: IUserPlayList[] = [];
  sharedGoals: IUserGoalSharedWith[] = [];
  fetchStatus: FetchStatus;
  statusCount: number;
  constructor(
    public routingSvc: RoutingService,
    private userSvc: UserService,
    private playlistSvc: PlaylistService,
    private goalsSvc: GoalsService
  ) {}

  ngOnInit() {
    this.initiate();
  }

  initiate() {
    this.fetchStatus = 'fetching';
    this.statusCount = 0;
    this.fetchRecentBadge();
    this.fetchSharedPlaylist();
    this.fetchSharedGoals();
  }

  fetchRecentBadge() {
    this.userSvc.fetchUserRecentBadge().subscribe(
      data => {
        if (data && data.recent_badge && data.recent_badge.image) {
          this.recentBadge = data.recent_badge;
        }
        this.checkContentStatus();
      },
      err => {
        this.checkContentStatus();
      }
    );
  }
  fetchSharedPlaylist() {
    this.playlistSvc.fetchSharedPlaylist().subscribe(
      data => {
        data.forEach(playlist => {
          playlist.shared_by = playlist.shared_by.split('@')[0];
        });
        this.sharedPlaylists = data;
        this.checkContentStatus();
      },
      err => {
        this.checkContentStatus();
      }
    );
  }
  fetchSharedGoals() {
    this.goalsSvc.fetchGoalsSharedWithUser().subscribe(
      data => {
        data.forEach(goal => {
          goal.shared_by = goal.shared_by.split('@')[0];
        });
        this.sharedGoals = data;
        this.checkContentStatus();
      },
      err => {
        this.checkContentStatus();
      }
    );
  }
  checkContentStatus() {
    this.fetchStatus = 'done';
    this.statusCount++;
    if (
      this.statusCount === 3 &&
      !this.recentBadge &&
      !this.sharedGoals.length &&
      !this.sharedPlaylists.length
    ) {
      this.fetchStatus = 'none';
    }
  }
  playlistTrackBy(index: number, playlist: IUserPlayList) {
    return playlist.playlist_id;
  }
  goalTrackBy(index: number, goal: IUserGoalSharedWith) {
    return goal.goal_id;
  }
}
