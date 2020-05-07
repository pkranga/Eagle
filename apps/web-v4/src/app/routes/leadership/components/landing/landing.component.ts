/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTabChangeEvent, MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService } from '../../../../services/config.service';
import { MobileAppsService } from '../../../../services/mobile-apps.service';
import { RoutingService } from '../../../../services/routing.service';
import { UtilityService } from '../../../../services/utility.service';
import { LEADERS } from '../../constants/leaders';
import { ILeaderConfig, ILeaderData } from '../../../../models/leadership.model';
import { MatDialog } from '@angular/material';
import { SendMailDialogComponent } from '../send-mail-dialog/send-mail-dialog.component';
import { AuthService } from '../../../../services/auth.service';
import { UserService } from '../../../../services/user.service';
import { IUserFollow, IUserFollowEntity } from '../../../../models/user.model';

@Component({
  selector: 'ws-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  @ViewChild('followed', { static: true }) followed: ElementRef<any>;
  @ViewChild('unfollowed', { static: true }) unfollowed: ElementRef<any>;
  @ViewChild('followUnfollowError', { static: true }) followUnfollowError: ElementRef<any>;

  isFetchingFollow: boolean = false;
  leaders: ILeaderConfig = LEADERS;
  tabs = [];
  currentIndex = 0;
  leaderName: string;
  leaderData: ILeaderData;
  loggedUserFollowData: IUserFollow;
  public userUuid = this.authSvc.userId;
  leaderUuid: string;
  isFollowDisabled: boolean = true;

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router, public routingSvc: RoutingService,
    private mobileSvc: MobileAppsService, private utilSvc: UtilityService,
    private configSvc: ConfigService,
    private authSvc: AuthService,
    private userSvc: UserService
  ) {
  }

  ngOnInit() {
    this.leaders = LEADERS;

    this.route.paramMap.subscribe(params => {
      if (params.get('name')) {
        this.leaderName = params.get('name');
        this.leaderData = LEADERS[this.leaderName];
        this.tabs = [];
        if (this.leaderData) {
          this.leaderData.tabs.forEach(tab => {
            this.tabs.push(tab.title);
          });
          if (this.tabs && this.tabs.includes(params.get('tab'))) {
            this.currentIndex = this.tabs.indexOf(params.get('tab'));
          }
        }
      }
    });
    if (this.leaderData && this.leaderData.profile) {
      this.userSvc.emailToUserId(this.leaderData.profile.emailId).subscribe(
        uuid => {
          this.leaderUuid = uuid.userId;
          this.isFollowDisabled = false;
        }, err => {
          this.isFollowDisabled = true;
        }
      );
      this.fetchLoggedUserFollowers();
    }
  }

  onTabChange(tabEvent: MatTabChangeEvent) {
    this.router.navigate(['../' + this.tabs[tabEvent.index]], {
      relativeTo: this.route
    });
  }

  openSendMailDialog() {
    this.dialog.open(SendMailDialogComponent, {
      data: {
        placeholder: this.leaderData.mailMeta.placeholder,
        emailTo: this.leaderData.mailMeta.emailTo,
        name: this.leaderData.mailMeta.name,
        subject: this.leaderData.mailMeta.subject
      }
    });
  }

  private fetchLoggedUserFollowers() {
    const userId = this.authSvc.userId;
    this.userSvc.fetchUserFollow(userId).subscribe(data => {
      this.loggedUserFollowData = data;
    }, err => {
      this.snackBar.open(this.followUnfollowError.nativeElement.value);
    });
  }
  isFollowing(id: string) {
    return (
      this.loggedUserFollowData.following.filter(obj => obj.id === id).length >
      0
    );
  }
  follow() {
    this.isFetchingFollow = true;
    this.loggedUserFollowData.following.push({
      id: this.leaderUuid,
      email: this.leaderData.profile.emailId,
      firstname:
        this.leaderData.profile.name ||
        this.leaderData.profile.emailId.substr(0, this.leaderData.profile.emailId.indexOf('.'))
    });
    this.userSvc
      .followUser({ followsourceid: this.userUuid, followtargetid: this.leaderUuid })
      .subscribe(() => {
        this.snackBar.open(this.followed.nativeElement.value + ' ' + this.leaderData.profile.name);
        this.isFetchingFollow = false;
      }, err => {
        this.snackBar.open(this.followUnfollowError.nativeElement.value);
        this.loggedUserFollowData.following.pop();
        this.isFetchingFollow = false;
      });
  }

  unFollow() {
    this.isFetchingFollow = true;
    this.userSvc
      .unFollowUser({ followsourceid: this.userUuid, followtargetid: this.leaderUuid })
      .subscribe(() => {
        this.snackBar.open(this.unfollowed.nativeElement.value + ' ' + this.leaderData.profile.name);
        this.loggedUserFollowData.following = this.loggedUserFollowData.following.filter(
          u => u.id !== this.leaderUuid
        );
        this.isFetchingFollow = false;
      }, err => {
        this.snackBar.open(this.followUnfollowError.nativeElement.value);
        this.isFetchingFollow = false;
      });
  }

  toggleFollow() {
    this.isFollowing(this.leaderUuid) ? this.unFollow() : this.follow();
  }
}
