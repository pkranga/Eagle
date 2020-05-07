/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input } from '@angular/core';
import {
  ITimelineRequestPartial,
  ITimeline
} from '../../../../models/social.model';
import { SocialService } from '../../../../services/social.service';
import { FetchStatus } from '../../../../models/status.model';

@Component({
  selector: 'app-qanda-results',
  templateUrl: './qanda-results.component.html',
  styleUrls: ['./qanda-results.component.scss']
})
export class QandaResultsComponent implements OnInit {
  @Input() timelineRequest: ITimelineRequestPartial;
  timelineRequestCopy: ITimelineRequestPartial;
  fetchStatus: FetchStatus;
  timelineResult: ITimeline = {
    hits: 0,
    result: []
  };
  constructor(private socialSvc: SocialService) {}

  ngOnInit() {
    if (this.timelineRequest) {
      this.timelineRequestCopy = { ...this.timelineRequest };
      this.fetchTimeLine();
    }
  }

  fetchTimeLine() {
    if (this.fetchStatus === 'fetching') {
      return;
    }
    this.fetchStatus = 'fetching';
    this.socialSvc.fetchTimelineData(this.timelineRequestCopy).subscribe(
      data => {
        if (data.hits && data.result) {
          this.timelineResult.hits = data.hits;
          this.timelineResult.result = [
            ...this.timelineResult.result,
            ...data.result
          ];
          this.timelineRequestCopy.pgNo += 1;
          if (data.hits > this.timelineResult.result.length) {
            this.fetchStatus = 'hasMore';
          } else {
            this.fetchStatus = 'done';
          }
        } else {
          this.fetchStatus = 'none';
        }
      },
      err => {
        this.fetchStatus = 'error';
      }
    );
  }
}
