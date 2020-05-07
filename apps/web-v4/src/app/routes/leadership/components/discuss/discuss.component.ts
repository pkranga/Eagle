/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input } from '@angular/core';
import { IDiscussionForumInput, ITimelineRequestPartial } from '../../../../models/social.model';
import { ILeader } from '../../../../models/leadership.model';
import { ConfigService } from '../../../../services/config.service';
import { AuthService } from '../../../../services/auth.service';
import { SocialService } from '../../../../services/social.service';
import { FetchStatus } from '../../../../models/status.model';
import { UserService } from '../../../../services/user.service';
import { EUserRoles } from '../../../../constants/enums.constant';

@Component({
  selector: 'ws-discuss',
  templateUrl: './discuss.component.html',
  styleUrls: ['./discuss.component.scss']
})
export class DiscussComponent implements OnInit {
  @Input() pageId: string;
  @Input() leaderProfile: ILeader;

  isDiscussionsDoneByLeader = false;
  discussionFetchStatus: FetchStatus;
  discussionForumInput: IDiscussionForumInput;
  constructor(
    private configSvc: ConfigService,
    private authSvc: AuthService,
    private socialSvc: SocialService,
    private userSvc: UserService
  ) {}

  ngOnInit() {
    if (this.userSvc.userRoles.has(this.leaderProfile.role)) {
      this.assignDiscussionForumInput();
    } else {
      this.fetchPageDiscussion();
    }
  }

  assignDiscussionForumInput(restrict = false) {
    this.discussionForumInput = {
      contentId: this.pageId,
      initialPostCount: 4,
      sourceName: this.configSvc.instanceConfig.platform.appName,
      isLoggedInUserRestricted: restrict
    };
  }

  fetchPageDiscussion() {
    this.discussionFetchStatus = 'fetching';
    const discussionRequest: ITimelineRequestPartial = {
      pgNo: 0,
      pgSize: 4,
      postKind: [],
      sessionId: Date.now(),
      type: 'discussionForum',
      userId: this.authSvc.userId,
      source: {
        contentId: this.pageId,
        sourceName: this.configSvc.instanceConfig.platform.appName
      }
    };
    this.socialSvc.fetchTimelineData(discussionRequest).subscribe(
      data => {
        if (data.hits) {
          this.isDiscussionsDoneByLeader = true;
          this.assignDiscussionForumInput(true);
        }
        this.discussionFetchStatus = 'done';
      },
      err => {
        this.discussionFetchStatus = 'error';
      }
    );
  }
}
