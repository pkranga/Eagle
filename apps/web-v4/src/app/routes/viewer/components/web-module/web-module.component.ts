/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { interval, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { MIME_TYPE } from '../../../../constants/mime.constants';
import { IUserRealTimeProgressUpdateRequest } from '../../../../models/user.model';
import { UserService } from '../../../../services/user.service';
import { COMM_STATES, ICommEvent, IPdfPluginTelemetry } from '../../../../models/comm-events.model';
import { ConfigService } from '../../../../services/config.service';
import { HistoryService } from '../../../../services/history.service';
import { TelemetryService } from '../../../../services/telemetry.service';
import { UtilityService } from '../../../../services/utility.service';
import { ValuesService } from '../../../../services/values.service';
import { IProcessedViewerContent, ViewerService } from '../../../../services/viewer.service';

@Component({
  selector: 'app-web-module',
  templateUrl: './web-module.component.html',
  styleUrls: ['./web-module.component.scss']
})
export class WebModuleComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('slideAudio', { static: false }) slideAudio: ElementRef<HTMLAudioElement>;
  @ViewChild('webModuleContainer', { static: true }) webModuleContainer: ElementRef<HTMLDivElement>;
  @ViewChild('iframeElem', { static: false }) iframeElem: ElementRef<HTMLIFrameElement>;
  @Input() processedContent: IProcessedViewerContent;
  @Input() collectionId: string;

  slides: Array<{
    title: string;
    URL: string;
    audio?: Array<{
      URL: string;
      title: string;
      label: string;
      srclang: string;
    }>;
    safeUrl?: SafeResourceUrl;
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
  fontSizes = [12, 14, 16, 18, 20, 22];
  isXSmall$ = this.valuesSvc.isXSmall$;
  screenSizeIsXSmall: boolean;
  readonly mimeType = MIME_TYPE;

  realTimeProgressRequest: IUserRealTimeProgressUpdateRequest = {
    content_type: 'Resource',
    current: [],
    max_size: 0,
    mime_type: MIME_TYPE.webModule,
    user_id_type: 'uuid'
  };
  realTimeProgressTimer: any;
  hasFiredRealTimeProgress = false;
  constructor(
    private domSanitizer: DomSanitizer,
    private viewerSvc: ViewerService,
    private telemetrySvc: TelemetryService,
    private valuesSvc: ValuesService,
    private historySvc: HistoryService,
    private utilitySvc: UtilityService,
    private userSvc: UserService,
    private configSvc: ConfigService
  ) {}

  ngOnChanges() {
    if (this.processedContent && this.processedContent.webModule && this.processedContent.content) {
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
    this.isXSmall$.subscribe(isXSmall => {
      this.screenSizeIsXSmall = isXSmall;
    });
    this.intervalSubscription = interval(30000).subscribe(() => {
      if (this.processedContent && this.processedContent.content && this.slides.length) {
        this.raiseTelemetry('RUNNING');
      }
    });
  }
  ngOnDestroy() {
    if (!this.hasFiredRealTimeProgress && this.configSvc.instanceConfig.platform.updateRealTimeProgress) {
      this._fireRealTimeProgress();
      if (this.realTimeProgressTimer) {
        clearTimeout(this.realTimeProgressTimer);
      }
    }
    this.raiseTelemetry('UNLOADED');
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
  }

  loadWebModule() {
    this.slides = this.processedContent.webModule.map(u => ({
      ...u,
      safeUrl: this.domSanitizer.bypassSecurityTrustResourceUrl(this.urlPrefix + u.URL)
    }));
    this.setPage(this.viewerSvc.resumePointStringToProgressNumber(this.processedContent.resumeData) || 1);
    this.raiseTelemetry('LOADED');
  }
  setPage(pageNumber: number) {
    if (this.iframeUrl && pageNumber === this.currentSlideNumber) {
      return;
    }
    if (pageNumber >= 1 && pageNumber <= this.slides.length) {
      this.currentSlideNumber = pageNumber;
      this.iframeUrl = this.slides[this.currentSlideNumber - 1].safeUrl;
      if (this.slides[this.currentSlideNumber - 1].audio) {
        this.setAudio(this.slides[this.currentSlideNumber - 1].audio);
      }
      this.raiseTelemetry('SLIDE_CHANGE');
      this.iframeLoadingInProgress = true;
    } else if (this.iframeUrl === null) {
      this.iframeUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.urlPrefix + this.slides[0].URL);
      if (this.slides[this.currentSlideNumber - 1].audio) {
        this.setAudio(this.slides[0].audio);
      }
      this.iframeLoadingInProgress = true;
      this.raiseTelemetry('SLIDE_CHANGE');
    }
    if (this.currentSlideNumber === this.slides.length) {
      this.isCompleted = true;
    }

    this.setAudio(this.slides[this.currentSlideNumber - 1].audio);
    if (this.currentSlideNumber > this.maxLastPageNumber) {
      this.maxLastPageNumber = this.currentSlideNumber;
    }

    if (this.configSvc.instanceConfig.platform.updateRealTimeProgress) {
      this.raiseRealTimeProgress();
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
  private raiseRealTimeProgress() {
    // To Do Fix later. Done to accomodate realTimeProgress.
    if (this.processedContent.content.mimeType === this.mimeType.webModuleExercise) {
      return;
    }
    const watchedPages = [...this.realTimeProgressRequest.current];
    this.realTimeProgressRequest = {
      ...this.realTimeProgressRequest,
      current: Array.from(new Set([...this.realTimeProgressRequest.current, this.currentSlideNumber.toString()])),
      max_size: this.slides.length
    };
    if (
      watchedPages.length === this.realTimeProgressRequest.current.length &&
      this.realTimeProgressRequest.current.every((val, i) => val === watchedPages[i])
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
    // To Do Fix later. Done to accomodate realTimeProgress.
    if (this.processedContent.content.mimeType === this.mimeType.webModuleExercise) {
      return;
    }
    this.realTimeProgressRequest.content_type = this.processedContent.content.contentType;
    this.userSvc
      .realTimeProgressUpdate(this.processedContent.content.identifier, this.realTimeProgressRequest)
      .subscribe();
  }
  setAudio(audios: Array<{ URL: string }>) {
    if (Array.isArray(audios) && audios.length && audios[0].URL) {
      this.slideAudioUrl = this.domSanitizer.bypassSecurityTrustUrl(this.urlPrefix + audios[0].URL);
    } else {
      this.slideAudioUrl = null;
    }
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
      isIdeal: false,
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
      // console.log('iframe Loading done');
      const fontSize = localStorage.getItem('webmodule_fontsize');
      if (fontSize) {
        this.modifyIframeFont(fontSize);
      }
    }, 1000);
  }

  modifyIframeFont(fontSize: string) {
    const doc: Document = (this.iframeElem.nativeElement as HTMLIFrameElement).contentWindow.document;
    doc.body.style.fontSize = `${fontSize}px`;
    localStorage.setItem('webmodule_fontsize', fontSize);
  }
}
