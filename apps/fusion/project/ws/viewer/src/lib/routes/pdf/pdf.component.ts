/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, OnDestroy } from '@angular/core'
import { Subscription } from 'rxjs'
import { NsContent, NsDiscussionForum, WidgetContentService } from '@ws-widget/collection'
import { WsEvents, EventService } from '@ws-widget/utils'
import { NsWidgetResolver } from '@ws-widget/resolver'
import { ActivatedRoute } from '@angular/router'
import { ViewerUtilService } from '../../viewer-util.service'

@Component({
  selector: 'viewer-pdf',
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.scss'],
})
export class PdfComponent implements OnInit, OnDestroy {
  private dataSubscription: Subscription | null = null
  private viewerDataSubscription: Subscription | null = null
  private telemetryIntervalSubscription: Subscription | null = null
  isFetchingDataComplete = false
  pdfData: NsContent.IContent | null = null
  oldData: NsContent.IContent | null = null
  alreadyRaised = false
  widgetResolverPdfData: any = {
    widgetType: 'player',
    widgetSubType: 'playerPDF',
    widgetData: {
      pdfUrl: '',
      identifier: '',
      disableTelemetry: false,
      hideControls: true,
    },
  }
  isPreviewMode = false
  discussionForumWidget: NsWidgetResolver.IRenderConfigWithTypedData<
    NsDiscussionForum.IDiscussionForumInput
  > | null = null
  constructor(
    private activatedRoute: ActivatedRoute,
    private contentSvc: WidgetContentService,
    private viewerSvc: ViewerUtilService,
    private eventSvc: EventService,
  ) { }

  ngOnInit() {
    if (this.activatedRoute.snapshot.queryParamMap.get('preview')) {
      this.isPreviewMode = true
      this.viewerDataSubscription = this.viewerSvc.getContent(this.activatedRoute.snapshot.paramMap.get('resourceId') || '').subscribe(
        data => {
          this.pdfData = data
          if (this.pdfData) {
            this.formDiscussionForumWidget(this.pdfData)
            if (this.discussionForumWidget) {
              this.discussionForumWidget.widgetData.isDisabled = true
            }
          }
          this.widgetResolverPdfData.widgetData.pdfUrl =
            this.pdfData ? `/apis/authContent/${encodeURIComponent(this.pdfData.artifactUrl)}` : ''
          this.widgetResolverPdfData.widgetData.disableTelemetry = true
          this.isFetchingDataComplete = true
        },
      )
    } else {
      this.dataSubscription = this.activatedRoute.data.subscribe(
        async data => {
          this.pdfData = data.content.data
          if (this.alreadyRaised && this.oldData) {
            this.raiseEvent(WsEvents.EnumTelemetrySubType.Unloaded, this.oldData)
          }
          if (this.pdfData) {
            this.formDiscussionForumWidget(this.pdfData)
          }
          if (this.pdfData && this.pdfData.artifactUrl.indexOf('content-store') >= 0) {
            await this.setS3Cookie(this.pdfData.identifier)
          }
          this.widgetResolverPdfData.widgetData.pdfUrl = this.pdfData ? this.pdfData.artifactUrl : ''
          this.widgetResolverPdfData.widgetData.identifier = this.pdfData && this.pdfData.identifier
          this.widgetResolverPdfData = JSON.parse(JSON.stringify(this.widgetResolverPdfData))
          if (this.pdfData) {
            this.oldData = this.pdfData
            this.alreadyRaised = true
            this.raiseEvent(WsEvents.EnumTelemetrySubType.Loaded, this.pdfData)
          }
          this.isFetchingDataComplete = true
        },
        () => {
        },
      )
      // this.telemetryIntervalSubscription = interval(30000).subscribe(() => {
      //   if (this.pdfData && this.pdfData.identifier) {
      //     this.raiseEvent(WsEvents.EnumTelemetrySubType.HeartBeat)
      //   }
      // })
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
        isDisabled: false,
      },
      widgetSubType: 'discussionForum',
      widgetType: 'discussionForum',
    }
  }

  raiseEvent(state: WsEvents.EnumTelemetrySubType, data: NsContent.IContent) {
    if (this.isPreviewMode) {
      return
    }

    const event = {
      eventType: WsEvents.WsEventType.Telemetry,
      eventLogLevel: WsEvents.WsEventLogLevel.Info,
      from: 'pdf',
      to: '',
      data: {
        state,
        type: WsEvents.WsTimeSpentType.Player,
        mode: WsEvents.WsTimeSpentMode.Play,
        courseId: null,
        content: data,
        identifier: data ? data.identifier : null,
        isCompleted: true,
        mimeType: NsContent.EMimeTypes.PDF,
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

  ngOnDestroy() {
    if (this.pdfData) {
      this.raiseEvent(WsEvents.EnumTelemetrySubType.Unloaded, this.pdfData)
    }
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe()
    }
    if (this.viewerDataSubscription) {
      this.viewerDataSubscription.unsubscribe()
    }
    if (this.telemetryIntervalSubscription) {
      this.telemetryIntervalSubscription.unsubscribe()
    }
  }
}
