/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, OnDestroy, OnChanges, Input } from '@angular/core'
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser'

import { NsWidgetResolver, WidgetBaseComponent } from '@ws-widget/resolver'
import { NsEmbeddedPage } from './embedded-page.model'

@Component({
  selector: 'ws-widget-embedded-page',
  templateUrl: './embedded-page.component.html',
  styleUrls: ['./embedded-page.component.scss'],
})
export class EmbeddedPageComponent extends WidgetBaseComponent
  implements
    OnInit,
    OnDestroy,
    OnChanges,
    NsWidgetResolver.IWidgetData<NsEmbeddedPage.IEmbeddedPage | null> {
  @Input() widgetData: NsEmbeddedPage.IEmbeddedPage | null = null

  iframeSrc: SafeResourceUrl | null = null
  title: string | null = null
  constructor(private domSanitizer: DomSanitizer) {
    super()
  }

  ngOnInit() {
    if (this.widgetData && this.widgetData.iframeSrc) {
      this.iframeSrc = this.domSanitizer.bypassSecurityTrustResourceUrl(this.widgetData.iframeSrc)
    }
  }
  ngOnChanges(): void {
    if (this.widgetData) {
      this.iframeSrc = this.domSanitizer.bypassSecurityTrustResourceUrl(this.widgetData.iframeSrc)
    }
  }

  ngOnDestroy() {}
}
