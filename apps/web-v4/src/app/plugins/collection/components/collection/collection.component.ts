/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, ElementRef, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { fromEvent, interval, Subscription } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { MIME_TYPE } from '../../../../constants/mime.constants';
import { COMM_EVENT_TYPES, COMM_STATES, ICommEvent, IPdfPluginTelemetry } from '../../../../models/comm-events.model';
import { FetchStatus } from '../../../../models/status.model';
import { HistoryService } from '../../../../services/history.service';
import { TelemetryService } from '../../../../services/telemetry.service';
import { ValuesService } from '../../../../services/values.service';
import { IProcessedViewerContent, ViewerService } from '../../../../services/viewer.service';
import logger from '../../../../utils/logger';
import { IUserFetchGroupForEducatorResponse } from '../../../../models/exercise-submission.model';
import { ExerciseService } from '../../../../services/exercise-submission.service';

/**
 * CODE_REVEIW
 *
 * Exercise Service  has  been deleted. Implement properly
 */
const TELEMETRY_EVENT_TYPE: COMM_EVENT_TYPES = 'TELEMETRY';
const pdfPluginPath = '/public-assets/common/plugins/pdf/web/viewer.html';
@Component({
  selector: 'ws-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss']
})
export class CollectionComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('slideAudio', { static: false }) slideAudio: ElementRef<HTMLAudioElement>;
  @ViewChild('webModuleContainer', { static: true }) webModuleContainer: ElementRef<HTMLDivElement>;
  processedContent: IProcessedViewerContent;
  collectionId: string;

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
    private route: ActivatedRoute,
    private domSanitizer: DomSanitizer,
    private viewerSvc: ViewerService,
    private telemetrySvc: TelemetryService,
    private valuesSvc: ValuesService,
    private historySvc: HistoryService,
    private exerciseSvc: ExerciseService
  ) {}
  paramSubscription;
  ngOnInit() {
    this.paramSubscription = this.route.data.subscribe(data => {
      this.processedContent = data.playerDetails.processedResource;
      this.collectionId = data.playerDetails.toc.identifier;
      this.onInItFunction();
      this.onChangeFunction();
    });
  }
  onInItFunction() {
    this.intervalSubscription = interval(30000).subscribe(() => {
      if (this.processedContent && this.processedContent.content && this.slides.length) {
        this.raiseTelemetry('RUNNING');
      }
    });
    this.fetchEducatorGroups();
  }
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
  onChangeFunction() {
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
    const iframeDocument = iframe.contentWindow.document;
    const docFrag = iframeDocument.createDocumentFragment();

    const fontRoboto = iframeDocument.createElement('link');
    fontRoboto.setAttribute('href', 'https://fonts.googleapis.com/css?family=Roboto:300,400,500');
    fontRoboto.setAttribute('rel', 'stylesheet');

    const prettyCSSSkin = iframeDocument.createElement('link');
    prettyCSSSkin.setAttribute('href', '/public-assets/common/lib/google-code-prettify/skins/sunburst.css');
    prettyCSSSkin.setAttribute('rel', 'stylesheet');

    const prettyJS = iframeDocument.createElement('script');
    prettyJS.type = 'text/javascript';
    prettyJS.setAttribute('src', '/public-assets/common/lib/google-code-prettify/prettify.js');

    const webModuleCSS = iframeDocument.createElement('link');
    webModuleCSS.setAttribute('href', '/public-assets/common/plugins/web-module/web-module.css');
    webModuleCSS.setAttribute('rel', 'stylesheet');

    const normalizeCSS = iframeDocument.createElement('link');
    normalizeCSS.setAttribute('href', '/public-assets/common/lib/normalize.min.css');
    normalizeCSS.setAttribute('rel', 'stylesheet');

    const stylePart = iframeDocument.createElement('style');
    stylePart.type = 'text/css';
    stylePart.innerHTML = `
      .transparent-button {
        background: transparent;
        border: none;
        cursor: pointer;
      }
      .transparent-button:focus {
        outline: none;
      }
      .button-of-material {
      background-color: #3f51b5;
      color: #fff !important;
      box-sizing: border-box;
      position: relative;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      cursor: pointer;
      outline: 0;
      border: none;
      -webkit-tap-highlight-color: transparent;
      display: inline-block;
      white-space: nowrap;
      text-decoration: none;
      vertical-align: baseline;
      text-align: center;
      margin: 0;
      line-height: 32px;
      padding: 0 8px;
      border-radius: 4px;
      overflow: visible;
      transform: translate3d(0, 0, 0);
      transition: background .4s cubic-bezier(.25, .8, .25, 1), box-shadow 280ms cubic-bezier(.4, 0, .2, 1);
      font-family: Roboto, "Helvetica Neue", sans-serif;
      font-size: 14px;
      font-weight: 300;
  }

  .disabled-button {
      color: black !important;
      background-color: white;
  }

  .ripple {
      background-position: center;
      transition: background 0.8s;
  }

  .ripple:hover {
      background: #2f41a5 radial-gradient(circle, transparent 1%, #2f41a5 1%) center/15000%;
  }

  .ripple:active {
      background-color: #5f7fdf;
      background-size: 100%;
      transition: background 0s;
  }`;

    const executeJS = iframeDocument.createElement('script');
    executeJS.type = 'text/javascript';
    const theme = await this.valuesSvc.theme$.pipe(take(1)).toPromise();
    executeJS.innerHTML = `
      document.body.classList.add('app-background', '${theme.className}');
      for(var i=0; i < document.querySelectorAll("[style]").length; i++ ) {
        document.querySelectorAll("[style]")[i].setAttribute('style', null);
      }
      for(var i=0; i < document.querySelectorAll("pre").length; i++ ) {
        document.querySelectorAll("pre")[i].classList.add('prettyprint');
        document.querySelectorAll("pre")[i].setAttribute("id", "codepane"+i);
        document.querySelectorAll("pre")[i].classList.add('prettyprint');
        var btn = document.createElement("BUTTON");
        btn.innerHTML = "<img src='/public-assets/common/plugins/web-module/copyButtonImage.svg'/>";
        var newParam = "codepane"+i;
        var nParam = "copyButton"+i;
        btn.setAttribute("id", nParam);
        btn.setAttribute("class", "transparent-button")
        btn.style.float = "right";
        btn.style.color = "white";
        btn.setAttribute("onclick", "copyToClipBoardFunction("+newParam+","+nParam+")");
        document.querySelectorAll("pre")[i].appendChild(btn)
      }
      for(var i=0; i < document.querySelectorAll(".prettyprint").length; i++ ) {
        document.querySelectorAll(".prettyprint")[i].classList.add('linenums:1');
      }
      function copyToClipBoardFunction(param, nParam) {
        nParam.innerText = "Copied!";
        nParam.setAttribute("class","button-of-material disabled-button");
        const id = 'mycustom-clipboard-textarea-hidden-id';
        let existsTextarea = document.getElementById(id);
        if (!existsTextarea) {
          const textarea = document.createElement('textarea');
          textarea.id = id;
          // Place in top-left corner of screen regardless of scroll position.
          textarea.style.position = 'fixed';
          textarea.style.top = '0px';
          textarea.style.left = '0px';
          // Ensure it has a small width and height. Setting to 1px / 1em
          // doesn't work as this gives a negative w/h on some browsers.
          textarea.style.width = '1px';
          textarea.style.height = '1px';
          // We don't need padding, reducing the size if it does flash render.
          textarea.style.padding = '0px';
          // Clean up any borders.
          textarea.style.border = 'none';
          textarea.style.outline = 'none';
          textarea.style.boxShadow = 'none';
          // Avoid flash of white box if rendered for any reason.
          textarea.style.background = 'transparent';
          document.querySelector('body').appendChild(textarea);
          existsTextarea = document.getElementById(id);
        } else {
        }
        existsTextarea.value = param.innerText.slice(0,param.innerText.length-7);
        existsTextarea.select();
        try {
          const status = document.execCommand('copy');
          if (!status) {
            console.error('Cannot copy text');
          } else {
            const tooltip = document.getElementById('myTooltip');
            tooltip.innerHTML = 'Code Copied!';
          }
        } catch (err) {
        }
        setTimeout(
          function() {
            nParam.innerHTML = "<img src='/public-assets/common/plugins/web-module/copyButtonImage.svg'/>";
            nParam.setAttribute("class","transparent-button");
          }, 1000);
      }
      setTimeout(function() {
        try {
          PR.prettyPrint();
        } catch (e) {
          setTimeout(function() {
            PR.prettyPrint();
          }, 1000);
        }
      }, 500);
    `;
    docFrag.appendChild(normalizeCSS);
    docFrag.appendChild(fontRoboto);
    docFrag.appendChild(webModuleCSS);
    docFrag.appendChild(prettyCSSSkin);
    docFrag.appendChild(prettyJS);
    docFrag.appendChild(executeJS);
    docFrag.appendChild(stylePart);
    iframeDocument.head.appendChild(docFrag);
    setTimeout(() => {
      this.iframeLoadingInProgress = false;
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
    artifactUrl = this.urlPrefix + artifactUrl;
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
