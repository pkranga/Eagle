/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { LikeService } from '../../../../services/like.service';
import { Observable, Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { TelemetryService } from '../../../../services/telemetry.service';
import { UtilityService } from '../../../../services/utility.service';
import { ConfigService } from '../../../../services/config.service';

@Component({
  selector: 'app-btn-like',
  templateUrl: './btn-like.component.html',
  styleUrls: ['./btn-like.component.scss']
})
export class BtnLikeComponent implements OnInit, OnDestroy {
  @Input()
  contentId: string;
  status: 'LIKED' | 'NOT_LIKED' | 'PENDING' = 'PENDING';
  private likeSubscription: Subscription;
  constructor(
    private likeSvc: LikeService,
    private telemetrySvc: TelemetryService,
    private utilSvc: UtilityService,
    private configSvc: ConfigService
  ) {}

  ngOnInit() {
    this.likeSubscription = this.likeSvc
      .isLiked(this.contentId)
      .subscribe(isLiked => {
        if (isLiked) {
          this.status = 'LIKED';
        } else if (!this.likeSvc.fetchingLikes) {
          this.status = 'NOT_LIKED';
        } else {
          this.status = 'PENDING';
        }
      });
  }
  ngOnDestroy() {
    if (this.likeSubscription) {
      this.likeSubscription.unsubscribe();
    }
  }
  like(event: Event) {
    if (event && event.stopPropagation) {
      event.stopPropagation();
    }
    if (!this.configSvc.instanceConfig.features.btnLike.available) {
      this.utilSvc.featureUnavailable();
      return;
    }
    this.status = 'PENDING';
    this.likeSvc.like(this.contentId).subscribe(
      liked => {
        this.status = 'LIKED';
        this.telemetrySvc.likeUnlikeTelemetryEvent(true, this.contentId);
      },
      () => {}
    );
  }
  unlike(event: Event) {
    if (event && event.stopPropagation) {
      event.stopPropagation();
    }
    if (!this.configSvc.instanceConfig.features.btnLike.available) {
      this.utilSvc.featureUnavailable();
      return;
    }
    this.status = 'PENDING';
    this.likeSvc.unlike(this.contentId).subscribe(
      liked => {
        this.status = 'NOT_LIKED';
        this.telemetrySvc.likeUnlikeTelemetryEvent(false, this.contentId);
      },
      () => {}
    );
  }
}
