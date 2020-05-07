/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { MIME_TYPE } from '../../../../constants/mime.constants';
import { COMM_STATES, IIframeTelemetry } from '../../../../models/comm-events.model';
import { AuthService } from '../../../../services/auth.service';
import { HistoryService } from '../../../../services/history.service';
import { TelemetryService } from '../../../../services/telemetry.service';
import { UserService } from '../../../../services/user.service';
import { IProcessedViewerContent } from '../../../../services/viewer.service';

@Component({
  selector: 'ws-ilp-fp',
  templateUrl: './ilp-fp.component.html',
  styleUrls: ['./ilp-fp.component.scss']
})
export class IlpFpComponent implements OnInit, OnDestroy {
  processedContent: IProcessedViewerContent;
  collectionId: string;
  iframeUrl: SafeResourceUrl;

  @ViewChild('fpIframe', { static: true }) fpIframeElement: ElementRef<HTMLIFrameElement>;
  telemetryIntervalSubscription: Subscription;
  constructor(
    private route: ActivatedRoute,
    private domSanitizer: DomSanitizer,
    private userSvc: UserService,
    private authSvc: AuthService,
    private telemetrySvc: TelemetryService,
    private historySvc: HistoryService
  ) {}
  paramSubscription;
  ngOnInit() {
    this.paramSubscription = this.route.data.subscribe(data => {
      this.processedContent = data.playerDetails.processedResource;
      this.collectionId = data.playerDetails.toc.identifier;
      this.onInItFunction();
    });
  }
  onInItFunction() {
    this.raiseEvent('LOADED');
    this.telemetryIntervalSubscription = interval(30000).subscribe(() => {
      if (this.processedContent && this.processedContent.content && this.processedContent.content.identifier) {
        this.raiseEvent('RUNNING');
        if (this.collectionId == null || this.collectionId === this.processedContent.content.identifier) {
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
      }
    });
    this.iframeUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.processedContent.content.artifactUrl);
  }
  ngOnDestroy() {
    if (this.telemetryIntervalSubscription) {
      this.telemetryIntervalSubscription.unsubscribe();
    }
    this.raiseEvent('ENDED');
  }
  iframeLoaded() {
    this.userSvc.fetchUserGraphProfile().subscribe(data => {
      const employeeId = (data && data.companyName) || '';
      const token = this.authSvc.token;
      const dataToSend = {
        jwtToken: token,
        host: document.baseURI,
        targetUrl: this.processedContent.content.artifactUrl,
        resourceId: this.processedContent.content.identifier,
        empId: employeeId
      };
      const iframeNativeElem = this.fpIframeElement.nativeElement.contentWindow;
      setTimeout(() => {
        iframeNativeElem.postMessage(dataToSend, '*');
      }, 2000);
    });
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
