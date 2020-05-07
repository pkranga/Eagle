/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { ITimelineRequestPartial } from '../../../../models/social.model';
import { AuthService } from '../../../../services/auth.service';
import { ValuesService } from '../../../../services/values.service';
import { RoutingService } from '../../../../services/routing.service';

@Component({
  selector: 'app-qanda-me',
  templateUrl: './qanda-me.component.html',
  styleUrls: ['./qanda-me.component.scss']
})
export class QandaMeComponent implements OnInit {
  isXSmall$ = this.valueSvc.isXSmall$;
  selectedIndex = 0;
  myAllItemsRequest: ITimelineRequestPartial = {
    pgNo: 0,
    pgSize: 10,
    postKind: ['Query'],
    sessionId: Date.now(),
    type: 'myTimeline',
    userId: this.authSvc.userId
  };
  myDraftItemsRequest: ITimelineRequestPartial = {
    pgNo: 0,
    pgSize: 10,
    postKind: ['Query'],
    sessionId: Date.now(),
    type: 'myDrafts',
    userId: this.authSvc.userId
  };
  constructor(
    private authSvc: AuthService,
    private valueSvc: ValuesService,
    public routingSvc: RoutingService
  ) {}

  ngOnInit() {}

  changeTabs(tabIndex: number) {
    this.selectedIndex = tabIndex;
  }
}
