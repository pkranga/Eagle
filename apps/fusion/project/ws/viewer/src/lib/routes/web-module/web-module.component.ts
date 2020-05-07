/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, OnDestroy } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Subscription } from 'rxjs'
import { NsContent, NsDiscussionForum, WidgetContentService } from '@ws-widget/collection'
import { NsWidgetResolver } from '@ws-widget/resolver'
import { ActivatedRoute } from '@angular/router'
import { EventService, WsEvents } from '@ws-widget/utils'

@Component({
  selector: 'viewer-web-module',
  templateUrl: './web-module.component.html',
  styleUrls: ['./web-module.component.scss'],
})
export class WebModuleComponent implements OnInit, OnDestroy {
  private dataSubscription: Subscription | null = null
  private telemetryIntervalSubscription: Subscription | null = null
  isFetchingDataComplete = false
  isErrorOccured = false
  webmoduleData: NsContent.IContent | null = null
  oldData: NsContent.IContent | null = null
  alreadyRaised = false
  webmoduleManifest: any
  discussionForumWidget: NsWidgetResolver.IRenderConfigWithTypedData<
    NsDiscussionForum.IDiscussionForumInput
  > | null = null
  constructor(
    private activatedRoute: ActivatedRoute,
    private contentSvc: WidgetContentService,
    private http: HttpClient,
    private eventSvc: EventService,
  ) { }

  ngOnInit() {
    this.dataSubscription = this.activatedRoute.data.subscribe(
      async data => {
        this.webmoduleData = data.content.data
        if (this.alreadyRaised && this.oldData) {
          this.raiseEvent(WsEvents.EnumTelemetrySubType.Unloaded, this.oldData)
        }
        if (this.webmoduleData) {
          this.formDiscussionForumWidget(this.webmoduleData)
        }
        if (this.webmoduleData && this.webmoduleData.artifactUrl.indexOf('content-store') >= 0) {
          await this.setS3Cookie(this.webmoduleData.identifier)
        }
        if (
          this.webmoduleData &&
          (this.webmoduleData.mimeType === NsContent.EMimeTypes.WEB_MODULE ||
            this.webmoduleData.mimeType === NsContent.EMimeTypes.WEB_MODULE_EXERCISE)
        ) {
          this.webmoduleManifest = await this.transformWebmodule(this.webmoduleData)
        }
        if (this.webmoduleData && this.webmoduleManifest) {
          this.oldData = this.webmoduleData
          this.alreadyRaised = true
          this.raiseEvent(WsEvents.EnumTelemetrySubType.Loaded, this.webmoduleData)
          this.isFetchingDataComplete = true
        } else {
          this.isErrorOccured = true
        }
      },
      () => { },
    )
    // this.telemetryIntervalSubscription = interval(30000).subscribe(() => {
    //   if (this.webmoduleData && this.webmoduleData.identifier) {
    //     this.raiseEvent(WsEvents.EnumTelemetrySubType.HeartBeat)
    //   }
    // })
  }

  ngOnDestroy() {
    if (this.webmoduleData) {
      this.raiseEvent(WsEvents.EnumTelemetrySubType.Unloaded, this.webmoduleData)
    }
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe()
    }
    if (this.telemetryIntervalSubscription) {
      this.telemetryIntervalSubscription.unsubscribe()
    }
  }

  private async transformWebmodule(_content: NsContent.IContent) {
    let manifestFile = ''
    if (this.webmoduleData && this.webmoduleData.artifactUrl) {
      manifestFile = await this.http
        .get<any>(this.webmoduleData ? this.webmoduleData.artifactUrl : '')
        .toPromise()
        .catch((_err: any) => { })
    }
    return manifestFile
  }

  formDiscussionForumWidget(content: NsContent.IContent) {
    this.discussionForumWidget = {
      widgetData: {
        description: content.description,
        id: content.identifier,
        name: NsDiscussionForum.EDiscussionType.LEARNING,
        title: content.name,
        initialPostCount: 2,
      },
      widgetSubType: 'discussionForum',
      widgetType: 'discussionForum',
    }
  }
  raiseEvent(state: WsEvents.EnumTelemetrySubType, data: NsContent.IContent) {
    const event = {
      eventType: WsEvents.WsEventType.Telemetry,
      eventLogLevel: WsEvents.WsEventLogLevel.Info,
      from: 'web-module',
      to: '',
      data: {
        state,
        type: WsEvents.WsTimeSpentType.Player,
        mode: WsEvents.WsTimeSpentMode.Play,
        courseId: null,
        content: data,
        identifier: data ? data.identifier : null,
        isCompleted: true,
        mimeType: NsContent.EMimeTypes.WEB_MODULE,
        isIdeal: false,
        url: data ? data.artifactUrl : null,
      },
    }
    this.eventSvc.dispatchEvent(event)
  }

  private async setS3Cookie(contentId: string) {
    await this.contentSvc
      .setS3Cookie(contentId)
      .toPromise()
      .catch(() => {
        // throw new DataResponseError('COOKIE_SET_FAILURE')
      })
    return
  }
}
