/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, Input } from '@angular/core'
import { WidgetBaseComponent, NsWidgetResolver } from '../../../../resolver/src/public-api'
import { IWidgetWrapperMedia } from './video-wrapper.model'

@Component({
  selector: 'ws-widget-video-wrapper',
  templateUrl: './video-wrapper.component.html',
  styleUrls: ['./video-wrapper.component.scss'],
})
export class VideoWrapperComponent extends WidgetBaseComponent implements
  OnInit, NsWidgetResolver.IWidgetData<IWidgetWrapperMedia> {

  @Input() widgetData!: IWidgetWrapperMedia
  constructor() {
    super()
  }

  ngOnInit() {
  }

}
