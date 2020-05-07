/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, Input, OnInit, OnDestroy } from '@angular/core'
import { NsWidgetResolver, WidgetBaseComponent } from '@ws-widget/resolver'
import { Subscription, fromEvent } from 'rxjs'
import {
  getFullScreenElement,
  requestExitFullScreen,
  requestFullScreen,
  hasFullScreenSupport,
} from './fullscreen.util'

@Component({
  selector: 'ws-widget-btn-fullscreen',
  templateUrl: './btn-fullscreen.component.html',
  styleUrls: ['./btn-fullscreen.component.scss'],
})
export class BtnFullscreenComponent extends WidgetBaseComponent
  implements OnInit, OnDestroy, NsWidgetResolver.IWidgetData<{ fsContainer: HTMLElement | null }> {
  @Input() widgetData!: { fsContainer: HTMLElement | null }

  isFullScreenSupported = false
  isInFs = false
  fsChangeSubs: Subscription | null = null

  ngOnInit() {
    if (!this.widgetData.fsContainer) {
      return
    }
    this.isInFs = Boolean(getFullScreenElement())
    this.fsChangeSubs = fromEvent(document, 'fullscreenchange').subscribe(() => {
      this.isInFs = Boolean(getFullScreenElement())
    })
    this.isFullScreenSupported = hasFullScreenSupport(this.widgetData.fsContainer)
  }

  ngOnDestroy() {
    if (this.fsChangeSubs) {
      this.fsChangeSubs.unsubscribe()
    }
  }

  toggleFs() {
    if (getFullScreenElement()) {
      requestExitFullScreen()
    } else if (this.widgetData.fsContainer) {
      requestFullScreen(this.widgetData.fsContainer)
      try {
        this.widgetData.fsContainer.classList.add('mat-app-background')
      } catch (err) {}
    }
  }
}
