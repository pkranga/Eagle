/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ITimeline,
  ITimelineRequestPartial
} from '../../../../models/social.model';
import { FetchStatus } from '../../../../models/status.model';

import { AuthService } from '../../../../services/auth.service';
import { RoutingService } from '../../../../services/routing.service';
import { SocialService } from '../../../../services/social.service';
import { ValuesService } from '../../../../services/values.service';

@Component({
  selector: 'app-recent-blogs',
  templateUrl: './recent-blogs.component.html',
  styleUrls: ['./recent-blogs.component.scss']
})
export class RecentBlogsComponent implements OnInit {
  timelineData: ITimeline = {
    hits: 0,
    result: []
  };
  timelineRequest: ITimelineRequestPartial = {
    pgNo: -1,
    pgSize: 20,
    postKind: ['Blog'],
    sessionId: Date.now(),
    type: 'all',
    userId: this.authSvc.userId
  };
  timelineFetchStatus: FetchStatus;

  isXSmall$: Observable<boolean>;

  constructor(
    public routingSvc: RoutingService,
    private socialSvc: SocialService,
    private authSvc: AuthService,
    private valueSvc: ValuesService
  ) {
    this.isXSmall$ = this.valueSvc.isXSmall$;
  }

  ngOnInit() {
    this.fetchTimelineData();
  }

  fetchTimelineData() {
    if (this.timelineFetchStatus === 'done') {
      return;
    }
    this.timelineFetchStatus = 'fetching';
    this.timelineRequest.pgNo += 1;
    this.socialSvc.fetchTimelineData(this.timelineRequest).subscribe(
      data => {
        if (data.hits && data.result) {
          this.timelineData.hits = data.hits;
          this.timelineData.result = [
            ...this.timelineData.result,
            ...data.result
          ];
          if (data.hits > this.timelineData.result.length) {
            this.timelineFetchStatus = 'hasMore';
          } else {
            this.timelineFetchStatus = 'done';
          }
        } else {
          this.timelineFetchStatus = 'none';
        }
      },
      err => {
        this.timelineFetchStatus = 'error';
      }
    );
  }
}
