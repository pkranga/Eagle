/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { fromEvent, interval, Subscription, timer } from 'rxjs';
import { first, map, tap } from 'rxjs/operators';
import { COMM_STATES, ICommEvent, IVideoPluginTelemetry, TDataError } from '../../../../models/comm-events.model';
import { IInteractionGroupMeta } from '../../../../models/interactiveVideo.model';
import { IUserRealTimeProgressUpdateRequest } from '../../../../models/user.model';
import { HistoryService } from '../../../../services/history.service';
import { TelemetryService } from '../../../../services/telemetry.service';
import { UserService } from '../../../../services/user.service';
import { ValuesService } from '../../../../services/values.service';
import { IProcessedViewerContent, ViewerService } from '../../../../services/viewer.service';
import { ConfigService } from '../../../../services/config.service';
import { requestExitFullScreen, requestFullScreen } from '../../../../utils/fullScreen';

const ampConfig: amp.Player.Options = {
  /* Options */
  techOrder: ['azureHtml5JS', 'flashSS', 'html5FairPlayHLS', 'silverlightSS', 'html5'],
  nativeControlsForTouch: false,
  autoplay: true,
  controls: true,
  width: '100%',
  height: '100%',
  poster: '',
  logo: { enabled: false },
  playbackSpeed: {
    enabled: true,
    initialSpeed: 1.0,
    speedLevels: [
      { name: 'x3.0', value: 3.0 },
      { name: 'x2.0', value: 2.0 },
      { name: 'x1.5', value: 1.5 },
      { name: 'x1.25', value: 1.25 },
      { name: 'normal', value: 1.0 },
      { name: 'x0.85', value: 0.85 },
      { name: 'x0.75', value: 0.75 }
    ]
  },
  plugins: {
    timelineMarker: {
      markertime: []
    }
  }
};
export class AMPPluginError extends Error {
  constructor(public code: 'INVALID_ID' | 'LOAD_ERROR' | TDataError, msg?: string) {
    super(msg);
  }
}

@Component({
  selector: 'app-interactive-video',
  templateUrl: './interactive-video.component.html',
  styleUrls: ['./interactive-video.component.scss']
})
export class InteractiveVideoComponent implements OnInit, OnDestroy {
  @Input() processedContent: IProcessedViewerContent;
  @Input() collectionId: string;
  @ViewChild('ivideoContainer', { static: true }) ivideoContainer: ElementRef<HTMLDivElement>;
  @ViewChild('intearctionContainer', { static: true }) intearctionContainer: ElementRef<HTMLDivElement>;
  private player: amp.Player;

  lastSec = -1;
  private firstRealTimeProgressFired = false;
  private lastRealTimeProgressFired = false;
  interactionMarkersTimeSet = new Set();
  currentInteractionGroupId: string;

  interactionGroupMeta: IInteractionGroupMeta = {} as IInteractionGroupMeta;

  private hasScriptLoaded = false;
  private markersLoaded = false;
  isFullScreen = false;
  constructor(
    private route: ActivatedRoute,
    private viewerSvc: ViewerService,
    private telemetry: TelemetryService,
    private valuesSvc: ValuesService,
    private historySvc: HistoryService,
    private userSvc: UserService,
    private configSvc: ConfigService
  ) {}
  paramSubscription;
  async ngOnInit() {
    this.paramSubscription = this.route.data.subscribe(data => {
      this.processedContent = data.playerDetails.processedResource;
      this.collectionId = data.playerDetails.toc.identifier;
      this.onInItFunction();
    });
  }

  async onInItFunction() {
    if (this.processedContent && this.processedContent.content && this.processedContent.interactions) {
      this.interactionMarkersTimeSet = new Set(
        this.processedContent.interactions.interactions.map(interaction => interaction.time)
      );
      await this.loadPlayer();
    }
  }

  async loadPlayer() {
    this.disposePlayer();
    const start = this.viewerSvc.resumePointStringToProgressNumber(this.processedContent.resumeData);
    const interactionTimings = this.processedContent.interactions.interactions.map(interaction => {
      return this.transformTime(interaction.time);
    });
    // tslint:disable-next-line:max-line-length
    this.ivideoContainer.nativeElement.innerHTML = `<video id="azuremediaplayer" class="azuremediaplayer amp-flush-skin amp-big-play-centered"></video>`;
    this.player = await this.init(
      'azuremediaplayer',
      this.processedContent.interactions.videoUrl,
      this.processedContent.video.streamingToken,
      this.processedContent.video.manifest,
      this.processedContent.content.appIcon,
      this.processedContent.content.identifier,
      this.processedContent.content.mimeType,
      this.collectionId,
      start,
      interactionTimings
    );
  }

  private disposePlayer() {
    if (this.player && typeof this.player.dispose === 'function') {
      this.player.dispose();
    }
  }

  ngOnDestroy() {
    this.disposePlayer();
  }

  transformTime(time: number) {
    let duration = '';
    const h = Math.floor(time / 3600);
    const m = Math.floor((time % 3600) / 60);
    const s = Math.floor((time % 3600) % 60);
    duration += h > 0 ? `${this.padZeros(h, 2)}:` : '00:';
    duration += m > 0 ? `${this.padZeros(m, 2)}:` : '00:';
    duration += s > 0 ? this.padZeros(s, 2) : '00';
    return duration;
  }

  padZeros(num: number, size: number): string {
    let res = num + '';
    while (res.length < size) {
      res = '0' + res;
    }
    return res;
  }

  async init(
    videoTagId: string,
    file: string,
    msToken: string,
    manifest: string,
    posterImage: string,
    contentId: string,
    mimeType: string,
    collectionId: string,
    start: number,
    markers: string[],
    subTitlesObj: { [lang: string]: string } = {}
  ): Promise<amp.Player> {
    await this.scriptSetup();
    if (markers.length) {
      await this.markersSetup();
    }
    if (!amp) {
      await timer(1000).toPromise();
      if (!amp) {
        throw new Error('AMP NOT LOADED');
      }
    }
    let notifierSubscription: Subscription;
    let maxStartTime = start;
    const player: amp.Player = amp(videoTagId, this.ampConfig(posterImage, markers), () => {
      notifierSubscription = interval(30000).subscribe(() => {
        this.notifier('RUNNING', contentId, collectionId, mimeType, player);
        const playerCurrentTime = player.currentTime();
        if (playerCurrentTime > maxStartTime) {
          maxStartTime = player.currentTime();
        }
        this.historySvc
          .saveContinueLearning(
            {
              contextPathId: contentId,
              resourceId: contentId,
              percentComplete: Math.round((100 * maxStartTime) / player.duration()) || 0,
              data: JSON.stringify({
                progress: playerCurrentTime,
                timestamp: Date.now()
              })
            },
            contentId
          )
          .toPromise();
      });
      player.addEventListener('ended', () => {
        this.notifier('ENDED', contentId, collectionId, mimeType, player);
      });
      player.addEventListener('play', () => {
        this.monitorInteractions();
        if (this.configSvc.instanceConfig.platform.updateRealTimeProgress) {
          this.monitorForRealTimeProgress(player, contentId, mimeType);
        }
        this.notifier('PLAYING', contentId, collectionId, mimeType, player);
      });
      player.addEventListener('pause', () => {
        this.notifier('PAUSED', contentId, collectionId, mimeType, player);
      });
      player.addEventListener('disposing', () => {
        if (!this.lastRealTimeProgressFired && this.configSvc.instanceConfig.platform.updateRealTimeProgress) {
          this._fireRealTimeProgress(player, contentId, mimeType);
        }
        this.firstRealTimeProgressFired = false;
        this.lastRealTimeProgressFired = false;
        this.notifier('UNLOADED', contentId, collectionId, mimeType, player);
        if (notifierSubscription) {
          notifierSubscription.unsubscribe();
        }
      });
      player.addEventListener('loadeddata', () => {
        this.monitorInteractions();
        this.notifier('LOADED', contentId, collectionId, mimeType, player);
        if (start > 10) {
          player.currentTime(start - 10);
        }
      });
    });
    const src = [];
    const subTitles = [];

    if (manifest && msToken) {
      if (this.valuesSvc.isIos) {
        src.push({
          src:
            `https://cvprsg101v.cloudvideo.azure.net/api/ManifestProxy?playbackUrl=${manifest}(format=m3u8-aapl)&token=` +
            encodeURIComponent(msToken),
          type: 'application/vnd.apple.mpegurl',
          disableUrlRewriter: true
        });
      }
      src.push({
        src: manifest,
        type: 'application/vnd.ms-sstr+xml',
        protectionInfo: [
          {
            type: 'AES',
            authenticationToken: msToken
          }
        ]
      });
    } else if (file) {
      src.push({
        src: file,
        type: this.getContentTypeForFile(file)
      });
    }

    // For subtitles
    if (subTitlesObj.en) {
      subTitles.push({
        label: 'English',
        kind: 'subtitles',
        srclang: 'en',
        src: subTitlesObj.en
      });
    }

    if (subTitles.length) {
      player.src(src, subTitles);
    } else {
      player.src(src);
    }
    return player;
  }

  private monitorForRealTimeProgress(player: amp.Player, contentId: string, mimeType: string) {
    const currentSec = Math.floor(player.currentTime());
    if (currentSec !== this.lastSec) {
      this.lastSec = currentSec;
      if (this.firstRealTimeProgressFired && this.lastRealTimeProgressFired) {
        return;
      }
      // fire first progress on 15s or 10% of content duration whichever is smaller
      if (!this.firstRealTimeProgressFired && currentSec >= Math.min(0.1 * player.duration(), 15)) {
        this.firstRealTimeProgressFired = true;
        this._fireRealTimeProgress(player, contentId, mimeType);
      }

      // fire last progress on -5s or 95% of content duration whichever is smaller
      if (!this.lastRealTimeProgressFired && currentSec >= Math.min(0.95 * player.duration(), player.duration() - 5)) {
        this.lastRealTimeProgressFired = true;
        this._fireRealTimeProgress(player, contentId, mimeType);
      }
    }
    setTimeout(() => {
      if (!player.paused()) {
        this.monitorForRealTimeProgress(player, contentId, mimeType);
      }
    }, 500);
  }

  private _fireRealTimeProgress(player: amp.Player, contentId: string, mimeType: string) {
    const req: IUserRealTimeProgressUpdateRequest = {
      content_type: this.processedContent.content.contentType,
      current: [player.currentTime().toString()],
      max_size: player.duration(),
      mime_type: mimeType,
      user_id_type: 'uuid'
    };
    this.userSvc.realTimeProgressUpdate(contentId, req).subscribe();
  }

  private monitorInteractions() {
    const currentSec = Math.floor(this.player.currentTime());
    if (currentSec !== this.lastSec) {
      this.lastSec = currentSec;
      if (this.interactionMarkersTimeSet.has(currentSec)) {
        this.initiateInteractionManager(currentSec || -1);
      }
    }
    setTimeout(() => {
      if (!this.player.paused()) {
        this.monitorInteractions();
      }
    }, 500);
  }

  private initiateInteractionManager(sec: number) {
    const currentGroupIndex = this.processedContent.interactions.interactions.findIndex(interaction => {
      return interaction.time === sec;
    });
    if (currentGroupIndex > -1) {
      this.player.pause();
      const baseUrlEndIndex = this.processedContent.interactions.videoUrl.split('?')[0].lastIndexOf('/') + 1;
      const queryIndex = this.processedContent.interactions.videoUrl.lastIndexOf('?');
      this.currentInteractionGroupId = this.processedContent.interactions.interactions[currentGroupIndex].id;
      this.interactionGroupMeta = {
        groupId: this.processedContent.interactions.interactions[currentGroupIndex].id,
        baseVideoUrl: {
          baseUrl: this.processedContent.interactions.videoUrl.substring(0, baseUrlEndIndex),
          query: this.processedContent.interactions.videoUrl.substring(queryIndex)
        },
        canSkip: this.processedContent.interactions.interactions[currentGroupIndex].canSkip || true,
        preamble: this.processedContent.interactions.interactions[currentGroupIndex].preamble,
        postamble: this.processedContent.interactions.interactions[currentGroupIndex].postamble
      };
    }
  }

  async scriptSetup(): Promise<boolean> {
    if (this.hasScriptLoaded) {
      return true;
    }
    const elem = document.getElementById('ampScript');
    if (elem) {
      return fromEvent(elem, 'load')
        .pipe(
          first(),
          tap(() => {
            this.hasScriptLoaded = true;
          }),
          map(() => true)
        )
        .toPromise();
    }

    const ampScript = document.createElement('script');
    ampScript.setAttribute('id', 'ampScript');
    ampScript.setAttribute('src', 'https://amp.azure.net/libs/amp/2.2.0/azuremediaplayer.min.js');
    document.body.appendChild(ampScript);
    const ampLink = document.createElement('link');
    ampLink.setAttribute('rel', 'stylesheet');
    ampLink.setAttribute('href', 'https://amp.azure.net/libs/amp/2.2.0/skins/amp-flush/azuremediaplayer.min.css');
    document.body.appendChild(ampLink);
    return fromEvent(ampScript, 'load')
      .pipe(
        first(),
        tap(() => {
          this.hasScriptLoaded = true;
        }),
        map(() => true)
      )
      .toPromise();
  }

  async markersSetup(): Promise<boolean> {
    if (this.markersLoaded) {
      return true;
    }
    const elem = document.getElementById('markerScript');
    if (elem) {
      return fromEvent(elem, 'load')
        .pipe(
          first(),
          tap(() => {
            this.markersLoaded = true;
          }),
          map(() => true)
        )
        .toPromise();
    }

    const markerScript = document.createElement('script');
    markerScript.setAttribute('id', 'markerScript');
    markerScript.setAttribute('src', '/public-assets/common/plugins/timeline-markers/timelineMarkers.js');
    document.body.appendChild(markerScript);
    const markerCssLink = document.createElement('link');
    markerCssLink.setAttribute('rel', 'stylesheet');
    markerCssLink.setAttribute('href', '/public-assets/common/plugins/timeline-markers/timelineMarkers.css');
    document.body.appendChild(markerCssLink);
    return fromEvent(markerScript, 'load')
      .pipe(
        first(),
        tap(() => {
          this.markersLoaded = true;
        }),
        map(() => true)
      )
      .toPromise();
  }

  private notifier(state: COMM_STATES, contentId: string, courseId: string, mimeType: string, player) {
    const videoData: IVideoPluginTelemetry = {
      courseId,
      identifier: contentId,
      mimeType,
      duration: player.currentTime(),
      force: false,
      isCompleted: false,
      isIdeal: player.paused()
    };
    const commEvent: ICommEvent<IVideoPluginTelemetry> = {
      app: 'WEB_PLAYER_PLUGIN',
      data: videoData,
      plugin: 'video',
      state,
      type: 'TELEMETRY'
    };
    this.telemetry.playerTelemetryEvent(commEvent);
  }

  ampConfig(poster: string, markers: string[]): amp.Player.Options {
    const config = { ...ampConfig };
    config.plugins = {
      timelineMarker: {
        markertime: markers
      }
    };
    return {
      ...config,
      poster
    };
  }

  getContentTypeForFile(file: string) {
    let ext = file.substring(file.lastIndexOf('.') + 1);
    const queryIndex = ext.lastIndexOf('?');
    if (queryIndex > -1) {
      ext = ext.substring(0, queryIndex);
    }
    switch (ext) {
      case 'mp4':
        return 'video/mp4';
      case 'mp3':
        return 'audio/mpeg';
      default:
        throw new AMPPluginError('MIME_CONTENT_MISMATCH');
    }
  }

  eventFromInteractionGroupManager(event) {
    if (event === 'resume') {
      this.currentInteractionGroupId = null;
      this.interactionGroupMeta = {} as IInteractionGroupMeta;
      this.player.play();
    }
  }

  toggleFullscreen() {
    if (this.intearctionContainer && this.intearctionContainer.nativeElement && this.isFullScreen === false) {
      this.requestFullScreen(this.intearctionContainer.nativeElement);
      this.isFullScreen = true;
    } else if (this.isFullScreen) {
      this.requestExitFullScreen();
      this.isFullScreen = false;
    }
  }

  private requestFullScreen(elem: HTMLDivElement) {
    requestFullScreen(elem);
  }
  private requestExitFullScreen() {
    requestExitFullScreen();
  }
}
