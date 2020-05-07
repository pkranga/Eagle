/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ITimelineRequestPartial } from '../../../../models/social.model';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-my-blogs',
  templateUrl: './my-blogs.component.html',
  styleUrls: ['./my-blogs.component.scss']
})
export class MyBlogsComponent implements OnInit {
  validTabIds = ['drafts', 'published'];
  activeTabIndex = 0;
  myTimelineRequest: ITimelineRequestPartial = {
    pgNo: -1,
    pgSize: 20,
    postKind: ['Blog'],
    sessionId: Date.now(),
    type: 'myTimeline',
    userId: this.authSvc.userId
  };

  myDraftsRequest: ITimelineRequestPartial = {
    pgNo: -1,
    pgSize: 20,
    postKind: ['Blog'],
    sessionId: Date.now(),
    type: 'myDrafts',
    userId: this.authSvc.userId
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authSvc: AuthService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      if (this.validTabIds.includes(params.get('tab'))) {
        this.activeTabIndex = this.validTabIds.indexOf(params.get('tab'));
      }
    });
  }

  updateActiveTab(tabId: number) {
    const tab = this.validTabIds[tabId] || 'drafts';
    this.router.navigate(['blog-post', 'me', tab]);
  }
}
