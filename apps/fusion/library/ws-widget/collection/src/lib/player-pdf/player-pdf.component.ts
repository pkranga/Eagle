/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NsWidgetResolver, WidgetBaseComponent } from '@ws-widget/resolver'
import {
  Component,
  OnInit,
  Input,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  OnChanges,
} from '@angular/core'

import { WsEvents, EventService, LoggerService } from '@ws-widget/utils'
import { IWidgetsPlayerPdfData } from './player-pdf.model'
import { FormControl } from '@angular/forms'
import * as PDFJS from 'pdfjs-dist/webpack'
const pdfjsViewer = require('pdfjs-dist/web/pdf_viewer')
import { Subject, Subscription, merge, interval, fromEvent } from 'rxjs'
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'
import { ROOT_WIDGET_CONFIG } from '../collection.config'
import { ActivatedRoute, Router } from '@angular/router'
import { ViewerUtilService } from '../../../../../../project/ws/viewer/src/lib/viewer-util.service'
import { WidgetContentService } from '../_services/widget-content.service'
import { NsContent } from '../_services/widget-content.model'
@Component({
  selector: 'ws-widget-player-pdf',
  templateUrl: './player-pdf.component.html',
  styleUrls: ['./player-pdf.component.scss'],
})
export class PlayerPdfComponent extends WidgetBaseComponent
  implements OnInit, AfterViewInit, OnDestroy, OnChanges, NsWidgetResolver.IWidgetData<any> {
  @Input() widgetData!: IWidgetsPlayerPdfData
  @ViewChild('fullScreenContainer', { static: true })
  containerSection!: ElementRef<HTMLElement>

  @ViewChild('pdfContainer', { static: true })
  pdfContainer!: ElementRef<HTMLCanvasElement>
  DEFAULT_SCALE = 1.0
  CSS_UNITS = 96 / 72
  totalPages = 0
  currentPage = new FormControl(0)
  zoom = new FormControl(1)
  isSmallViewPort = false
  realTimeProgressRequest = {
    content_type: 'Resource',
    current: ['0'],
    max_size: 0,
    mime_type: NsContent.EMimeTypes.PDF,
    user_id_type: 'uuid',
  }
  current: string[] = ['1']
  oldData: any = null
  enableTelemetry = false
  private pdfInstance: PDFJS.PDFDocumentProxy | null = null
  private activityStartedAt: Date | null = null
  private renderSubject = new Subject()
  private lastRenderTask: any | null = null
  // Subscriptions
  private contextMenuSubs: Subscription | null = null
  private renderSubscriptions: Subscription | null = null
  private runnerSubs: Subscription | null = null
  private routerSubs: Subscription | null = null
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private eventSvc: EventService,
    private logger: LoggerService,
    private contentSvc: WidgetContentService,
    private viewerSvc: ViewerUtilService,
  ) {
    super()
  }

  ngOnInit() {
    this.zoom.disable()
    this.currentPage.disable()
    // console.log('aspdjasiodjaoisdjaosdjiasodjo', this.widgetData)
    this.widgetData.disableTelemetry = false
    if (this.widgetData.readValuesQueryParamsKey) {
      const keys = this.widgetData.readValuesQueryParamsKey
      this.activatedRoute.queryParamMap.pipe(distinctUntilChanged()).subscribe(params => {
        const pageNumber = Number(params.get(keys.pageNumber))
        const zoom = Number(params.get(keys.zoom))
        if (pageNumber > 0 && pageNumber <= this.totalPages) {
          this.current.push(pageNumber.toString())
          this.currentPage.setValue(pageNumber)
        }
        if (zoom > 0) {
          this.zoom.setValue(zoom)
        }
      })
    }

    this.renderSubscriptions = merge(
      this.zoom.valueChanges.pipe(distinctUntilChanged()),
      this.currentPage.valueChanges.pipe(distinctUntilChanged()),
      this.renderSubject.asObservable(),
    )
      .pipe(debounceTime(250))
      .subscribe(async _ => {
        if (this.widgetData.readValuesQueryParamsKey) {
          const { zoom, pageNumber } = this.widgetData.readValuesQueryParamsKey
          const params = this.activatedRoute.snapshot.queryParamMap
          if (
            Number(params.get(zoom)) !== this.zoom.value ||
            Number(params.get(pageNumber)) !== this.currentPage.value
          ) {
            this.router.navigate([], {
              queryParams: {
                [pageNumber]: this.currentPage.value,
                [zoom]: this.zoom.value,
              },
            })
          }
        }
        await this.render()
      })

    if (!this.widgetData.disableTelemetry) {
      this.runnerSubs = interval(30000).subscribe(_ => {
        this.eventDispatcher(WsEvents.EnumTelemetrySubType.HeartBeat)
      })
      this.eventDispatcher(WsEvents.EnumTelemetrySubType.Init)
    }
  }
  ngOnChanges() {
    if (this.widgetData !== this.oldData) {
      if (this.totalPages > 0) {
        this.saveContinueLearning()
        this.fireRealTimeProgress()
        this.realTimeProgressRequest = {
          content_type: 'Resource',
          current: ['0'],
          max_size: 0,
          mime_type: NsContent.EMimeTypes.PDF,
          user_id_type: 'uuid',
        }
        this.current = ['1']
      }
    }
  }
  ngAfterViewInit() {
    this.contextMenuSubs = fromEvent(this.pdfContainer.nativeElement, 'contextmenu').subscribe(e =>
      e.preventDefault(),
    )
    if (this.widgetData && this.widgetData.pdfUrl) {
      this.logger.log(this.widgetData.pdfUrl)
      this.loadDocument(this.widgetData.pdfUrl)
    }
    if (this.containerSection.nativeElement.clientWidth < 400) {
      this.isSmallViewPort = true
    }

  }
  ngOnDestroy() {
    if (this.contextMenuSubs) {
      this.contextMenuSubs.unsubscribe()
    }
    if (this.renderSubscriptions) {
      this.renderSubscriptions.unsubscribe()
    }
    if (this.runnerSubs) {
      this.runnerSubs.unsubscribe()
    }
    if (!this.widgetData.disableTelemetry) {
      this.eventDispatcher(WsEvents.EnumTelemetrySubType.Unloaded)
    }
    if (this.routerSubs) {
      this.routerSubs.unsubscribe()
    }
    this.saveContinueLearning()
    this.fireRealTimeProgress()
  }
  loadPageNum(pageNum: number) {
    this.raiseTelemetry('pageChange')
    if (pageNum < 1 || pageNum > this.totalPages) {
      return
    }
    this.currentPage.setValue(pageNum)
    const pageNumStr = pageNum.toString()
    if (!this.current.includes(pageNumStr)) {
      this.current.push(pageNumStr)
    }
    if (!this.widgetData.disableTelemetry) {
      this.eventDispatcher(WsEvents.EnumTelemetrySubType.StateChange)
    }
  }
  raiseTelemetry(action: string) {
    if (this.widgetData.identifier) {
      this.eventSvc.raiseInteractTelemetry(
        action,
        'click',
        {
          contentId: this.widgetData.identifier,
        },
      )
    }
  }
  saveContinueLearning() {
    this.contentSvc
      .saveContinueLearning({
        contextPathId: this.activatedRoute.snapshot.queryParams.collectionId ?
          this.activatedRoute.snapshot.queryParams.collectionId : this.widgetData.identifier,
        resourceId: this.widgetData.identifier,
        dateAccessed: Date.now(),
        data: JSON.stringify({
          progress: this.currentPage.value,
          timestamp: Date.now(),
        }),
      })
      .toPromise()
      .catch()
  }
  fireRealTimeProgress() {
    // if (this.htmlData) {
    //   if ((this.htmlData.contentType === NsContent.EContentTypes.COURSE && this.htmlData.isExternal)) {
    //     return
    //   }
    // }
    // if (this.htmlData) {
    //   if (this.htmlData.sourceName === 'Cross Knowledge') {
    //     return
    //   }
    // }
    const realTimeProgressRequest = {
      ...this.realTimeProgressRequest,
      max_size: this.totalPages,
      current: this.totalPages > 0 ? this.current : [''],
    }
    this.viewerSvc
      .realTimeProgressUpdate(this.widgetData.identifier, realTimeProgressRequest)
    return
  }

  private async render(): Promise<boolean> {
    if (!this.pdfContainer || this.pdfInstance === null) {
      return false
    }
    this.pdfContainer.nativeElement.innerHTML = ''
    const page = await this.pdfInstance.getPage(this.currentPage.value)
    // if (this.zoom.pristine) {
    //   const viewportWithNoScale = page.getViewport({ scale: this.DEFAULT_SCALE })
    //   const zoom = this.containerSection.nativeElement.clientWidth / (viewportWithNoScale.width)
    //   if (this.zoom.value !== Math.min(2, Math.floor(zoom * 100) / 100)) {
    //     this.zoom.setValue(Math.min(2, Math.floor(zoom * 100) / 100))
    //   }
    // }
    const viewport = page.getViewport({ scale: this.zoom.value })
    // const scale = this.pdfContainer.nativeElement.clientWidth / (viewport.width * this.CSS_UNITS)
    this.pdfContainer.nativeElement.width = viewport.width
    this.pdfContainer.nativeElement.height = viewport.height
    this.lastRenderTask = new pdfjsViewer.PDFPageView({
      container: this.pdfContainer.nativeElement,
      scale: this.zoom.value,
      id: this.currentPage.value,
      defaultViewport: viewport,
      textLayerFactory: new pdfjsViewer.DefaultTextLayerFactory(),
      annotationLayerFactory: new pdfjsViewer.DefaultAnnotationLayerFactory(),
    })
    if (this.lastRenderTask) {
      this.lastRenderTask.setPdfPage(page)
      this.lastRenderTask.draw()
    }
    return true
  }

  refresh() {
    this.renderSubject.next()
  }

  private async loadDocument(url: string) {
    const pdf = await PDFJS.getDocument(url).promise
    this.pdfInstance = pdf
    this.totalPages = this.pdfInstance.numPages
    this.zoom.enable()
    this.currentPage.enable()
    this.currentPage.setValue(
      typeof this.widgetData.resumePage === 'number' &&
        this.widgetData.resumePage >= 1 &&
        this.widgetData.resumePage <= this.totalPages
        ? this.widgetData.resumePage
        : 1,
    )

    this.renderSubject.next()
    this.activityStartedAt = new Date()
    if (!this.widgetData.disableTelemetry) {
      this.eventDispatcher(WsEvents.EnumTelemetrySubType.Loaded)
    }
  }

  private eventDispatcher(
    eventType: WsEvents.EnumTelemetrySubType,
    activity: WsEvents.EnumTelemetryPdfActivity = WsEvents.EnumTelemetryPdfActivity.NONE,
  ) {
    if (this.widgetData.disableTelemetry) {
      return
    }
    const commonStructure: WsEvents.WsEventTelemetryPDF = {
      eventType: WsEvents.WsEventType.Telemetry,
      eventLogLevel: WsEvents.WsEventLogLevel.Info,
      from: {
        type: 'widget',
        widgetType: ROOT_WIDGET_CONFIG.player._type,
        widgetSubType: ROOT_WIDGET_CONFIG.player.pdf,
      },
      to: '',
      data: {
        eventSubType: eventType,
        activityType: activity,
        currentPage: this.currentPage.value,
        totalPage: this.totalPages,
        activityStartedAt: this.activityStartedAt,
      },
      passThroughData: this.widgetData.passThroughData,
    }

    switch (eventType) {
      case WsEvents.EnumTelemetrySubType.HeartBeat:
      case WsEvents.EnumTelemetrySubType.Init:
      case WsEvents.EnumTelemetrySubType.Loaded:
      case WsEvents.EnumTelemetrySubType.StateChange:
      case WsEvents.EnumTelemetrySubType.Unloaded:
        break
      default:
        return
    }
    if (this.enableTelemetry) {
      this.eventSvc.dispatchEvent(commonStructure)
    }
  }
}
