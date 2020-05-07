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
} from '@angular/core'
import videoJs from 'video.js'
import { ROOT_WIDGET_CONFIG } from '../collection.config'
import { IWidgetsPlayerMediaData } from '../_models/player-media.model'
import { EventService } from '@ws-widget/utils'
import {
  videoJsInitializer,
  telemetryEventDispatcherFunction,
  saveContinueLearningFunction,
  fireRealTimeProgressFunction,
} from '../_services/videojs-util'
import { ViewerUtilService } from '../../../../../../project/ws/viewer/src/lib/viewer-util.service'
import { WidgetContentService } from '../_services/widget-content.service'
import { NsContent } from '../_services/widget-content.model'
import { ActivatedRoute } from '@angular/router'

const videoJsOptions: videoJs.PlayerOptions = {
  controls: true,
  autoplay: true,
  preload: 'auto',
  fluid: false,
  techOrder: ['html5'],
  playbackRates: [0.75, 0.85, 1, 1.25, 2, 3],
  poster: '',
  html5: {
    hls: {
      overrideNative: false,
    },
    nativeVideoTracks: false,
    nativeAudioTracks: false,
    nativeTextTracks: false,
  },
}

@Component({
  selector: 'ws-widget-player-audio',
  templateUrl: './player-audio.component.html',
  styleUrls: ['./player-audio.component.scss'],
})
export class PlayerAudioComponent extends WidgetBaseComponent
  implements OnInit, AfterViewInit, OnDestroy, NsWidgetResolver.IWidgetData<any> {
  @Input() widgetData!: IWidgetsPlayerMediaData
  @ViewChild('audioTag', { static: true }) audioTag!: ElementRef<HTMLAudioElement>
  private player: videoJs.Player | null = null
  private dispose: null | (() => void) = null
  constructor(
    private eventSvc: EventService,
    private contentSvc: WidgetContentService,
    private viewerSvc: ViewerUtilService,
    private activatedRoute: ActivatedRoute,
  ) {
    super()
  }

  ngOnInit() {
  }
  ngAfterViewInit() {
    if (this.widgetData && this.widgetData.identifier) {
      this.fetchContent()
    }
    if (this.widgetData.url) {
      this.initializePlayer()
    }
  }
  ngOnDestroy() {
    if (this.player) {
      this.player.dispose()
    }
    if (this.dispose) {
      this.dispose()
    }

  }
  private initializePlayer() {
    const dispatcher: telemetryEventDispatcherFunction = event => {
      this.eventSvc.dispatchEvent(event)
    }
    const saveCLearning: saveContinueLearningFunction = data => {
      if (this.widgetData.identifier) {
        const continueLearningData = {
          contextPathId: this.activatedRoute.snapshot.queryParams.collectionId ?
            this.activatedRoute.snapshot.queryParams.collectionId : this.widgetData.identifier,
          ...data,
        }
        this.contentSvc
          .saveContinueLearning(continueLearningData)
          .toPromise()
          .catch()
      }
    }
    const fireRProgress: fireRealTimeProgressFunction = (identifier, data) => {
      if (this.widgetData.identifier) {
        this.viewerSvc
          .realTimeProgressUpdate(identifier, data)
      }
    }
    const initObj = videoJsInitializer(
      this.audioTag.nativeElement,
      { ...videoJsOptions, poster: this.widgetData.posterImage },
      dispatcher,
      saveCLearning,
      fireRProgress,
      this.widgetData.passThroughData,
      ROOT_WIDGET_CONFIG.player.audio,
      this.widgetData.resumePoint,
      !(this.widgetData.disableTelemetry || false),
      this.widgetData,
      NsContent.EMimeTypes.MP3,
    )
    this.player = initObj.player
    this.dispose = initObj.dispose
    initObj.player.ready(() => {
      if (Array.isArray(this.widgetData.subtitles)) {
        this.widgetData.subtitles.forEach((u, index) => {
          initObj.player.addRemoteTextTrack(
            {
              default: index === 0,
              kind: 'captions',
              label: u.label,
              srclang: u.srclang,
              src: u.url,
            },
            false,
          )
        })
      }
      initObj.player.src(this.widgetData.url)
    })
  }
  async fetchContent() {
    const content = await this.contentSvc.fetchContent(this.widgetData.identifier || '', 'minimal').toPromise()
    if (content.artifactUrl && content.artifactUrl.indexOf('/content-store/') > -1) {
      this.widgetData.url = content.artifactUrl
      this.widgetData.posterImage = content.appIcon
      await this.contentSvc.setS3Cookie(this.widgetData.identifier || '').toPromise()
    }
  }
}
