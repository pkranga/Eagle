/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RoutingService } from '../../../../services/routing.service';
import { UserService } from '../../../../services/user.service';
import {
  IUserProfileGraph,
  IUserFollow,
  IUserFollowEntity
} from '../../../../models/user.model';
import { AuthService } from '../../../../services/auth.service';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { DashboardService } from '../../../../services/dashboard.service';
import {
  IContent,
  IContinueStrip,
  IHistory
} from '../../../../models/content.model';
import { FetchStatus } from '../../../../models/status.model';
import { ContentService } from '../../../../services/content.service';
import { LikeService } from '../../../../services/like.service';
import { Subscription } from 'rxjs';
import { ValuesService } from '../../../../services/values.service';
import { ActivatedRoute } from '@angular/router';
import { UserApiService } from '../../../../apis/user-api.service';
import { HistoryService } from '../../../../services/history.service';
import { BadgesService } from '../../../../services/badges.service';
import { IBadgeResponse } from '../../../../models/badge.model';
import { IUserProgressGoal } from '../../../../models/goal.model';
import { IUserPlayList } from '../../../../models/playlist.model';
import { GoalsService } from '../../../../services/goals.service';
import { PlaylistService } from '../../../../services/playlist.service';
import { GoalDetailsDialogComponent } from '../goal-details-dialog/goal-details-dialog.component';
import { PlaylistDetailsDialogComponent } from '../playlist-details-dialog/playlist-details-dialog.component';
import { MatDialog } from '@angular/material';
import { IPrivacyPreferences } from '../../../../models/privacy.model';
import { ConfigService } from '../../../../services/config.service';
interface IDuration {
  h: number;
  m: number;
  s: number;
}

@Component({
  selector: 'app-public-profile',
  templateUrl: './public-profile.component.html',
  styleUrls: ['./public-profile.component.scss']
})
export class PublicProfileComponent implements OnInit, OnDestroy {
  profile: IUserProfileGraph = {
    companyName: '',
    department: '',
    givenName: '',
    imageUrl: '',
    jobTitle: '',
    mobilePhone: '',
    onPremisesUserPrincipalName: '',
    surname: '',
    usageLocation: ''
  };
  profileImage: SafeUrl = null;
  currentUserProfile: IUserFollowEntity = null;
  userAverage: IDuration;
  userTotalTimeSpent: IDuration;
  isError = false;
  userLikes: IContent[];
  userContinueLearning: IHistory[] = null;
  badges: IBadgeResponse;
  goals: IUserProgressGoal[];
  playlists: IUserPlayList[];
  userLikesFetchStatus: FetchStatus;
  selectedTabIndex = 0;
  userFollowData: IUserFollow;
  loggedUserFollowData: IUserFollow;
  privacy: IPrivacyPreferences;
  isSmall = false;
  uuid: string;
  publicUuid;
  userEmail = this.authSvc.userEmail;
  userUuid = this.authSvc.userId;
  userName = this.authSvc.userName;
  currentEmailId: string;
  followFeatureAvailable = this.configSvc.instanceConfig.features.follow
    .available;
  followFeatureEnabled = this.configSvc.instanceConfig.features.follow.enabled;
  private screenSizeSubscription: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private domSanitizer: DomSanitizer,
    public routingSvc: RoutingService,
    private authSvc: AuthService,
    private dashboardSvc: DashboardService,
    private userSvc: UserService,
    private likeSvc: LikeService,
    private contentSvc: ContentService,
    private valuesSvc: ValuesService,
    private userApiSvc: UserApiService,
    private historySvc: HistoryService,
    private badgesSvc: BadgesService,
    private playlistSvc: PlaylistService,
    private goalsSvc: GoalsService,
    private dialog: MatDialog,
    private configSvc: ConfigService
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.currentEmailId = null;
      this.uuid = null;
      const id = params.id;
      this.currentEmailId = id;
      if (id && id.indexOf('@') > -1) {
        this.userSvc.emailToUserId(id).subscribe(
          uuid => {
            this.uuid = uuid.userId;
            this.updateDetails();
          },
          () => {
            this.isError = true;
          }
        );
      } else {
        this.uuid = id || this.userUuid;
        this.updateDetails();
      }
    });
    this.monitorScreenSize();
    this.fetchLoggedUserFollowers();
    this.fetchBadges();
    this.fetchGoals();
    this.fetchPlaylist();
    this.fetchPrivacySetting();
  }

  private fetchBadges() {
    this.badgesSvc.fetchBadges(this.currentEmailId).subscribe(badges => {
      this.badges = badges;
    });
  }

  private fetchGoals() {
    this.goalsSvc
      .fetchUserProgressGoals(this.currentEmailId)
      .subscribe(goals => {
        this.goals = goals.goals_in_progress.concat(goals.completed_goals);
      });
  }

  private fetchPlaylist() {
    this.playlistSvc
      .fetchUserPlaylist(this.currentEmailId)
      .subscribe(playlist => {
        this.playlists = playlist;
      });
  }

  private fetchPrivacySetting() {
    this.valuesSvc
      .privacy(this.currentEmailId)
      .subscribe((privacy: IPrivacyPreferences) => {
        this.privacy = privacy;
      });
  }

  openGoalDetailsDialog(goal: IUserProgressGoal) {
    this.dialog.open(GoalDetailsDialogComponent, {
      width: '700px',
      data: goal
    });
  }

  openPlaylistDetailsDialog(playlist: IUserPlayList) {
    this.dialog.open(PlaylistDetailsDialogComponent, {
      width: '700px',
      data: playlist
    });
  }

  updateDetails() {
    this.updateProfileDetails();
    this.loadUserLikes();
    this.fetchUserFollowers();
    this.loadUserContinueLearning(this.currentEmailId);
  }

  ngOnDestroy() {
    if (this.screenSizeSubscription) {
      this.screenSizeSubscription.unsubscribe();
    }
  }

  private updateProfileDetails() {
    this.userApiSvc.fetchGraphProfileFromUuid(this.uuid).subscribe(
      data => {
        if (data) {
          this.profile = data;
          if (this.profile.imageUrl) {
            this.profileImage = this.domSanitizer.bypassSecurityTrustUrl(
              this.profile.imageUrl
            );
          }
          this.currentUserProfile = {
            id: this.uuid,
            email: this.profile.onPremisesUserPrincipalName,
            firstname: this.profile.givenName
          };
          this.loadActivityDataWithEmail(
            this.profile.onPremisesUserPrincipalName
          );
        }
      },
      () => {
        this.loadActivityDataWithEmail(this.userEmail);
        this.profile.givenName = this.userName;
        this.profile.onPremisesUserPrincipalName = this.userEmail;
      }
    );
  }

  private monitorScreenSize() {
    this.screenSizeSubscription = this.valuesSvc.isXSmall$.subscribe(
      isXSmall => {
        if (isXSmall) {
          this.isSmall = true;
        } else {
          this.isSmall = false;
        }
      }
    );
  }

  private loadUserContinueLearning(email: string) {
    this.userContinueLearning = null;
    this.historySvc
      .fetchContinueLearning(20, null, email)
      .subscribe((data: IContinueStrip) => {
        if (!data) {
          return;
        }
        this.userContinueLearning = data.results;
      });
  }

  private loadUserLikes() {
    this.userLikesFetchStatus = 'fetching';
    this.userLikes = null;
    this.likeSvc.likedWithUuid(this.uuid).subscribe(
      likedIds => {
        if (likedIds) {
          this.userLikes = null;
          this.contentSvc.fetchMultipleContent(Array.from(likedIds)).subscribe(
            contents => {
              this.userLikes = contents.filter(content => content !== null);
              this.userLikesFetchStatus = 'done';
              if (!this.userLikes.length) {
                this.userLikesFetchStatus = 'none';
              }
            },
            err => {
              this.userLikesFetchStatus = 'error';
            }
          );
        } else {
          this.userLikesFetchStatus = 'none';
        }
      },
      likesErr => {
        this.userLikesFetchStatus = 'error';
      }
    );
  }

  private fetchUserFollowers() {
    const userId = this.uuid;
    this.userSvc.fetchUserFollow(userId).subscribe(data => {
      this.userFollowData = data;
    });
  }

  private loadActivityDataWithEmail(email: string) {
    const singleDay = 24 * 60 * 60 * 1000;
    const now = Date.now();
    const start = new Date(now - 30 * singleDay);
    const end = new Date(now - singleDay);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    this.dashboardSvc
      .getDashBoard(
        `${start.getFullYear()}-${start.getMonth() + 1}-${start.getDate()}`,
        `${end.getFullYear()}-${end.getMonth() + 1}-${end.getDate()}`,
        email
      )
      .subscribe(data => {
        if (data.userAvg < 0) {
          this.userAverage = undefined;
          this.userTotalTimeSpent = undefined;
          return '';
        }
        this.userAverage = this.convertDuration(data.userAvg);
        this.userTotalTimeSpent = this.convertDuration(data.userAvg * 30);
      });
  }

  private convertDuration(data: number): IDuration {
    if (data < 1) {
      return { h: 0, m: 0, s: 0 };
    }
    const h = Math.floor(data / 3600);
    const m = Math.floor((data % 3600) / 60);
    const s = Math.floor((data % 3600) % 60);
    return { h, m, s };
  }
  private fetchLoggedUserFollowers() {
    const userId = this.authSvc.userId;
    this.userSvc.fetchUserFollow(userId).subscribe(data => {
      this.loggedUserFollowData = data;
    });
  }
  isFollowing(id: string) {
    return (
      this.loggedUserFollowData.following.filter(obj => obj.id === id).length >
      0
    );
  }
  userTrackBy(index: number, user: IUserFollowEntity) {
    return user.id;
  }

  follow(user: IUserFollowEntity) {
    this.userSvc
      .followUser({ followsourceid: this.userUuid, followtargetid: user.id })
      .subscribe(() => {
        this.loggedUserFollowData.following.push(user);

        if (user.id === this.uuid) {
          // Followed user's profile is active
          this.userFollowData.followers.push({
            id: this.userUuid,
            email: this.userEmail,
            firstname:
              this.userName ||
              this.userEmail.substr(0, this.userEmail.indexOf('.'))
          });
        }
      });
  }

  unFollow(user: IUserFollowEntity) {
    this.userSvc
      .unFollowUser({ followsourceid: this.userUuid, followtargetid: user.id })
      .subscribe(() => {
        this.loggedUserFollowData.following = this.loggedUserFollowData.following.filter(
          u => u.id !== user.id
        );
        if (user.id === this.uuid) {
          this.userFollowData.followers = this.userFollowData.followers.filter(
            u => u.id !== this.userUuid
          );
        }
      });
  }

  toggleFollow(user: IUserFollowEntity) {
    this.isFollowing(user.id) ? this.unFollow(user) : this.follow(user);
  }

  confirmLogout() {
    this.authSvc.logout();
  }
}
