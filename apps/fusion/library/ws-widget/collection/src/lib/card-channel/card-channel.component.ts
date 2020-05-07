/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, Input } from '@angular/core'
import { NsWidgetResolver, WidgetBaseComponent } from '@ws-widget/resolver'
import { IChannel } from './card-channel.model'
@Component({
  selector: 'ws-widget-card-channel',
  templateUrl: './card-channel.component.html',
  styleUrls: ['./card-channel.component.scss'],
})
export class CardChannelComponent extends WidgetBaseComponent implements OnInit, NsWidgetResolver.IWidgetData<IChannel> {

  @Input() widgetData!: IChannel

  constructor() {
    super()
  }

  ngOnInit() {
  }
}
