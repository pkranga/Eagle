/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, OnDestroy } from '@angular/core'
import { Subscription } from 'rxjs'
import { NsContent, IWidgetsPlayerMediaData, NsDiscussionForum, WidgetContentService } from '@ws-widget/collection'
import { NsWidgetResolver } from '@ws-widget/resolver'
import {
  ValueService,
} from '@ws-widget/utils'
import { ActivatedRoute } from '@angular/router'
import { ViewerUtilService } from '../../viewer-util.service'

@Component({
  selector: 'viewer-youtube',
  templateUrl: './youtube.component.html',
  styleUrls: ['./youtube.component.scss'],
})
export class YoutubeComponent implements OnInit, OnDestroy {
  private routeDataSubscription: Subscription | null = null
  private screenSizeSubscription: Subscription | null = null
  private viewerDataSubscription: Subscription | null = null
  private telemetryIntervalSubscription: Subscription | null = null
  isScreenSizeSmall = false
  isFetchingDataComplete = false
  youtubeData: NsContent.IContent | null = null
  // oldData: NsContent.IContent | null = null
  // alreadyRaised = false
  widgetResolverYoutubeData: NsWidgetResolver.IRenderConfigWithTypedData<IWidgetsPlayerMediaData> | null = null
  discussionForumWidget: NsWidgetResolver.IRenderConfigWithTypedData<
    NsDiscussionForum.IDiscussionForumInput
    > | null = null
  isScreenSizeLtMedium = false
  constructor(
    private activatedRoute: ActivatedRoute,
    private valueSvc: ValueService,
    private viewerSvc: ViewerUtilService,
    private contentSvc: WidgetContentService,
    // private eventSvc: EventService,
  ) { }

  ngOnInit() {
    this.screenSizeSubscription = this.valueSvc.isXSmall$.subscribe(
      data => {
        this.isScreenSizeSmall = data
      },
    )
    if (this.activatedRoute.snapshot.queryParamMap.get('preview')) {
      this.viewerDataSubscription = this.viewerSvc.getContent(this.activatedRoute.snapshot.paramMap.get('resourceId') || '').subscribe(
        data => {
          data.artifactUrl = `https://${data.artifactUrl}`
          this.youtubeData = data
          if (this.youtubeData) {
            this.formDiscussionForumWidget(this.youtubeData)
          }
          this.widgetResolverYoutubeData = this.initWidgetResolverYoutubeData()
          this.widgetResolverYoutubeData.widgetData.url = this.youtubeData ? this.youtubeData.artifactUrl : ''
          this.widgetResolverYoutubeData.widgetData.disableTelemetry = true
          this.isFetchingDataComplete = true
        },
      )
    } else {
      this.routeDataSubscription = this.activatedRoute.data.subscribe(
        async data => {
          this.widgetResolverYoutubeData = null
          this.youtubeData = data.content.data
          // if (this.alreadyRaised && this.oldData) {
          //   this.raiseEvent(WsEvents.EnumTelemetrySubType.Unloaded, this.oldData)
          // }
          if (this.youtubeData) {
            this.formDiscussionForumWidget(this.youtubeData)
          }
          this.widgetResolverYoutubeData = this.initWidgetResolverYoutubeData()
          this.widgetResolverYoutubeData.widgetData.url = this.youtubeData ? this.youtubeData.artifactUrl : ''
          this.widgetResolverYoutubeData.widgetData.identifier = this.youtubeData ? this.youtubeData.identifier : ''
          if (this.youtubeData && this.youtubeData.artifactUrl.indexOf('content-store') >= 0) {
            await this.setS3Cookie(this.youtubeData.identifier)
          }
          // if (this.youtubeData) {
          //   this.oldData = this.youtubeData
          //   this.alreadyRaised = true
          //   this.raiseEvent(WsEvents.EnumTelemetrySubType.Loaded, this.youtubeData)
          // }
          this.isFetchingDataComplete = true
        },
        () => {
        },
      )
      // this.telemetryIntervalSubscription = interval(30000).subscribe(() => {
      //   if (this.youtubeData && this.youtubeData.identifier) {
      //     this.raiseEvent(WsEvents.EnumTelemetrySubType.HeartBeat)
      //   }
      // })
    }
  }

  ngOnDestroy() {
    // if (this.youtubeData) {
    //   this.raiseEvent(WsEvents.EnumTelemetrySubType.Unloaded, this.youtubeData)
    // }
    if (this.routeDataSubscription) {
      this.routeDataSubscription.unsubscribe()
    }
    if (this.screenSizeSubscription) {
      this.screenSizeSubscription.unsubscribe()
    }
    if (this.viewerDataSubscription) {
      this.viewerDataSubscription.unsubscribe()
    }
    if (this.telemetryIntervalSubscription) {
      this.telemetryIntervalSubscription.unsubscribe()
    }

  }

  initWidgetResolverYoutubeData() {
    return {
      widgetType: 'player',
      widgetSubType: 'playerYoutube',
      widgetData: {
        disableTelemetry: false,
        url: '',
        identifier: '',
      },
      widgetHostClass: 'video-full',
    }
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
  // raiseEvent(state: WsEvents.EnumTelemetrySubType, data: NsContent.IContent) {

  //   const event = {
  //     eventType: WsEvents.WsEventType.Telemetry,
  //     eventLogLevel: WsEvents.WsEventLogLevel.Info,
  //     from: 'youtube',
  //     to: '',
  //     data: {
  //       state,
  //       type: WsEvents.WsTimeSpentType.Player,
  //       mode: WsEvents.WsTimeSpentMode.Play,
  //       courseId: null,
  //       content: data,
  //       identifier: data ? data.identifier : null,
  //       isCompleted: true,
  //       mimeType: NsContent.EMimeTypes.YOUTUBE,
  //       isIdeal: false,
  //       url: data ? data.artifactUrl : null,
  //     },
  //   }
  //   this.eventSvc.dispatchEvent(event)

  // }

  private async setS3Cookie(contentId: string) {
    await this.contentSvc
      .setS3Cookie(contentId)
      .toPromise()
      .catch(() => {
      })
    return
  }

}
