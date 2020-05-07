/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RoutingService } from '../../../../services/routing.service';
import { AccessControlService } from '../../../../services/access-control.service';
import { ActivatedRoute } from '@angular/router';
import { MiscService } from '../../../../services/misc.service';
import { IEvent } from '../../../../models/events.model';
import { FetchStatus } from '../../../../models/status.model';
import { MobileAppsService } from '../../../../services/mobile-apps.service';
import { TLiveEvent } from '../../../../models/mobile-apps-events.model';
import { TelemetryService } from '../../../../services/telemetry.service';
import { Subscription, interval } from 'rxjs';
import {
  COMM_STATES,
  ILiveEventTelemetry
} from '../../../../models/comm-events.model';
import { EUserRoles } from '../../../../constants/enums.constant';
import { MatSnackBar } from '@angular/material';
import { ConfigService } from '../../../../services/config.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit, OnDestroy {
  liveEvents: IEvent[];
  liveUrl: string;
  events = this.configSvc.instanceConfig.features.events.config;
  userRoles = new Set<string>();
  ROLES = EUserRoles;
  showIframeSupportWarning = true;
  safeLiveUrl: SafeResourceUrl;
  urlHasLiveUrl = false;
  fetchStatus: FetchStatus = 'fetching';
  notifierSubscription: Subscription;
  constructor(
    private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer,
    public routingSvc: RoutingService,
    public mobileAppsSvc: MobileAppsService,
    private accessControlSvc: AccessControlService,
    private telemetrySvc: TelemetryService,
    private miscSvc: MiscService,
    private snackBar: MatSnackBar,
    private configSvc: ConfigService
  ) {}

  ngOnInit() {
    this.getUserRoles();
    this.miscSvc.fetchLiveEvents().subscribe(
      data => {
        data = (data || []).filter(
          event => new Date(event.end_time) > new Date()
        );
        this.liveEvents = data;
        this.fetchStatus = 'done';
      },
      err => {
        this.fetchStatus = 'error';
      }
    );
    this.activatedRoute.queryParamMap.subscribe(qparamsMap => {
      this.liveUrl = qparamsMap.get('liveUrl');
      if (this.liveUrl) {
        this.urlHasLiveUrl = true;
        if (this.notifierSubscription) {
          this.notifierSubscription.unsubscribe();
        }
        this.notifier('RUNNING');
        this.notifierSubscription = interval(30000).subscribe(() => {
          this.notifier('RUNNING');
        });
        this.safeLiveUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          this.liveUrl
        );
      } else {
        this.urlHasLiveUrl = false;
      }
    });
  }

  ngOnDestroy() {
    if (this.notifierSubscription) {
      this.notifierSubscription.unsubscribe();
    }
  }

  private notifier(state: COMM_STATES) {
    const eventData: ILiveEventTelemetry = {
      eventUrl: this.liveUrl,
      state,
      force: false,
      isIdeal: false
    };
    this.telemetrySvc.liveTelemetryEvent(eventData);
  }

  private getUserRoles() {
    this.accessControlSvc.getUserRoles().subscribe(data => {
      this.userRoles = data;
    });
  }

  isCurrentTimeSmall(timestamp: string) {
    return new Date() < new Date(timestamp);
  }

  sendToMobile(liveEvent: TLiveEvent, appOutdatedMsg: string) {
    if (this.mobileAppsSvc.isFunctionAvailableInAndroid(liveEvent)) {
      this.mobileAppsSvc.sendLiveEvent(liveEvent);
    } else {
      this.snackBar.open(appOutdatedMsg);
    }
  }

  get currentTime() {
    return new Date();
  }
}
