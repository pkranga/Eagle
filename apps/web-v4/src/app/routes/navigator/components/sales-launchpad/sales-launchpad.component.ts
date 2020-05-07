/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavigatorService } from '../../../../services/navigator.service';
import { RoutingService } from '../../../../services/routing.service';
import { ContentService } from '../../../../services/content.service';

@Component({
  selector: 'app-sales-launchpad',
  templateUrl: './sales-launchpad.component.html',
  styleUrls: ['./sales-launchpad.component.scss']
})
export class SalesLaunchpadComponent implements OnInit {
  fetchingData: boolean;
  contentStripHash = {};
  dummyContent = {
    programs: [
      {
        identifier: 'lex_auth_012612333141950464848'
      }
    ]
  };
  constructor(
    public routingSvc: RoutingService,
    private router: Router,
    private navSvc: NavigatorService,
    private contentSvc: ContentService
  ) { }

  ngOnInit() {
    Object.keys(this.dummyContent).forEach(key => {
      this.contentSvc
        .fetchMultipleContent(this.dummyContent[key].map(item => item.identifier))
        .subscribe(data => (this.contentStripHash[key] = data.filter(meta => Boolean(meta))));
    });
  }

  knowMoreClicked(lpItem) {
    this.router.navigateByUrl(lpItem.url);
  }
}
