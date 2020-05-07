/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { UtilityService } from '../../../../services/utility.service';
import { requestFullScreen, requestExitFullScreen, getFullScreenElement } from '../../../../utils/fullScreen';

@Component({
  selector: 'app-btn-element-fullscreen',
  templateUrl: './btn-element-fullscreen.component.html',
  styleUrls: ['./btn-element-fullscreen.component.scss']
})
export class BtnElementFullscreenComponent implements OnInit {
  @Input() elementRef: ElementRef<HTMLDivElement>;
  hasFullScreenSupport = this.utilitySvc.hasFullScreenSupport;
  isFullScreen = false;
  constructor(private utilitySvc: UtilityService) {}

  ngOnInit() {
    if (this.hasFullScreenSupport) {
      document.addEventListener('fullscreenchange', this.fullscreenCheck, false);
      document.addEventListener('mozfullscreenchange', this.fullscreenCheck, false);
      document.addEventListener('msfullscreenchange', this.fullscreenCheck, false);
      document.addEventListener('webkitfullscreenchange', this.fullscreenCheck, false);
    }
  }

  toggleFullscreen() {
    if (this.elementRef && !this.isFullScreen) {
      this.requestFullScreen(this.elementRef.nativeElement);
    } else if (this.isFullScreen) {
      this.requestExitFullScreen();
    }
  }

  fullscreenCheck = () => {
    if (getFullScreenElement()) {
      this.isFullScreen = true;
    } else {
      this.isFullScreen = false;
    }
  }

  private requestFullScreen(elem: HTMLDivElement) {
    requestFullScreen(elem);
  }
  private requestExitFullScreen() {
    requestExitFullScreen();
  }
}
