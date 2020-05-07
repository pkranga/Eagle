/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, Input } from '@angular/core'
import { NsWidgetResolver, WidgetBaseComponent } from '@ws-widget/resolver'
import { NsContent } from '../_services/widget-content.model'
import { MobileAppsService } from '../../../../../../src/app/services/mobile-apps.service'
import { ConfigurationsService, EventService } from '@ws-widget/utils'
import { Platform } from '@angular/cdk/platform'

export interface IWidgetBtnDownload {
  identifier: string
  contentType: NsContent.EContentTypes
  resourceType: string
  mimeType: NsContent.EMimeTypes
  downloadUrl: string
  isExternal: boolean
}

@Component({
  selector: 'ws-widget-btn-content-download',
  templateUrl: './btn-content-download.component.html',
  styleUrls: ['./btn-content-download.component.scss'],
})
export class BtnContentDownloadComponent extends WidgetBaseComponent
  implements OnInit, NsWidgetResolver.IWidgetData<IWidgetBtnDownload> {
  @Input() widgetData!: IWidgetBtnDownload

  downloadable = false

  constructor(
    private platform: Platform,
    private events: EventService,
    private mobAppSvc: MobileAppsService,
    private configSvc: ConfigurationsService,
  ) {
    super()
  }

  ngOnInit() {
    if (this.configSvc.instanceConfig && this.configSvc.instanceConfig.isContentDownloadAvailable) {
      this.downloadable = this.mobAppSvc.isMobile && this.isContentDownloadable
    }
  }

  private get isContentDownloadable(): boolean {
    if (this.widgetData.identifier) {
      if (
        this.widgetData.contentType === NsContent.EContentTypes.PROGRAM ||
        this.widgetData.resourceType === 'Assessment' ||
        (this.widgetData.mimeType !== NsContent.EMimeTypes.COLLECTION &&
          !this.widgetData.downloadUrl) ||
        this.widgetData.isExternal
      ) {
        return false
      }
      switch (this.widgetData.mimeType) {
        case NsContent.EMimeTypes.MP3:
        case NsContent.EMimeTypes.MP4:
        case NsContent.EMimeTypes.M3U8:
        case NsContent.EMimeTypes.QUIZ:
        case NsContent.EMimeTypes.PDF:
        case NsContent.EMimeTypes.WEB_MODULE:
        case NsContent.EMimeTypes.COLLECTION:
          return true
        default:
          return false
      }
    }
    return false
  }

  download(event: Event) {
    event.stopPropagation()
    this.raiseTelemetry()
    this.mobAppSvc.downloadResource(this.widgetData.identifier)
  }

  raiseTelemetry() {
    this.events.raiseInteractTelemetry(
      'download',
      'content',
      {
        platform: this.platform,
        contentId: this.widgetData.identifier,
        contentType: this.widgetData.contentType,
      },
    )
  }
}
