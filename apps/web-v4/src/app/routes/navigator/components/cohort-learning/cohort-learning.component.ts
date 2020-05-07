/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavigatorService } from '../../../../services/navigator.service';
import { RoutingService } from '../../../../services/routing.service';
import { ContentService } from '../../../../services/content.service';

@Component({
  selector: 'app-cohort-learning',
  templateUrl: './cohort-learning.component.html',
  styleUrls: ['./cohort-learning.component.scss']
})
export class CohortLearningComponent implements OnInit {
  contentStripHash = {};
  contentStrips = [
    {
      title: 'JL 7 Cohort',
      items: ['lex_auth_012610203881570304669', 'lex_auth_012603751492943872515']
    },
    {
      title: 'JL 6 Cohort',
      items: ['lex_auth_012610207135571968670', 'lex_auth_012528735721676800270']
    },
    {
      title: 'JL 5 Cohort',
      items: []
    }
  ];

  constructor(
    public routingSvc: RoutingService,
    private router: Router,
    private navSvc: NavigatorService,
    private contentSvc: ContentService) { }

  ngOnInit() {
    this.contentStrips.forEach(strip => {
      this.contentSvc
        .fetchMultipleContent(strip.items)
        .subscribe(data => (this.contentStripHash[strip.title] = data.filter(item => Boolean(item))));
    });
  }

  knowMoreClicked(lpItem) {
    if (lpItem.url) {
      this.router.navigateByUrl(lpItem.url);
    }
  }
}
