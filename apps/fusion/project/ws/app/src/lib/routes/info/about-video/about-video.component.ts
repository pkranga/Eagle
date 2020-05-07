/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit } from '@angular/core'
import { NsWidgetResolver } from '@ws-widget/resolver'
import { IWidgetsPlayerMediaData } from '@ws-widget/collection'
import { ConfigurationsService } from '../../../../../../../../library/ws-widget/utils/src/public-api'

@Component({
  selector: 'ws-app-about-video',
  templateUrl: './about-video.component.html',
  styleUrls: ['./about-video.component.scss'],
})
export class AboutVideoComponent implements OnInit {
  introVideos: any
  objectKeys = Object.keys
  widgetResolverData: NsWidgetResolver.IRenderConfigWithTypedData<
    IWidgetsPlayerMediaData
  > = {
    widgetData: {
      url: '',
      autoplay: true,
      identifier: '',
    },
    widgetHostClass: 'video-full block',
    widgetSubType: 'playerVideo',
    widgetType: 'player',
    widgetHostStyle: {
      height: '350px',
    },
  }

  constructor(private configSvc: ConfigurationsService) { }

  ngOnInit() {
    if (this.configSvc.instanceConfig) {

      this.introVideos = this.configSvc.instanceConfig.introVideo
      // console.log('TYPE: ', this.introVideos)
    }
    this.widgetResolverData = {
      ...this.widgetResolverData,
      widgetData: {
        ...this.widgetResolverData.widgetData,
        url: this.introVideos['en'],
      },
    }
  }

  onItemChange(value: string) {
    this.widgetResolverData = {
      ...this.widgetResolverData,
      widgetData: {
        ...this.widgetResolverData.widgetData,
        url: this.introVideos[value],
      },
    }
    // this.widgetResolverData.widgetData.url = this.introVideos[value]
    // console.log('TYPE: ', this.widgetResolverData)
  }

}
