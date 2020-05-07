/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, Input } from '@angular/core'
import { NsContent } from '../_services/widget-content.model'
import { NsWidgetResolver, WidgetBaseComponent } from '@ws-widget/resolver'

interface IButtonChannelAnalytics {
  identifier: string
  contentType: NsContent.EContentTypes
}
@Component({
  selector: 'ws-widget-btn-channel-analytics',
  templateUrl: './btn-channel-analytics.component.html',
  styleUrls: ['./btn-channel-analytics.component.scss'],
})
export class BtnChannelAnalyticsComponent extends WidgetBaseComponent
  implements NsWidgetResolver.IWidgetData<IButtonChannelAnalytics> {

  @Input() widgetData!: IButtonChannelAnalytics

  public get showButton() {
    if (this.widgetData.contentType === NsContent.EContentTypes.CHANNEL) {
      return true
    }
    return false
  }

}
