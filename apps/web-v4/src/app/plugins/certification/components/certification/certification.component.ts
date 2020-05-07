/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { AfterViewInit, Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { MIME_TYPE } from '../../../../constants/mime.constants';
import { COMM_STATES, IIframeTelemetry } from '../../../../models/comm-events.model';
import { IContent } from '../../../../models/content.model';
import { CertificationService } from '../../../../services/certification.service';
import { HistoryService } from '../../../../services/history.service';
import { TelemetryService } from '../../../../services/telemetry.service';
import { IProcessedViewerContent } from '../../../../services/viewer.service';
@Component({
  selector: 'ws-certification',
  templateUrl: './certification.component.html',
  styleUrls: ['./certification.component.scss']
})
export class CertificationComponent
  implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  processedContent: IProcessedViewerContent;
  collectionId: string;
  certificateContent: IContent;
  iframeUrl: SafeResourceUrl;
  screenSizeIssue = false;
  showPreloadMessage = false;
  startTimerSeconds = 15;
  startInterval: any;
  proctoringWarning = false;
  proctoringStarted = false;
  certificationStatus: 'loading' | 'passed' | 'eligible' | 'failed' | 'error' =
    'loading';
  telemetryRunningSubscription: Subscription;
  constructor(
    private domSanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private telemetrySvc: TelemetryService,
    private historySvc: HistoryService,
    private certificationSvc: CertificationService
  ) {
    this.telemetryRunningSubscription = interval(30000).subscribe(() => {
      if (
        this.processedContent &&
        this.processedContent.content &&
        this.processedContent.content.identifier
      ) {
        this.raiseEvent('RUNNING');
      }
    });
  }
  paramSubscription;

  ngOnInit() {
    this.paramSubscription = this.route.data.subscribe(data => {
      this.processedContent = data.playerDetails.processedResource;
      this.collectionId = data.playerDetails.toc.identifier;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const property in changes) {
      if (property === 'processedContent' && this.processedContent) {
        this.certificationStatus = 'loading';
        this.certificationSvc.fetchCertifications().subscribe(
          data => {
            data.cannotAttemptList.forEach(certificate => {
              if (
                certificate.identifier ===
                this.processedContent.content.identifier
              ) {
                this.certificationStatus = 'failed';
                this.certificateContent = this.processedContent.content;
                return;
              }
            });
            data.passedList.forEach(certificate => {
              if (
                certificate.identifier ===
                this.processedContent.content.identifier
              ) {
                this.certificationStatus = 'passed';
                this.certificateContent = this.processedContent.content;
                return;
              }
            });
            if (
              this.certificationStatus !== 'failed' &&
              this.certificationStatus !== 'passed'
            ) {
              this.certificationStatus = 'eligible';
              this.reset();
              this.checkContainerSize();
            }
          },
          err => {
            this.certificationStatus = 'error';
          }
        );
        if (
          this.collectionId == null ||
          this.collectionId === this.processedContent.content.identifier
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
      }
    }
  }

  ngAfterViewInit() {
    window.addEventListener('message', event => {
      if (!event.data) {
        console.log('data unavailable');
        return;
      }
      if (
        event.data.functionToExecute &&
        event.data.functionToExecute === 'turnOnProctoring'
      ) {
        this.turnOnProctoring();
        this.proctoringStarted = true;
      } else if (
        event.data.functionToExecute &&
        event.data.functionToExecute === 'turnOffProctoring'
      ) {
        this.turnOffProctoring();
        this.proctoringStarted = false;
      }
    });
  }
  ngOnDestroy() {
    if (this.telemetryRunningSubscription) {
      this.telemetryRunningSubscription.unsubscribe();
    }
    this.raiseEvent('ENDED');
    if (this.proctoringStarted) {
      this.turnOffProctoring();
    }
  }
  private reset() {
    this.screenSizeIssue = false;
    this.showPreloadMessage = false;
    this.startTimerSeconds = 15;

    this.iframeUrl = null;
  }

  private checkContainerSize() {
    const elemWidth = document.getElementById('certification-width')
      .offsetWidth;
    const screenWidth = screen.width / elemWidth;
    let idealScreenSize;
    try {
      idealScreenSize =
        parseInt(this.processedContent.content.idealScreenSize, 10) || 10;
    } catch (e) {
      idealScreenSize = 10;
    }
    if (screenWidth < idealScreenSize) {
      this.screenSizeIssue = true;
    } else {
      this.initiateLoad();
    }
  }

  private initiateLoad() {
    this.showPreloadMessage = true;
    this.startInterval = setInterval(() => {
      this.startTimerSeconds -= 1;
      if (this.startTimerSeconds === 0) {
        clearInterval(this.startInterval);
        this.loadContent();
      }
    }, 1000);
  }

  private loadContent() {
    this.showPreloadMessage = false;
    if (this.startInterval) {
      clearInterval(this.startInterval);
    }
    if (
      this.processedContent.content &&
      this.processedContent.content.artifactUrl
    ) {
      this.raiseEvent('LOADED');
      this.iframeUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(
        this.processedContent.content.artifactUrl
      );
    } else {
      this.iframeUrl = null;
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
    document.addEventListener(
      'webkitfullscreenchange',
      this.fullscreenCheck,
      false
    );
    document.addEventListener(
      'mozfullscreenchange',
      this.fullscreenCheck,
      false
    );
    document.addEventListener(
      'msfullscreenchange',
      this.fullscreenCheck,
      false
    );
    document.addEventListener('fullscreenchange', this.fullscreenCheck, false);
  }

  private sendProctoringInfo(event) {
    const iframeElem = (document.getElementById(
      'certification-iframe'
    ) as HTMLIFrameElement).contentWindow;
    const dataToSend = {
      proctoring: event
    };
    iframeElem.postMessage(dataToSend, '*');
    // console.log('event at posting:', event)
    if (event === 'esc' || event === 'fullScreen') {
      this.proctoringWarning = true;
    }
  }

  enterFullScreen() {
    this.proctoringWarning = false;

    const elem = document.getElementById('certification-iframe');
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
    document.removeEventListener(
      'webkitfullscreenchange',
      this.fullscreenCheck
    );
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
    // console.log('FS call')
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
