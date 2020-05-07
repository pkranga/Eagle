/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { RoutingService } from '../../../../services/routing.service';
import { ConfigService } from '../../../../services/config.service';

@Component({
  selector: 'app-practice',
  templateUrl: './practice.component.html',
  styleUrls: ['./practice.component.scss']
})
export class PracticeComponent implements OnInit, AfterViewInit, OnDestroy {
  currentTab: string;
  paramSubscription: Subscription;
  practiceUrl: string;
  proctoringWarning = false;
  proctoringStarted = false;
  constructor(
    private route: ActivatedRoute,
    public routingSvc: RoutingService,
    private configSvc: ConfigService,
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.currentTab = params.type;
      switch (this.currentTab) {
        case 'subjective':
          this.practiceUrl = this.configSvc.instanceConfig.externalLinks.iapSubjective;
          break;
        case 'objective':
          this.practiceUrl = this.configSvc.instanceConfig.externalLinks.iapObjective;
          break;
        case 'dashboard':
          this.practiceUrl = this.configSvc.instanceConfig.externalLinks.iapDashboard;
          break;
        case 'authoring':
          this.practiceUrl = this.configSvc.instanceConfig.externalLinks.iapAuthoring;
          break;
        case 'behavioral':
          this.practiceUrl = this.configSvc.instanceConfig.externalLinks.iapBehavioral;
          break;
        case 'puzzle-mania':
          this.practiceUrl = this.configSvc.instanceConfig.externalLinks.iapHandsOn;
          break;
        case 'playground':
          this.practiceUrl = this.configSvc.instanceConfig.externalLinks.iapHandsOn;
          break;
        case 'code-crack':
          this.practiceUrl = this.configSvc.instanceConfig.externalLinks.iapHandsOn;
          break;
        default:
          this.practiceUrl = '';
          break;
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

  ngOnDestroy() {
    if (this.paramSubscription) {
      this.paramSubscription.unsubscribe();
    }
    if (this.proctoringStarted) {
      this.turnOffProctoring();
    }
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
    const iframeElem = (document.getElementById('practice-iframe') as HTMLIFrameElement).contentWindow;
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

    const elem = document.getElementById('practice-iframe');
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

    if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
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
