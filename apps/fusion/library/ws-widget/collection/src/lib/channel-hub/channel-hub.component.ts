/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, Input } from '@angular/core'
import { NsWidgetResolver, WidgetBaseComponent } from '@ws-widget/resolver'
import { IChannelHub } from './channel-hub.model'

@Component({
  selector: 'ws-widget-channel-hub',
  templateUrl: './channel-hub.component.html',
  styleUrls: ['./channel-hub.component.scss'],
})
export class ChannelHubComponent extends WidgetBaseComponent implements OnInit, NsWidgetResolver.IWidgetData<IChannelHub> {

  @Input() widgetData!: IChannelHub

  ngOnInit() {
  }

}
