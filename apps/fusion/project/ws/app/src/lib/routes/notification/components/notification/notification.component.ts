/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit } from '@angular/core'
import { IUserNotification } from '../../models/notifications.model'
import { NsGoal, NsPlaylist, BtnPlaylistService, BtnGoalsService } from '@ws-widget/collection'
import { TFetchStatus, NsPage, ConfigurationsService } from '@ws-widget/utils'
import { BadgesService } from '../../../profile/routes/badges/badges.service'

@Component({
  selector: 'ws-app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit {
  recentBadge: IUserNotification | null = null
  sharedPlaylists: NsPlaylist.IPlaylist[] = []
  sharedGoals: NsGoal.IGoal[] = []
  sharedNotificationGoals: NsGoal.IGoal[] = []
  fetchStatus: TFetchStatus | null = null
  statusCount: number | null = null
  pageNavbar: Partial<NsPage.INavBackground> = this.configSvc.pageNavBar
  constructor(
    private goalsSvc: BtnGoalsService,
    private playlistSvc: BtnPlaylistService,
    private badgeSvc: BadgesService,
    private configSvc: ConfigurationsService,
  ) {}

  ngOnInit() {
    this.initiate()
  }

  initiate() {
    this.fetchStatus = 'fetching'
    this.statusCount = 0
    this.fetchRecentBadge()
    this.fetchSharedPlaylist()
    this.fetchSharedGoals()
  }

  fetchRecentBadge() {
    this.badgeSvc.fetchRecentBadge().subscribe(
      _data => {
        if (_data && _data.recent_badge && _data.recent_badge.image) {
          this.recentBadge = _data.recent_badge
        }
        this.checkContentStatus()
      },
      _err => {
        this.checkContentStatus()
      },
    )
  }
  fetchSharedPlaylist() {
    this.playlistSvc.getPlaylists(NsPlaylist.EPlaylistTypes.PENDING).subscribe(
      data => {
        data.forEach(playlist => {
          playlist.sharedBy = (playlist.sharedBy || '').split('@')[0]
        })
        this.sharedPlaylists = data
        this.checkContentStatus()
      },
      _err => {
        this.checkContentStatus()
      },
    )
  }
  fetchSharedGoals() {
    this.goalsSvc.getActionRequiredGoals('isInIntranet').subscribe(
      data => {
        this.sharedNotificationGoals = data
        this.sharedNotificationGoals.forEach(goal => {
          if (goal.sharedBy) {
            goal.sharedBy.email = goal.sharedBy ? (goal.sharedBy.email || '').split('@')[0] : ''
          }
        })
        this.sharedGoals = this.sharedNotificationGoals
        this.checkContentStatus()
      },
      _err => {
        this.checkContentStatus()
      },
    )
  }
  checkContentStatus() {
    this.fetchStatus = 'done'
    if (this.statusCount != null) {
      this.statusCount += 1
    }
    if (
      this.statusCount === 3 &&
      !this.recentBadge &&
      !this.sharedGoals.length &&
      !this.sharedPlaylists.length
    ) {
      this.fetchStatus = 'none'
    }
  }
  playlistTrackBy(playlist: NsPlaylist.IPlaylist) {
    return playlist.id
  }
  goalTrackBy(goal: NsGoal.IGoal) {
    return goal.id
  }
}
