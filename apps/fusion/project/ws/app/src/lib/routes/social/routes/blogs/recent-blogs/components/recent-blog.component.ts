/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit } from '@angular/core'
import { Observable } from 'rxjs'
import { TFetchStatus, ValueService, ConfigurationsService, NsPage } from '@ws-widget/utils'
import { NsDiscussionForum, WsDiscussionForumService } from '@ws-widget/collection'

@Component({
  selector: 'ws-app-recent-blog',
  templateUrl: './recent-blog.component.html',
  styleUrls: ['./recent-blog.component.scss'],
})
export class RecentBlogComponent implements OnInit {
  timelineData: NsDiscussionForum.ITimeline = {
    hits: 0,
    result: [],
  }
  pageNavbar: Partial<NsPage.INavBackground> = this.configSvc.pageNavBar
  timelineRequest: NsDiscussionForum.ITimelineRequest = {
    pgNo: -1,
    pgSize: 20,
    postKind: [NsDiscussionForum.EPostKind.BLOG],
    sessionId: Date.now(),
    type: NsDiscussionForum.ETimelineType.ALL,
    userId: '',
  }
  timelineFetchStatus: TFetchStatus = 'none'

  isXSmall$: Observable<boolean>

  constructor(
    private discussionSvc: WsDiscussionForumService,
    private configSvc: ConfigurationsService,
    private valueSvc: ValueService,
  ) {
    this.isXSmall$ = this.valueSvc.isXSmall$
    if (this.configSvc.userProfile) {
      this.timelineRequest.userId = this.configSvc.userProfile.userId || ''
    }
  }

  ngOnInit() {
    this.fetchTimelineData()
  }

  fetchTimelineData() {
    if (this.timelineFetchStatus === 'done') {
      return
    }
    this.timelineFetchStatus = 'fetching';

    (this.timelineRequest.pgNo as number) += 1

    this.discussionSvc.fetchTimelineData(this.timelineRequest).subscribe(
      data => {
        if (data.hits && data.result) {
          this.timelineData.hits = data.hits
          this.timelineData.result = [...this.timelineData.result, ...data.result]
          if (data.hits > this.timelineData.result.length) {
            this.timelineFetchStatus = 'hasMore'
          } else {
            this.timelineFetchStatus = 'done'
          }
        } else {
          this.timelineFetchStatus = 'none'
        }
      },
      () => {
        this.timelineFetchStatus = 'error'
      },
    )
  }
}
