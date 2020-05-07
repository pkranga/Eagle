/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NsWidgetResolver, WidgetBaseComponent } from '@ws-widget/resolver'
import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
} from '@angular/core'
import videoJs from 'video.js'
import { ROOT_WIDGET_CONFIG } from '../collection.config'
import { IWidgetsPlayerMediaData } from '../_models/player-media.model'
import { EventService, ValueService } from '@ws-widget/utils'
import {
  videoJsInitializer,
  telemetryEventDispatcherFunction,
  saveContinueLearningFunction,
  fireRealTimeProgressFunction,
  youtubeInitializer,
} from '../_services/videojs-util'
import { ViewerUtilService } from '../../../../../../project/ws/viewer/src/lib/viewer-util.service'
import { WidgetContentService } from '../_services/widget-content.service'
import { NsContent } from '../_services/widget-content.model'
import { ActivatedRoute } from '../../../../../../node_modules/@angular/router'
import { Subscription } from 'rxjs'
interface IYTOptions extends videoJs.PlayerOptions {
  youtube: {
    ytControls: 0 | 1 | 2
    customVars?: {
      wmode: 'transparent',
    },
  }
}
const videoJsOptions: IYTOptions = {
  controls: true,
  autoplay: false,
  preload: 'auto',
  fluid: true,
  techOrder: ['youtube'],
  playbackRates: [0.75, 0.85, 1, 1.25, 2, 3],
  poster: '',
  html5: {
    hls: {
      overrideNative: true,
    },
    nativeVideoTracks: false,
    nativeAudioTracks: false,
    nativeTextTracks: false,
  },
  nativeControlsForTouch: false,
  youtube: {
    ytControls: 0,
    customVars: {
      wmode: 'transparent',
    },
  },
}

@Component({
  selector: 'ws-widget-player-youtube',
  templateUrl: './player-youtube.component.html',
  styleUrls: ['./player-youtube.component.scss'],
})
export class PlayerYoutubeComponent extends WidgetBaseComponent
  implements OnInit, AfterViewInit, OnDestroy, NsWidgetResolver.IWidgetData<any> {
  @Input() widgetData!: IWidgetsPlayerMediaData
  screenSubscription: Subscription | null = null
  screenHeight: string | null = null
  // @Input() data!: IWidgetsPlayerMediaData
  @ViewChild('videoTag', { static: false }) videoTag!: ElementRef<HTMLVideoElement>
  @ViewChild('youtubeTag', { static: false }) youtubeTag!: ElementRef<HTMLElement>
  private player: videoJs.Player | null = null
  private dispose: (() => void) | null = null
  constructor(
    private eventSvc: EventService,
    private contentSvc: WidgetContentService,
    private viewerSvc: ViewerUtilService,
    private activatedRoute: ActivatedRoute,
    private valueSvc: ValueService,
  ) {
    super()
  }

  ngOnInit() {
    this.screenSubscription = this.valueSvc.isXSmall$.subscribe(isXsSmall => {
      if (isXsSmall) {
        this.screenHeight = '100%'
      } else {
        this.screenHeight = '390px'
      }
    })
  }

  ngAfterViewInit() {
    if (this.widgetData && this.widgetData.url) {
      if (this.widgetData.isVideojs) {
        this.initializePlayer()
      } else {
        this.initializeYPlayer(this.widgetData.url.split('embed/')[1])
      }
    }
  }
  ngOnDestroy() {
    if (this.player) {
      this.player.dispose()
    }
    if (this.dispose) {
      this.dispose()
    }
    if (this.screenSubscription) {
      this.screenSubscription.unsubscribe()
    }
  }

  private initializeYPlayer(videoId: string) {
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
    this.dispose = youtubeInitializer(
      this.youtubeTag.nativeElement,
      videoId,
      dispatcher,
      saveCLearning,
      fireRProgress,
      this.widgetData.passThroughData,
      ROOT_WIDGET_CONFIG.player.video,
      !(this.widgetData.disableTelemetry || false),
      this.widgetData,
      NsContent.EMimeTypes.YOUTUBE,
      this.screenHeight ? this.screenHeight : '100 %',
    ).dispose
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
      this.videoTag.nativeElement,
      {
        ...videoJsOptions,
        poster: this.widgetData.posterImage,
        sources: [
          {
            type: 'video/youtube',
            src: this.widgetData.url,
          },
        ],
      },
      dispatcher,
      saveCLearning,
      fireRProgress,
      this.widgetData.passThroughData,
      ROOT_WIDGET_CONFIG.player.video,
      this.widgetData.resumePoint,
      !(this.widgetData.disableTelemetry || false),
      this.widgetData,
      NsContent.EMimeTypes.YOUTUBE,
    )
    this.player = initObj.player
    this.dispose = initObj.dispose
  }
}
