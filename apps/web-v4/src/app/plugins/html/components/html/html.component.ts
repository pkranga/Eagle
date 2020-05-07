/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { MIME_TYPE } from '../../../../constants/mime.constants';
import { COMM_STATES, IIframeTelemetry } from '../../../../models/comm-events.model';
import { HistoryService } from '../../../../services/history.service';
import { TelemetryService } from '../../../../services/telemetry.service';
import { IProcessedViewerContent } from '../../../../services/viewer.service';

@Component({
  selector: 'ws-html',
  templateUrl: './html.component.html',
  styleUrls: ['./html.component.scss']
})
export class HtmlComponent implements OnInit, OnChanges, OnInit, OnDestroy {
  processedContent: IProcessedViewerContent;
  collectionId: string;
  iframeUrl: SafeResourceUrl;

  showIframeSupportWarning = false;
  telemetryIntervalSubscription: Subscription;
  constructor(
    private domSanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private telemetrySvc: TelemetryService,
    private historySvc: HistoryService
  ) {}
  paramSubscription;

  ngOnInit() {
    this.paramSubscription = this.route.data.subscribe(data => {
      this.processedContent = data.playerDetails.processedResource;
      this.collectionId = data.playerDetails.toc.identifier;
      this.initialFunction();
      this.onChangeFunction();
    });
  }

  initialFunction() {
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
      this.iframeUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.processedContent.content.artifactUrl);
    } else {
      this.iframeUrl = null;
    }
  }
  onChangeFunction() {
    if (this.processedContent && this.processedContent.content && this.processedContent.content.artifactUrl) {
      const iframeSupport = this.processedContent.content.isIframeSupported.toLowerCase();
      this.raiseEvent('LOADED');
      if (iframeSupport === 'no') {
        this.showIframeSupportWarning = true;
        this.openInNewTab();
      } else if (iframeSupport === 'maybe') {
        this.showIframeSupportWarning = true;
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
  }

  openInNewTab() {
    window.open(this.processedContent.content.artifactUrl, '_blank');
  }

  dismiss() {
    this.showIframeSupportWarning = false;
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
}
