/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, OnDestroy } from '@angular/core'
import { Subscription } from 'rxjs'
import { ValueService } from '@ws-widget/utils'
import { ActivatedRoute } from '@angular/router'
import { NsContent, IWidgetsPlayerMediaData, NsDiscussionForum, WidgetContentService } from '@ws-widget/collection'
import { ViewerUtilService } from '../../viewer-util.service'
import { NsWidgetResolver } from '@ws-widget/resolver'

@Component({
  selector: 'viewer-audio',
  templateUrl: './audio.component.html',
  styleUrls: ['./audio.component.scss'],
})
export class AudioComponent implements OnInit, OnDestroy {
  private routeDataSubscription: Subscription | null = null
  private screenSizeSubscription: Subscription | null = null
  private viewerDataSubscription: Subscription | null = null
  isScreenSizeSmall = false
  isNotEmbed = true
  isFetchingDataComplete = false
  audioData: NsContent.IContent | null = null
  widgetResolverAudioData: NsWidgetResolver.IRenderConfigWithTypedData<IWidgetsPlayerMediaData> | null = null
  discussionForumWidget: NsWidgetResolver.IRenderConfigWithTypedData<
    NsDiscussionForum.IDiscussionForumInput
  > | null = null
  constructor(
    private activatedRoute: ActivatedRoute,
    private contentSvc: WidgetContentService,
    private valueSvc: ValueService,
    private viewerSvc: ViewerUtilService,
  ) { }

  ngOnInit() {
    this.screenSizeSubscription = this.valueSvc.isXSmall$.subscribe(
      data => {
        this.isScreenSizeSmall = data
      },
    )
    this.isNotEmbed = this.activatedRoute.snapshot.queryParamMap.get('embed') === 'true' ? false : true
    if (this.activatedRoute.snapshot.queryParamMap.get('preview')) {
      // to do make sure the data updates for two consecutive resource of same mimeType
      this.viewerDataSubscription = this.viewerSvc.getContent(this.activatedRoute.snapshot.paramMap.get('resourceId') || '').subscribe(
        data => {
          this.audioData = data
          if (this.audioData) {
            this.formDiscussionForumWidget(this.audioData)
          }
          this.widgetResolverAudioData = this.initWidgetResolverAudioData()
          this.widgetResolverAudioData.widgetData.url =
            this.audioData ? `/apis/authContent/${encodeURIComponent(this.audioData.artifactUrl)}` : ''
          this.widgetResolverAudioData.widgetData.disableTelemetry = true
          this.isFetchingDataComplete = true
        },
      )
      // this.htmlData = this.viewerDataSvc.resource
    } else {
      this.routeDataSubscription = this.activatedRoute.data.subscribe(
        async data => {
          this.widgetResolverAudioData = null
          this.audioData = data.content.data
          if (this.audioData) {
            this.formDiscussionForumWidget(this.audioData)
          }
          if (this.audioData && this.audioData.artifactUrl.indexOf('content-store') >= 0) {
            await this.setS3Cookie(this.audioData.identifier)
          }
          this.widgetResolverAudioData = this.initWidgetResolverAudioData()
          this.widgetResolverAudioData.widgetData.url = this.audioData ? this.audioData.artifactUrl : ''
          this.widgetResolverAudioData.widgetData.identifier = this.audioData ? this.audioData.identifier : ''

          this.isFetchingDataComplete = true
        },
        () => {
        },
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

  initWidgetResolverAudioData() {
    return {
      widgetType: 'player',
      widgetSubType: 'playerAudio',
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
      .catch(() => {
        // throw new DataResponseError('COOKIE_SET_FAILURE')
      })
    return
  }

}
