/*               "Copyright 2020 Infosys Ltd.
http://http-url
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, OnDestroy } from '@angular/core'
import { Subscription, fromEvent } from 'rxjs'
import { filter } from 'rxjs/operators'
import { NsContent, NsDiscussionForum, WidgetContentService } from '@ws-widget/collection'
import { NsWidgetResolver } from '@ws-widget/resolver'
import { ActivatedRoute } from '@angular/router'
// import { ViewerDataService } from '../../viewer-data.service'
import { ViewerUtilService } from '../../viewer-util.service'
import {
  EventService,
  WsEvents,
  ConfigurationsService,
  // TelemetryService,
} from '@ws-widget/utils'
import { AccessControlService } from '@ws/author'
import { ViewerDataService } from '../../viewer-data.service'
import { IframeRespondService } from '../../iframe-respond.service'

@Component({
  selector: 'viewer-html',
  templateUrl: './html.component.html',
  styleUrls: ['./html.component.scss'],
})
export class HtmlComponent implements OnInit, OnDestroy {
  private routeDataSubscription: Subscription | null = null
  private iframeSubscription: Subscription | null = null
  private viewerDataSubscription: Subscription | null = null
  isNotEmbed = true
  isFetchingDataComplete = false
  htmlData: NsContent.IContent | null = null
  oldData: NsContent.IContent | null = null
  alreadyRaised = false
  discussionForumWidget: NsWidgetResolver.IRenderConfigWithTypedData<
    NsDiscussionForum.IDiscussionForumInput
  > | null = null
  uuid: string | null | undefined = null
  realTimeProgressRequest = {
    content_type: 'Resource',
    current: ['0'],
    max_size: 0,
    mime_type: NsContent.EMimeTypes.HTML,
    user_id_type: 'uuid',
  }
  realTimeProgressTimer: any
  hasFiredRealTimeProgress = false
  isPreviewMode = false
  constructor(
    private activatedRoute: ActivatedRoute,
    private contentSvc: WidgetContentService,
    private viewerSvc: ViewerUtilService,
    private respondSvc: IframeRespondService,
    // private viewerDataSvc: ViewerDataService,
    // private telemetrySvc: TelemetryService,
    private configSvc: ConfigurationsService,
    private accessControlSvc: AccessControlService,
    private eventSvc: EventService,
    private viewerDataSvc: ViewerDataService,
  ) { }

  ngOnInit() {
    this.uuid = this.configSvc.userProfile ? this.configSvc.userProfile.userId : ''
    this.isNotEmbed = this.activatedRoute.snapshot.queryParamMap.get('embed') === 'true' ? false : true
    if (this.activatedRoute.snapshot.queryParamMap.get('preview') === 'true') {
      this.isPreviewMode = true
      // to do make sure the data updates for two consecutive resource of same mimeType
      this.viewerDataSubscription = this.viewerSvc.getContent(this.activatedRoute.snapshot.paramMap.get('resourceId') || '').subscribe(
        data => {
          data.artifactUrl =
http://http-url
http://http-url
http://http-url
          // data.artifactUrl = data.artifactUrl.startsWith('/scorm-player') ? `/apis/proxies/v8${data.artifactUrl}` : data.artifactUrl
          if (this.accessControlSvc.hasAccess(data as any, true)) {
            this.htmlData = data
          } else {
            this.viewerDataSvc.updateResource(null, {
              errorType: 'previewUnAuthorised',
            })
          }
          if (this.htmlData) {
            this.formDiscussionForumWidget(this.htmlData)
            if (this.discussionForumWidget) {
              this.discussionForumWidget.widgetData.isDisabled = true
            }
          }
        },
      )
      // this.htmlData = this.viewerDataSvc.resource
    } else {
      this.routeDataSubscription = this.activatedRoute.data.subscribe(
        async data => {
          // data.content.data.artifactUrl =
          //   data.content.data.artifactUrl.startsWith('/scorm-player') ?
          //     `/apis/proxies/v8${data.content.data.artifactUrl}` : data.content.data.artifactUrl
          data.content.data.artifactUrl =
            data.content.data.artifactUrl.indexOf('ScormCoursePlayer') > -1 ?
              `${data.content.data.artifactUrl}&Param1=${this.uuid}` : data.content.data.artifactUrl
          const tempHtmlData = data.content.data
          if (this.alreadyRaised && this.oldData) {
            this.raiseEvent(WsEvents.EnumTelemetrySubType.Unloaded, this.oldData)
          }
          if (tempHtmlData) {
            this.formDiscussionForumWidget(tempHtmlData)
          }
          if (tempHtmlData && tempHtmlData.artifactUrl.indexOf('content-store') >= 0) {
            await this.setS3Cookie(tempHtmlData.identifier)
            this.htmlData = tempHtmlData
          } else {
            this.htmlData = tempHtmlData
          }
          this.saveContinueLearning(this.htmlData)
          if ((this.htmlData || {} as any).isIframeSupported.toLowerCase() === 'yes') {
            this.raiseRealTimeProgress()
          }
          if (this.htmlData) {
            this.oldData = this.htmlData
            this.alreadyRaised = true
            this.raiseEvent(WsEvents.EnumTelemetrySubType.Loaded, this.htmlData)
            this.iframeSubscription = fromEvent<MessageEvent>(window, 'message')
              .pipe(
                filter(
                  (event: MessageEvent) =>
                    Boolean(event) &&
                    Boolean(event.data) &&
                    event.data.subApplicationName === 'RBCP' &&
                    Boolean(event.source && typeof event.source.postMessage === 'function'),
                ),
              )
              .subscribe(async (event: MessageEvent) => {
                const contentWindow = event.source as Window
                if (event.data.requestId && event.data.subApplicationName === 'RBCP' && this.htmlData) {
                  switch (event.data.requestId) {
                    case 'LOADED':
                      this.respondSvc.loadedRespond(this.htmlData.identifier, contentWindow, event.data.subApplicationName)
                      break
                    case 'CONTINUE_LEARNING':
                      this.respondSvc.continueLearningRespond(this.htmlData.identifier, event.data.data.continueLearning)
                      break
                    case 'TELEMETRY':
                      this.respondSvc.telemetryEvents(event.data)
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
      // this.telemetryIntervalSubscription = interval(5000).subscribe(() => {
      //   if (this.htmlData && this.htmlData.identifier) {
      //     this.raiseHeartbeatEvent(this.htmlData)
      //   }
      // })
    }
  }

  saveContinueLearning(content: NsContent.IContent | null) {
    this.contentSvc.saveContinueLearning(
      {
        contextPathId: this.activatedRoute.snapshot.queryParams.collectionId ?
          this.activatedRoute.snapshot.queryParams.collectionId : content ? content.identifier : '',
        resourceId: content ? content.identifier : '',
        data: JSON.stringify({ timestamp: Date.now() }),
        dateAccessed: Date.now(),
      },
    )
      .toPromise()
      .catch()
  }

  ngOnDestroy() {
    if (this.htmlData) {
      this.raiseEvent(WsEvents.EnumTelemetrySubType.Unloaded, this.htmlData)
    }
    if (this.routeDataSubscription) {
      this.routeDataSubscription.unsubscribe()
    }
    if (this.iframeSubscription) {
      this.iframeSubscription.unsubscribe()
    }
    // if (this.telemetryIntervalSubscription) {
    //   this.telemetryIntervalSubscription.unsubscribe()
    // }
    if (this.viewerDataSubscription) {
      this.viewerDataSubscription.unsubscribe()
    }
    if (!this.hasFiredRealTimeProgress) {
      this.fireRealTimeProgress()
      if (this.realTimeProgressTimer) {
        clearTimeout(this.realTimeProgressTimer)
      }
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

  private async setS3Cookie(contentId: string) {
    await this.contentSvc
      .setS3Cookie(contentId)
      .toPromise()
      .catch(() => {
        // throw new DataResponseError('COOKIE_SET_FAILURE')
      })
    return
  }

  raiseEvent(state: WsEvents.EnumTelemetrySubType, data: NsContent.IContent) {
    if (this.isPreviewMode) {
      return
    }
    const event = {
      eventType: WsEvents.WsEventType.Telemetry,
      eventLogLevel: WsEvents.WsEventLogLevel.Info,
      from: 'html',
      to: '',
      data: {
        state,
        type: WsEvents.WsTimeSpentType.Player,
        mode: WsEvents.WsTimeSpentMode.Play,
        courseId: null,
        content: data,
        identifier: data ? data.identifier : null,
        isCompleted: true,
        mimeType: NsContent.EMimeTypes.HTML,
        isIdeal: false,
        url: data ? data.artifactUrl : null,
      },
    }
    this.eventSvc.dispatchEvent(event)

  }

  private raiseRealTimeProgress() {
    this.realTimeProgressRequest = {
      ...this.realTimeProgressRequest,
      current: ['1'],
      max_size: 1,
    }
    if (this.realTimeProgressTimer) {
      clearTimeout(this.realTimeProgressTimer)
    }
    this.hasFiredRealTimeProgress = false
    this.realTimeProgressTimer = setTimeout(
      () => {
        this.hasFiredRealTimeProgress = true
        this.fireRealTimeProgress()
      },
      2 * 60 * 1000,
    )
  }
  private fireRealTimeProgress() {
    if (this.isPreviewMode) {
      return
    }
    if (this.htmlData) {
      if ((this.htmlData.contentType === NsContent.EContentTypes.COURSE && this.htmlData.isExternal)) {
        return
      }
    }
    if ((this.htmlData || {} as any).isIframeSupported.toLowerCase() !== 'yes') {
      return
    }
    if (this.htmlData) {
      if (this.htmlData.sourceName === 'Cross Knowledge') {
        return
      }
    }
    this.realTimeProgressRequest.content_type = this.htmlData ? this.htmlData.contentType : ''
    this.viewerSvc
      .realTimeProgressUpdate(this.htmlData ? this.htmlData.identifier : '', this.realTimeProgressRequest)
    return
  }

}
