/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { FetchStatus } from '../../../../models/status.model';
import { IBadgeResponse } from '../../../../models/badge.model';
import { ResolveResponse } from '../../../../models/routeResolver.model';

import { RoutingService } from '../../../../services/routing.service';
import { BadgesService } from '../../../../services/badges.service';

@Component({
  selector: 'app-badges',
  templateUrl: './badges.component.html',
  styleUrls: ['./badges.component.scss']
})
export class BadgesComponent implements OnInit {
  status: FetchStatus = 'none';
  badgesResponse: ResolveResponse<IBadgeResponse> = this.route.snapshot.data
    .badges;
  isUpdating = false;
  badges: IBadgeResponse;

  constructor(
    private route: ActivatedRoute,
    public routingSvc: RoutingService,
    private badgeSvc: BadgesService
  ) {
    if (this.badgesResponse.error) {
      this.status = 'error';
    } else {
      this.badges = this.badgesResponse.data;
      this.status = 'done';
    }
  }

  ngOnInit() {}

  reCalculateBadges() {
    this.isUpdating = true;
    this.badgeSvc.reCalculateBadges().subscribe(
      _ => {
        this.badgeSvc.fetchBadges().subscribe(
          data => {
            this.badges = data;
            this.isUpdating = false;
          },
          err => {
            this.isUpdating = false;
          }
        );
      },
      err => {
        this.isUpdating = false;
      }
    );
  }
}
