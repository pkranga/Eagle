/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ValuesService } from '../../../../services/values.service';
import { ITimelineRequestPartial } from '../../../../models/social.model';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-qanda-home',
  templateUrl: './qanda-home.component.html',
  styleUrls: ['./qanda-home.component.scss']
})
export class QandaHomeComponent implements OnInit {
  isXSmall$ = this.valueSvc.isXSmall$;
  displayType: 'all' | 'unanswered' = 'all';

  allItemsRequest: ITimelineRequestPartial = {
    pgNo: 0,
    pgSize: 10,
    postKind: ['Query'],
    sessionId: Date.now(),
    type: 'all',
    userId: this.authSvc.userId
  };

  unansweredItemsRequest: ITimelineRequestPartial = {
    pgNo: 0,
    pgSize: 10,
    postKind: ['Query'],
    sessionId: Date.now(),
    type: 'unanswered',
    userId: this.authSvc.userId
  };

  constructor(private authSvc: AuthService, private valueSvc: ValuesService) {}

  ngOnInit() {}

  modifyDisplayType() {
    if (this.displayType === 'all') {
      this.displayType = 'unanswered';
    } else {
      this.displayType = 'all';
    }
  }
}
