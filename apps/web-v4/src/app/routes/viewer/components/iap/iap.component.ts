/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input, OnChanges, OnDestroy, AfterViewInit } from '@angular/core';
import { IProcessedViewerContent } from '../../../../services/viewer.service';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { interval, Subscription } from 'rxjs';
import { COMM_STATES, IIframeTelemetry } from '../../../../models/comm-events.model';
import { MIME_TYPE } from '../../../../constants/mime.constants';
import { TelemetryService } from '../../../../services/telemetry.service';
import { HistoryService } from '../../../../services/history.service';

@Component({
  selector: 'app-iap',
  templateUrl: './iap.component.html',
  styleUrls: ['./iap.component.scss']
})
export class IapComponent implements OnChanges, OnInit, AfterViewInit, OnDestroy {
  @Input() processedContent: IProcessedViewerContent;
  @Input() collectionId: string;
  iframeUrl: SafeResourceUrl;
  telemetryIntervalSubscription: Subscription;
  proctoringWarning = false;
  proctoringStarted = false;
  constructor(
    private domSanitizer: DomSanitizer,
    private telemetrySvc: TelemetryService,
    private historySvc: HistoryService
  ) {}

  ngOnInit() {
    this.telemetryIntervalSubscription = interval(30000).subscribe(() => {
      if (this.processedContent && this.processedContent.content && this.processedContent.content.identifier) {
        this.raiseEvent('RUNNING');
      }
    });
  }
  ngAfterViewInit() {
    window.addEventListener('message', event => {
      if (!event.data) {
        console.log('data unavailable');
        return;
      }
      if (event.data.functionToExecute && event.data.functionToExecute === 'turnOnProctoring') {
        this.turnOnProctoring();
        this.proctoringStarted = true;
      } else if (event.data.functionToExecute && event.data.functionToExecute === 'turnOffProctoring') {
        this.turnOffProctoring();
        this.proctoringStarted = false;
      }
    });
  }
  ngOnChanges() {
    if (this.processedContent && this.processedContent.content && this.processedContent.content.artifactUrl) {
      this.raiseEvent('LOADED');
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
    if (this.proctoringStarted) {
      this.turnOffProctoring();
    }
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

  private turnOnProctoring() {
    this.sendProctoringInfo('none');
    this.sendProctoringInfo('fullScreen');

    window.addEventListener('contextmenu', this.contextCheck);
    window.addEventListener('beforeunload', this.beforeUnload);
    window.addEventListener('keydown', this.keydownCheck);
    document.body.addEventListener('copy', this.copyCheck);
    document.body.addEventListener('cut', this.cutCheck);
    document.body.addEventListener('paste', this.pasteCheck);
    document.addEventListener('visibilitychange', this.visibilityCheck);
    document.addEventListener('webkitfullscreenchange', this.fullscreenCheck, false);
    document.addEventListener('mozfullscreenchange', this.fullscreenCheck, false);
    document.addEventListener('msfullscreenchange', this.fullscreenCheck, false);
    document.addEventListener('fullscreenchange', this.fullscreenCheck, false);
  }

  private sendProctoringInfo(event) {
    const iframeElem = (document.getElementById('iap-iframe') as HTMLIFrameElement).contentWindow;
    const dataToSend = {
      proctoring: event
    };
    iframeElem.postMessage(dataToSend, '*');
    // console.log('event at posting:', event);
    if (event === 'esc' || event === 'fullScreen') {
      // console.log('PROCTORING WARNING TURNED ON');
      this.proctoringWarning = true;
    }
  }

  enterFullScreen() {
    this.proctoringWarning = false;
    const elem = document.getElementById('iap-iframe');
    if (elem) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        /* Firefox */
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        /* IE/Edge */
        elem.msRequestFullscreen();
      }
    }
  }

  private exitFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      /* Firefox */
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      /* Chrome, Safari and Opera */
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      /* IE/Edge */
      document.msExitFullscreen();
    }
  }

  private turnOffProctoring() {
    // console.log('turnOffProctoring called')
    window.removeEventListener('contextmenu', this.contextCheck);
    window.removeEventListener('beforeunload', this.beforeUnload);
    window.removeEventListener('keydown', this.keydownCheck);
    document.body.removeEventListener('copy', this.copyCheck);
    document.body.removeEventListener('cut', this.cutCheck);
    document.body.removeEventListener('paste', this.pasteCheck);
    document.removeEventListener('visibilitychange', this.visibilityCheck);
    document.removeEventListener('webkitfullscreenchange', this.fullscreenCheck);
    document.removeEventListener('fullscreenchange', this.fullscreenCheck);
    document.removeEventListener('mozfullscreenchange', this.fullscreenCheck);
    document.removeEventListener('msfullscreenchange', this.fullscreenCheck);

    // if (document.webkitExitFullscreen) {
    //   document.webkitExitFullscreen();
    // }
    // if (document.exitFullscreen) {
    //   document.exitFullscreen();
    // }
    this.exitFullscreen();
    this.proctoringWarning = false;
  }

  contextCheck = e => {
    this.sendProctoringInfo('rightClick');
    e.preventDefault();
  }
  beforeUnload = e => {
    this.sendProctoringInfo('beforeunload');
    e.returnValue = 'You are not allowed to close window.';
  }
  visibilityCheck = () => {
    console.log('document.visibilityState >', document.visibilityState);
    this.sendProctoringInfo('visibilitychange');
  }
  fullscreenCheck = () => {
    // console.log('FS called');
    this.sendProctoringInfo('fullScreen');
  }
  keydownCheck = (e: KeyboardEvent) => {
    // console.log('key pressed e >', e)
    if (e.altKey) {
      this.sendProctoringInfo('alt');
      e.preventDefault();
    } else if (e.ctrlKey) {
      this.sendProctoringInfo('ctrl');
      e.preventDefault();
    } else if (e.keyCode === 9) {
      this.sendProctoringInfo('tab');
      e.preventDefault();
    } else if (e.keyCode === 27) {
      this.sendProctoringInfo('esc');
      e.preventDefault();
    } else if (e.keyCode === 91) {
      this.sendProctoringInfo('window');
      e.preventDefault();
    } else if (e.keyCode === 112) {
      this.sendProctoringInfo('f1');
      e.preventDefault();
    } else if (e.keyCode === 119) {
      this.sendProctoringInfo('f8');
      e.preventDefault();
    } else if (e.keyCode === 123) {
      this.sendProctoringInfo('f12');
      e.preventDefault();
    }
  }

  copyCheck = e => {
    this.sendProctoringInfo('copy');
    e.preventDefault();
  }
  cutCheck = e => {
    this.sendProctoringInfo('cut');
    e.preventDefault();
  }
  pasteCheck = e => {
    this.sendProctoringInfo('paste');
    e.preventDefault();
  }
}
