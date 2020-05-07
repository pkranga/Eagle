/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, OnDestroy } from '@angular/core'
import { Subscription, fromEvent } from 'rxjs'
import { filter } from 'rxjs/operators'
import { NsContent, NsDiscussionForum, WidgetContentService } from '@ws-widget/collection'
import { NsWidgetResolver } from '@ws-widget/resolver'
import { ActivatedRoute } from '@angular/router'
import { WsEvents, EventService } from '@ws-widget/utils'
import { IframeRespondService } from '../../iframe-respond.service'
@Component({
  selector: 'viewer-iap',
  templateUrl: './iap.component.html',
  styleUrls: ['./iap.component.scss'],
})
export class IapComponent implements OnInit, OnDestroy {
  private routeDataSubscription: Subscription | null = null
  // private telemetryIntervalSubscription: Subscription | null = null
  private iframeSubscription: Subscription | null = null
  isFetchingDataComplete = false
  iapData: NsContent.IContent | null = null
  discussionForumWidget: NsWidgetResolver.IRenderConfigWithTypedData<
    NsDiscussionForum.IDiscussionForumInput
  > | null = null
  constructor(
    private activatedRoute: ActivatedRoute,
    private contentSvc: WidgetContentService,
    private eventSvc: EventService,
    private respondSvc: IframeRespondService,
  ) { }
  ngOnInit() {
    this.routeDataSubscription = this.activatedRoute.data.subscribe(
      async data => {
        this.iapData = data.content.data
        if (this.iapData) {
          this.formDiscussionForumWidget(this.iapData)
        }
        if (this.iapData && this.iapData.artifactUrl.indexOf('content-store') >= 0) {
          await this.setS3Cookie(this.iapData.identifier)
        }
        this.raiseEvent(WsEvents.EnumTelemetrySubType.Loaded)
        if (this.iapData && this.iapData.identifier) {
          this.iframeSubscription = fromEvent<MessageEvent>(window, 'message')
            .pipe(
              filter(
                (event: MessageEvent) =>
                  Boolean(event) &&
                  Boolean(event.data) &&
                  event.data.subApplicationName === 'IAP' &&
                  Boolean(event.source && typeof event.source.postMessage === 'function'),
              ),
            )
            .subscribe(async (event: MessageEvent) => {
              const contentWindow = event.source as Window
              if (event.data.requestId && event.data.subApplicationName === 'IAP' && this.iapData) {
                switch (event.data.requestId) {
                  case 'LOADED':
                    this.respondSvc.loadedRespond(this.iapData.identifier, contentWindow, event.data.subApplicationName)
                    break
                  default:
                    break
                }
              }
            })
        }
        this.isFetchingDataComplete = true
      },
      () => {
      },
    )
    // this.telemetryIntervalSubscription = interval(30000).subscribe(() => {
    //   if (this.iapData && this.iapData.identifier) {
    //     this.raiseEvent(WsEvents.EnumTelemetrySubType.HeartBeat)
    //   }
    // })
  }

  ngOnDestroy() {
    if (this.routeDataSubscription) {
      this.routeDataSubscription.unsubscribe()
    }
    if (this.iframeSubscription) {
      this.iframeSubscription.unsubscribe()
    }
    // if (this.telemetryIntervalSubscription) {
    //   this.telemetryIntervalSubscription.unsubscribe()
    // }
    this.raiseEvent(WsEvents.EnumTelemetrySubType.Unloaded)
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
  raiseEvent(state: WsEvents.EnumTelemetrySubType) {
    const event = {
      eventType: WsEvents.WsEventType.Telemetry,
      eventLogLevel: WsEvents.WsEventLogLevel.Info,
      from: 'iap',
      to: '',
      data: {
        state,
        type: WsEvents.WsTimeSpentType.Player,
        mode: WsEvents.WsTimeSpentMode.Play,
        courseId: null,
        content: this.iapData,
        identifier: this.iapData ? this.iapData.identifier : null,
        isCompleted: true,
        mimeType: NsContent.EMimeTypes.IAP,
        isIdeal: false,
        url: this.iapData ? this.iapData.artifactUrl : null,
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
