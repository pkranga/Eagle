/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, OnDestroy } from '@angular/core'
import { Subscription } from 'rxjs'
import {
  NsContent,
  IWidgetsPlayerMediaData,
  NsDiscussionForum,
  WidgetContentService,
} from '@ws-widget/collection'
import { NsWidgetResolver } from '@ws-widget/resolver'
import { ValueService } from '@ws-widget/utils'
import { ActivatedRoute } from '@angular/router'
import { ViewerUtilService } from '../../viewer-util.service'
import { Platform } from '@angular/cdk/platform'

@Component({
  selector: 'viewer-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
})
export class VideoComponent implements OnInit, OnDestroy {
  private routeDataSubscription: Subscription | null = null
  private screenSizeSubscription: Subscription | null = null
  private viewerDataSubscription: Subscription | null = null
  isScreenSizeSmall = false
  videoData: NsContent.IContent | null = null
  isFetchingDataComplete = false
  isNotEmbed = true
  widgetResolverVideoData: NsWidgetResolver.IRenderConfigWithTypedData<
    IWidgetsPlayerMediaData
  > | null = null
  discussionForumWidget: NsWidgetResolver.IRenderConfigWithTypedData<
    NsDiscussionForum.IDiscussionForumInput
  > | null = null
  constructor(
    private activatedRoute: ActivatedRoute,
    private valueSvc: ValueService,
    private viewerSvc: ViewerUtilService,
    private contentSvc: WidgetContentService,
    private platform: Platform,
  ) { }

  ngOnInit() {
    this.screenSizeSubscription = this.valueSvc.isXSmall$.subscribe(data => {
      this.isScreenSizeSmall = data
    })
    this.isNotEmbed = this.activatedRoute.snapshot.queryParamMap.get('embed') === 'true' ? false : true
    if (this.activatedRoute.snapshot.queryParamMap.get('preview')) {
      this.viewerDataSubscription = this.viewerSvc
        .getContent(this.activatedRoute.snapshot.paramMap.get('resourceId') || '')
        .subscribe(data => {
          this.videoData = data
          if (this.videoData) {
            this.formDiscussionForumWidget(this.videoData)
          }
          this.widgetResolverVideoData = this.initWidgetResolverVideoData()
          let url = ''
          if (this.videoData.artifactUrl.indexOf('/content-store/') > -1) {
            url = `/apis/authContent/${new URL(this.videoData.artifactUrl).pathname}`
          } else {
            url = `/apis/authContent/${encodeURIComponent(this.videoData.artifactUrl)}`
          }
          this.widgetResolverVideoData.widgetData.url = this.videoData ? url : ''
          this.widgetResolverVideoData.widgetData.disableTelemetry = true
          this.isFetchingDataComplete = true
        })
    } else {
      this.routeDataSubscription = this.activatedRoute.data.subscribe(
        async data => {
          this.widgetResolverVideoData = null
          this.videoData = data.content.data
          if (this.videoData) {
            this.formDiscussionForumWidget(this.videoData)
          }
          this.widgetResolverVideoData = this.initWidgetResolverVideoData()
          this.widgetResolverVideoData.widgetData.url = this.videoData
            ? this.videoData.artifactUrl
            : ''
          this.widgetResolverVideoData.widgetData.identifier = this.videoData ? this.videoData.identifier : ''
          this.widgetResolverVideoData.widgetData.mimeType = data.content.data.mimeType
          if (this.platform.IOS) {
            this.widgetResolverVideoData.widgetData.isVideojs = true
          } else if ((!this.platform.WEBKIT) && (!this.platform.IOS) && (!this.platform.SAFARI)) {
            this.widgetResolverVideoData.widgetData.isVideojs = true
          } else if (this.platform.ANDROID) {
            this.widgetResolverVideoData.widgetData.isVideojs = true
          } else {
            this.widgetResolverVideoData.widgetData.isVideojs = false
          }
          if (this.videoData && this.videoData.artifactUrl.indexOf('content-store') >= 0) {
            await this.setS3Cookie(this.videoData.identifier)
          }
          this.isFetchingDataComplete = true
        },
        () => { },
      )
    }
  }

  ngOnDestroy() {
    if (this.routeDataSubscription) {
      this.routeDataSubscription.unsubscribe()
    }
    if (this.screenSizeSubscription) {
      this.screenSizeSubscription.unsubscribe()
    }
    if (this.viewerDataSubscription) {
      this.viewerDataSubscription.unsubscribe()
    }

  }

  initWidgetResolverVideoData() {
    return {
      widgetType: 'player',
      widgetSubType: 'playerVideo',
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

  private async setS3Cookie(contentId: string) {
    await this.contentSvc
      .setS3Cookie(contentId)
      .toPromise()
      .catch(() => { })
    return
  }
}
