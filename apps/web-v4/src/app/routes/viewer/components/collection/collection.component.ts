/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { fromEvent, interval, Subscription } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { MIME_TYPE } from '../../../../constants/mime.constants';
import { COMM_EVENT_TYPES, COMM_STATES, ICommEvent, IPdfPluginTelemetry } from '../../../../models/comm-events.model';
import { IUserFetchGroupForEducatorResponse } from '../../../../models/exercise-submission.model';
import { FetchStatus } from '../../../../models/status.model';
import { ExerciseService } from '../../../../services/exercise-submission.service';
import { HistoryService } from '../../../../services/history.service';
import { TelemetryService } from '../../../../services/telemetry.service';
import { ValuesService } from '../../../../services/values.service';
import { IProcessedViewerContent, ViewerService } from '../../../../services/viewer.service';

/**
 * CODE_REVEIW
 *
 * Exercise Service  has  been deleted. Implement properly
 */
const TELEMETRY_EVENT_TYPE: COMM_EVENT_TYPES = 'TELEMETRY';
const pdfPluginPath = '/public-assets/common/plugins/pdf/web/viewer.html';
@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss']
})
export class CollectionComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('slideAudio', { static: false }) slideAudio: ElementRef<HTMLAudioElement>;
  @ViewChild('webModuleContainer', { static: true }) webModuleContainer: ElementRef<HTMLDivElement>;
  @Input() processedContent: IProcessedViewerContent;
  @Input() collectionId: string;

  slides: Array<{
    title: string;
    artifactUrl: string;
    safeUrl?: SafeResourceUrl;
    mimeType: string;
  }>;
  currentSlideNumber = 1;
  iframeUrl: SafeResourceUrl = null;
  slideAudioUrl: SafeUrl = null;
  urlPrefix = '';
  sideListOpened = false;
  isCompleted = false;
  maxLastPageNumber = 1;
  private intervalSubscription: Subscription;

  iframeLoadingInProgress = true;
  fetchEducatorGroupsProgress: FetchStatus;

  isEducator: boolean;

  pdfUrl: SafeResourceUrl;
  pdfMaxLastPageNumber = 0;
  pdfPageChangeSubscription: Subscription;

  constructor(
    private valueSvc: ValuesService,
    private domSanitizer: DomSanitizer,
    private viewerSvc: ViewerService,
    private telemetrySvc: TelemetryService,
    private valuesSvc: ValuesService,
    private exerciseSvc: ExerciseService,
    private historySvc: HistoryService
  ) { }

  ngOnChanges() {
    if (this.processedContent && this.processedContent.collectionResource && this.processedContent.content) {
      this.currentSlideNumber = 1;
      this.maxLastPageNumber = 1;
      this.isCompleted = false;
      this.urlPrefix = this.processedContent.content.artifactUrl.substring(
        0,
        this.processedContent.content.artifactUrl.lastIndexOf('/')
      );
      this.loadWebModule();
    }
  }
  ngOnInit() {
    this.intervalSubscription = interval(30000).subscribe(() => {
      if (this.processedContent && this.processedContent.content && this.slides.length) {
        this.raiseTelemetry('RUNNING');
      }
    });
    this.fetchEducatorGroups();
  }
  ngOnDestroy() {
    this.raiseTelemetry('UNLOADED');
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
  }

  loadWebModule() {
    this.slides = this.processedContent.collectionResource.resources.map(u => {
      if (u.mimeType === MIME_TYPE.html) {
        return {
          ...u,
          safeUrl: this.domSanitizer.bypassSecurityTrustResourceUrl(this.urlPrefix + u.artifactUrl)
        };
      } else {
        return {
          ...u,
          safeUrl: this.domSanitizer.bypassSecurityTrustResourceUrl(this.getPdfUrl(u.artifactUrl))
        };
      }
    });
    this.setPage(this.viewerSvc.resumePointStringToProgressNumber(this.processedContent.resumeData) || 1);
    this.raiseTelemetry('LOADED');
  }
  setPage(pageNumber) {
    if (pageNumber >= 1 && pageNumber <= this.slides.length) {
      this.currentSlideNumber = pageNumber;
      this.iframeUrl = this.slides[this.currentSlideNumber - 1].safeUrl;
      this.raiseTelemetry('SLIDE_CHANGE');
      this.iframeLoadingInProgress = true;
    } else if (this.iframeUrl === null) {
      this.iframeUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.urlPrefix + this.slides[0].artifactUrl);

      this.iframeLoadingInProgress = true;
      this.raiseTelemetry('SLIDE_CHANGE');
    }
    if (this.currentSlideNumber === this.slides.length) {
      this.isCompleted = true;
    }

    if (this.currentSlideNumber > this.maxLastPageNumber) {
      this.maxLastPageNumber = this.currentSlideNumber;
    }
    this.historySvc
      .saveContinueLearning(
        {
          contextPathId: this.processedContent.content.identifier,
          resourceId: this.processedContent.content.identifier,
          percentComplete: this.isCompleted ? 100 : Math.round((this.maxLastPageNumber * 100) / this.slides.length),
          data: JSON.stringify({
            progress: this.currentSlideNumber,
            timestamp: Date.now()
          })
        },
        this.processedContent.content.identifier
      )
      .toPromise()
      .catch(err => console.warn(err));

    return this.currentSlideNumber;
  }

  pageChange(increment: number) {
    if (increment === 1 && this.currentSlideNumber < this.slides.length) {
      this.setPage(this.currentSlideNumber + 1);
    } else if (increment === -1 && this.currentSlideNumber > 1) {
      this.setPage(this.currentSlideNumber - 1);
    }
  }

  private raiseTelemetry(state: COMM_STATES) {
    const eventData: IPdfPluginTelemetry = {
      courseId: this.collectionId,
      force: false,
      identifier: this.processedContent.content.identifier,
      mimeType: this.processedContent.content.mimeType,
      isCompleted: this.isCompleted,
      pageNumber: this.currentSlideNumber,
      total: this.slides.length
    };
    const event: ICommEvent<IPdfPluginTelemetry> = {
      app: 'WEB_PLAYER_PLUGIN',
      data: eventData,
      plugin: 'webModule',
      state,
      type: 'TELEMETRY'
    };
    this.telemetrySvc.playerTelemetryEvent(event);
  }

  async modifyIframeDom(iframe: HTMLIFrameElement) {
    if (this.slides[this.currentSlideNumber - 1].mimeType !== MIME_TYPE.pdf) {
      const iframeDocument = iframe.contentWindow.document;
      const docFrag = iframeDocument.createDocumentFragment();

      const fontRoboto = iframeDocument.createElement('link');
      fontRoboto.setAttribute('href', 'https://fonts.googleapis.com/css?family=Roboto:300,400,500');
      fontRoboto.setAttribute('rel', 'stylesheet');

      const prettyCSSSkin = iframeDocument.createElement('link');
      prettyCSSSkin.setAttribute('href', '/public-assets/common/google-code-prettify/skins/sunburst.css');
      prettyCSSSkin.setAttribute('rel', 'stylesheet');

      const prettyJS = iframeDocument.createElement('script');
      prettyJS.type = 'text/javascript';
      prettyJS.setAttribute('src', '/public-assets/common/google-code-prettify/prettify.js');

      const webModuleCSS = iframeDocument.createElement('link');
      webModuleCSS.setAttribute('href', '/public-assets/common/lib/web-module.css');
      webModuleCSS.setAttribute('rel', 'stylesheet');

      const normalizeCSS = iframeDocument.createElement('link');
      normalizeCSS.setAttribute('href', '/public-assets/common/lib/normalize.min.css');
      normalizeCSS.setAttribute('rel', 'stylesheet');

      const executeJS = iframeDocument.createElement('script');
      executeJS.type = 'text/javascript';
      const themeName = await this.valuesSvc.theme$.pipe(take(1)).toPromise();
      executeJS.innerHTML = `
      document.body.classList.add('app-background', '${themeName}');
      document.querySelectorAll("[style]").forEach(function(elem) {
        elem.setAttribute('style', null)
      })
      document.querySelectorAll(".prettyprint").forEach(function(elem) {
        elem.classList.add('linenums:1');
      })
        setTimeout(function() {
          PR.prettyPrint();
        }, 1000)
      `;
      docFrag.appendChild(normalizeCSS);
      docFrag.appendChild(fontRoboto);
      docFrag.appendChild(webModuleCSS);
      docFrag.appendChild(prettyCSSSkin);
      docFrag.appendChild(prettyJS);
      docFrag.appendChild(executeJS);
      iframeDocument.head.appendChild(docFrag);
    }
    setTimeout(() => {
      this.iframeLoadingInProgress = false;
      // console.log('iframe Loading done');
    }, 1000);
  }

  pdfPageChangeHandler() {
    this.pdfPageChangeSubscription = fromEvent<MessageEvent>(window, 'message')
      .pipe(
        filter(event => event && event.data && event.data.type === TELEMETRY_EVENT_TYPE),
        map((event): ICommEvent<IPdfPluginTelemetry> => event.data),
        filter(commEvent => commEvent.state === 'SLIDE_CHANGE'),
        map(commEvent => commEvent.data)
      )
      .subscribe((data: IPdfPluginTelemetry) => {
        if (data.pageNumber && data.pageNumber > this.maxLastPageNumber) {
          this.maxLastPageNumber = data.pageNumber;
        }
        this.historySvc
          .saveContinueLearning(
            {
              contextPathId: this.processedContent.content.identifier,
              resourceId: this.processedContent.content.identifier,
              percentComplete:
                data.total && data.total > 0 ? Math.round((this.maxLastPageNumber * 100) / data.total) : 100,
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

  private getPdfUrl(artifactUrl: string): string {
    // artifactUrl = this.urlPrefix + artifactUrl;
    artifactUrl = artifactUrl.replace(this.valueSvc.CONTENT_URL_PREFIX_REGEX, '')
    // artifactUrl = artifactUrl.replace(PREF, '')
    const pageNumber: number = this.viewerSvc.resumePointStringToProgressNumber(this.processedContent.resumeData);

    return (
      pdfPluginPath +
      `?file=${artifactUrl}&contentId=${this.processedContent.content.identifier}` +
      (this.collectionId ? `&courseId=${this.collectionId}` : '') +
      (pageNumber ? `&startFrom=${pageNumber}` : '')
    );
  }

  private fetchEducatorGroups() {
    this.fetchEducatorGroupsProgress = 'fetching';
    this.exerciseSvc.fetchGroupForEducator().subscribe((data: IUserFetchGroupForEducatorResponse[]) => {
      this.fetchEducatorGroupsProgress = 'done';
      this.isEducator = data.length > 0;
    });
  }
}
