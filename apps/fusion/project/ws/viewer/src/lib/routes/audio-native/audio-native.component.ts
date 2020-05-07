/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, OnDestroy } from '@angular/core'
import { Subscription } from 'rxjs'
import { ValueService, ConfigurationsService } from '@ws-widget/utils'
import { ActivatedRoute } from '@angular/router'
import { NsContent, NsDiscussionForum, WidgetContentService } from '@ws-widget/collection'
import { ViewerUtilService } from '../../viewer-util.service'
import { NsWidgetResolver } from '@ws-widget/resolver'

@Component({
  selector: 'viewer-audio-native',
  templateUrl: './audio-native.component.html',
  styleUrls: ['./audio-native.component.scss'],
})
export class AudioNativeComponent implements OnInit, OnDestroy {
  private routeDataSubscription: Subscription | null = null
  private screenSizeSubscription: Subscription | null = null
  private viewerDataSubscription: Subscription | null = null
  isScreenSizeSmall = false
  isFetchingDataComplete = false
  audioData: NsContent.IContent | null = null
  discussionForumWidget: NsWidgetResolver.IRenderConfigWithTypedData<
    NsDiscussionForum.IDiscussionForumInput
  > | null = null
  defaultThumbnail = ''
  isPreviewMode = false

  constructor(
    private activatedRoute: ActivatedRoute,
    private contentSvc: WidgetContentService,
    private valueSvc: ValueService,
    private viewerSvc: ViewerUtilService,
    private configSvc: ConfigurationsService,
  ) { }

  ngOnInit() {
    if (this.configSvc.instanceConfig) {
      this.defaultThumbnail = this.configSvc.instanceConfig.logos.defaultContent
    }
    this.screenSizeSubscription = this.valueSvc.isXSmall$.subscribe(
      data => {
        this.isScreenSizeSmall = data
      },
    )
    if (this.activatedRoute.snapshot.queryParamMap.get('preview')) {
      // to do make sure the data updates for two consecutive resource of same mimeType
      this.viewerDataSubscription = this.viewerSvc.getContent(this.activatedRoute.snapshot.paramMap.get('resourceId') || '').subscribe(
        data => {
          data.artifactUrl = `https://${data.artifactUrl}`
          this.audioData = data
          if (this.audioData) {
            this.formDiscussionForumWidget(this.audioData)
          }
          this.isFetchingDataComplete = true
        },
      )
      // this.htmlData = this.viewerDataSvc.resource
    } else {
      this.routeDataSubscription = this.activatedRoute.data.subscribe(
        async data => {
          this.audioData = data.content.data
          if (this.audioData) {
            this.formDiscussionForumWidget(this.audioData)
            if (this.audioData.appIcon) {
              this.defaultThumbnail = this.audioData.appIcon
            } else {
              if (this.configSvc.instanceConfig) {
                this.defaultThumbnail = this.configSvc.instanceConfig.logos.defaultContent
              }
            }

          }
          if (this.audioData && this.audioData.artifactUrl.indexOf('content-store') >= 0) {
            await this.setS3Cookie(this.audioData.identifier)
          }
          this.saveContinueLearning(this.audioData)
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

  saveContinueLearning(content: NsContent.IContent | null) {
    this.contentSvc.saveContinueLearning(
      {
        contextPathId: content ? content.identifier : '',
        resourceId: content ? content.identifier : '',
        data: JSON.stringify({ timestamp: Date.now() }),
        dateAccessed: Date.now(),
      },
    )
      .toPromise()
      .catch()
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
