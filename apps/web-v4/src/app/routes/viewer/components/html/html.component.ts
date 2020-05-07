/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { IProcessedViewerContent } from '../../../../services/viewer.service';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { COMM_STATES, IIframeTelemetry } from '../../../../models/comm-events.model';
import { MIME_TYPE } from '../../../../constants/mime.constants';
import { TelemetryService } from '../../../../services/telemetry.service';
import { Subscription, interval } from 'rxjs';
import { HistoryService } from '../../../../services/history.service';
import { FetchStatus } from '../../../../models/status.model';
import { IUserRealTimeProgressUpdateRequest } from '../../../../models/user.model';
import { UserService } from '../../../../services/user.service';
import { ConfigService } from '../../../../services/config.service';

@Component({
  selector: 'app-html',
  templateUrl: './html.component.html',
  styleUrls: ['./html.component.scss']
})
export class HtmlComponent implements OnChanges, OnInit, OnDestroy {
  @Input() processedContent: IProcessedViewerContent;
  @Input() collectionId: string;
  iframeUrl: SafeResourceUrl;

  realTimeProgressRequest: IUserRealTimeProgressUpdateRequest = {
    content_type: 'Resource',
    current: ['0'],
    max_size: 0,
    mime_type: MIME_TYPE.html,
    user_id_type: 'uuid'
  };
  realTimeProgressTimer: any;
  hasFiredRealTimeProgress = false;

  showIframeSupportWarning = false;
  showIsExternalMessage = false;
  pageFetchStatus: FetchStatus = 'fetching';
  telemetryIntervalSubscription: Subscription;
  constructor(
    private domSanitizer: DomSanitizer,
    private telemetrySvc: TelemetryService,
    private historySvc: HistoryService,
    private userSvc: UserService,
    private configSvc: ConfigService
  ) {}

  ngOnInit() {
    if (
      this.processedContent &&
      (this.collectionId == null || this.collectionId === this.processedContent.content.identifier)
    ) {
      this.historySvc
        .saveContinueLearning(
          {
            contextPathId: this.processedContent.content.identifier,
            resourceId: this.processedContent.content.identifier,
            data: JSON.stringify({ timestamp: Date.now() }),
            percentComplete: 100
          },
          this.processedContent.content.identifier
        )
        .toPromise()
        .catch(err => console.warn(err));
    }

    this.telemetryIntervalSubscription = interval(30000).subscribe(() => {
      if (this.processedContent && this.processedContent.content && this.processedContent.content.identifier) {
        this.raiseEvent('RUNNING');
      }
    });

    if (this.configSvc.instanceConfig.platform.updateRealTimeProgress) {
      this.raiseRealTimeProgress();
    }
  }

  ngOnChanges() {
    if (this.processedContent && this.processedContent.content && this.processedContent.content.artifactUrl) {
      const iframeSupport = this.processedContent.content.isIframeSupported.toLowerCase();
      this.raiseEvent('LOADED');
      if (iframeSupport === 'no') {
        this.showIframeSupportWarning = true;
        this.openInNewTab();
      } else if (iframeSupport === 'maybe') {
        this.showIframeSupportWarning = true;
      }
      const isExternal = this.processedContent.content.isExternal.toLowerCase();
      if (isExternal === 'yes' || isExternal === 'true') {
        this.showIsExternalMessage = true;
        setTimeout(() => {
          this.showIsExternalMessage = false;
        }, 5000);
      }
      this.iframeUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.processedContent.content.artifactUrl);
    } else {
      this.iframeUrl = null;
    }
  }

  ngOnDestroy() {
    if (this.telemetryIntervalSubscription) {
      this.telemetryIntervalSubscription.unsubscribe();
    }
    this.raiseEvent('ENDED');
    if (!this.hasFiredRealTimeProgress && this.configSvc.instanceConfig.platform.updateRealTimeProgress) {
      this._fireRealTimeProgress();
      if (this.realTimeProgressTimer) {
        clearTimeout(this.realTimeProgressTimer);
      }
    }
  }

  openInNewTab() {
    window.open(this.processedContent.content.artifactUrl);
  }

  dismiss() {
    this.showIframeSupportWarning = false;
  }

  onIframeLoadOrError(evt: 'load' | 'error') {
    setTimeout(() => {
      this.pageFetchStatus = evt === 'load' ? 'done' : 'error';
    }, 0);
  }

  raiseEvent(state: COMM_STATES) {
    const data: IIframeTelemetry = {
      courseId: this.collectionId,
      identifier: this.processedContent.content.identifier,
      isCompleted: true,
      mimeType: MIME_TYPE.html,
      isIdeal: false,
      url: this.processedContent.content.artifactUrl
    };
    this.telemetrySvc.playerTelemetryEvent({
      app: 'WEB_PLAYER_PLUGIN',
      plugin: 'certifications',
      type: 'TELEMETRY',
      state,
      data
    });
  }

  private raiseRealTimeProgress() {
    this.realTimeProgressRequest = {
      ...this.realTimeProgressRequest,
      current: ['1'],
      max_size: 1
    };
    if (this.realTimeProgressTimer) {
      clearTimeout(this.realTimeProgressTimer);
    }
    this.hasFiredRealTimeProgress = false;
    this.realTimeProgressTimer = setTimeout(() => {
      this.hasFiredRealTimeProgress = true;
      this._fireRealTimeProgress();
    }, 2 * 60 * 1000);
  }
  private _fireRealTimeProgress() {
    this.realTimeProgressRequest.content_type = this.processedContent.content.contentType;
    this.userSvc
      .realTimeProgressUpdate(this.processedContent.content.identifier, this.realTimeProgressRequest)
      .subscribe();
  }
}
