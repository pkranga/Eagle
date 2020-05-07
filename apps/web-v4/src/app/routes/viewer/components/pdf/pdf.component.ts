/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import {
  IProcessedViewerContent,
  ViewerService
} from '../../../../services/viewer.service';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { fromEvent, Subscription } from 'rxjs';
import {
  COMM_EVENT_TYPES,
  COMM_STATES,
  ICommEvent,
  IPdfPluginTelemetry
} from '../../../../models/comm-events.model';
import { filter, map, tap } from 'rxjs/operators';
import { HistoryService } from '../../../../services/history.service';
import { IUserRealTimeProgressUpdateRequest } from '../../../../models/user.model';
import { MIME_TYPE } from '../../../../constants/mime.constants';
import { UserService } from '../../../../services/user.service';
import { ConfigService } from '../../../../services/config.service';

const TELEMETRY_EVENT_TYPE: COMM_EVENT_TYPES = 'TELEMETRY';
const pdfPluginPath = '/public-assets/common/plugins/pdf/web/viewer.html';
@Component({
  selector: 'app-pdf',
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.scss']
})
export class PdfComponent implements OnChanges, OnDestroy {
  @Input() processedContent: IProcessedViewerContent;
  @Input() collectionId: string;
  iframeUrl: SafeResourceUrl;
  maxLastPageNumber = 0;
  pageChangeSubscription: Subscription;

  realTimeProgressRequest: IUserRealTimeProgressUpdateRequest = {
    content_type: 'Resource',
    current: [],
    max_size: 0,
    mime_type: MIME_TYPE.pdf,
    user_id_type: 'uuid'
  };
  realTimeProgressTimer: any;
  hasFiredRealTimeProgress = false;
  constructor(
    private domSanitizer: DomSanitizer,
    private viewerSvc: ViewerService,
    private historySvc: HistoryService,
    private userSvc: UserService,
    private configSvc: ConfigService
  ) {}

  ngOnChanges() {
    if (this.processedContent && this.processedContent.content) {
      this.pageChangeHandler();
      this.iframeUrl = null;
      this.maxLastPageNumber = 0;
      const url = this.getUrl();
      if (url) {
        this.iframeUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(url);
      }
    }
  }

  pageChangeHandler() {
    this.pageChangeSubscription = fromEvent<MessageEvent>(window, 'message')
      .pipe(
        filter(
          event =>
            event && event.data && event.data.type === TELEMETRY_EVENT_TYPE
        ),
        map((event): ICommEvent<IPdfPluginTelemetry> => event.data),
        filter(
          commEvent =>
            commEvent.state === 'SLIDE_CHANGE' || commEvent.state === 'LOADED'
        ),
        map(commEvent => commEvent.data)
      )
      .subscribe((data: IPdfPluginTelemetry) => {
        if (data.pageNumber && data.pageNumber > this.maxLastPageNumber) {
          this.maxLastPageNumber = data.pageNumber;
        }
        if (this.configSvc.instanceConfig.platform.updateRealTimeProgress) {
          this.raiseRealTimeProgress(data);
        }
        this.historySvc
          .saveContinueLearning(
            {
              contextPathId: this.processedContent.content.identifier,
              resourceId: this.processedContent.content.identifier,
              percentComplete:
                data.total && data.total > 0
                  ? Math.round((this.maxLastPageNumber * 100) / data.total)
                  : 100,
              data: JSON.stringify({
                progress: data.pageNumber || this.maxLastPageNumber,
                timestamp: Date.now()
              })
            },
            this.processedContent.content.identifier
          )
          .toPromise()
          .catch(err => console.warn(err));
      });
  }

  private raiseRealTimeProgress(data: IPdfPluginTelemetry) {
    const watchedPages = [...this.realTimeProgressRequest.current];
    this.realTimeProgressRequest = {
      ...this.realTimeProgressRequest,
      current: Array.from(
        new Set([
          ...this.realTimeProgressRequest.current,
          data.pageNumber.toString()
        ])
      ),
      max_size: data.total
    };
    if (
      watchedPages.length === this.realTimeProgressRequest.current.length &&
      this.realTimeProgressRequest.current.every(
        (val, i) => val === watchedPages[i]
      )
    ) {
      return;
    } else {
      if (this.realTimeProgressTimer) {
        clearTimeout(this.realTimeProgressTimer);
      }
      this.hasFiredRealTimeProgress = false;
      this.realTimeProgressTimer = setTimeout(() => {
        this.hasFiredRealTimeProgress = true;
        this._fireRealTimeProgress();
      }, 2 * 60 * 1000);
    }
  }
  private _fireRealTimeProgress() {
    if (!this.realTimeProgressRequest.current.length) {
      return;
    }
    this.userSvc
      .realTimeProgressUpdate(
        this.processedContent.content.identifier,
        this.realTimeProgressRequest
      )
      .subscribe();
  }

  private getUrl(): string {
    let artifactUrl: string;
    const pageNumber: number = this.viewerSvc.resumePointStringToProgressNumber(
      this.processedContent.resumeData
    );
    if (
      this.processedContent &&
      this.processedContent.content &&
      this.processedContent.content.artifactUrl
    ) {
      artifactUrl = this.processedContent.content.artifactUrl;
    }
    if (!artifactUrl) {
      return null;
    }

    // artifactUrl = '/public-assets/common/samples/sample.pdf';

    return (
      `${pdfPluginPath}?file=${encodeURIComponent(artifactUrl)}&contentId=${
        this.processedContent.content.identifier
      }` +
      (this.collectionId ? `&courseId=${this.collectionId}` : '') +
      (pageNumber ? `&startFrom=${pageNumber}` : '')
    );
  }

  ngOnDestroy() {
    if (
      !this.hasFiredRealTimeProgress &&
      this.configSvc.instanceConfig.platform.updateRealTimeProgress
    ) {
      this._fireRealTimeProgress();
      if (this.realTimeProgressTimer) {
        clearTimeout(this.realTimeProgressTimer);
      }
    }
    if (this.pageChangeSubscription) {
      this.pageChangeSubscription.unsubscribe();
    }
  }
}
