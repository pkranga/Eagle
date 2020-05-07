/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, Input } from '@angular/core'
import { NsWidgetResolver, WidgetBaseComponent } from '@ws-widget/resolver'
import { IIntranetSelector } from './intranet-selector.model'
import { IntranetSelectorService } from './intranet-selector.service'

@Component({
  selector: 'ws-widget-intranet-selector',
  templateUrl: './intranet-selector.component.html',
  styleUrls: ['./intranet-selector.component.scss'],
})
export class IntranetSelectorComponent extends WidgetBaseComponent
  implements OnInit, NsWidgetResolver.IWidgetData<IIntranetSelector | null> {
  @Input() widgetData: IIntranetSelector | null = null
  public activeWidget: NsWidgetResolver.IRenderConfigWithAnyData | null = null
  constructor(private intranetSelectorSvc: IntranetSelectorService) {
    super()
  }

  ngOnInit() {
    if (this.widgetData) {
      this.intranetSelectorSvc
        .isLoading()
        .then(() => {
          if (this.widgetData && this.widgetData.isIntranet) {
            this.activeWidget = this.widgetData.isIntranet.widget
          } else {
            this.activeWidget = null
          }
        })
        .catch(() => {
          if (this.widgetData && this.widgetData.isNotIntranet) {
            this.activeWidget = this.widgetData.isNotIntranet.widget
          } else {
            this.activeWidget = null
          }
        })
    } else {
      this.activeWidget = null
    }
  }
}
