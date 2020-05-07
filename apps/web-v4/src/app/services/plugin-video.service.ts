/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
/// <reference types="azuremediaplayer" />
import { Injectable } from '@angular/core';
import { fromEvent, interval, Subscription, timer } from 'rxjs';
import { first, map, tap } from 'rxjs/operators';
import { COMM_STATES, ICommEvent, IVideoPluginTelemetry, TDataError } from '../models/comm-events.model';
import { IUserRealTimeProgressUpdateRequest } from '../models/user.model';
import { ConfigService } from './config.service';
import { HistoryService } from './history.service';
import { TelemetryService } from './telemetry.service';
import { UserService } from './user.service';
import { ValuesService } from './values.service';
import { TContentType } from '../models/content.model';

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
      { name: 'x1.25', value: 1.25 },
      { name: 'normal', value: 1.0 },
      { name: 'x0.85', value: 0.85 },
      { name: 'x0.75', value: 0.75 }
    ]
  }
};

export class AMPPluginError extends Error {
  constructor(public code: 'INVALID_ID' | 'LOAD_ERROR' | TDataError, msg?: string) {
    super(msg);
  }
}

@Injectable({
  providedIn: 'root'
})
export class PluginVideoService {
  private hasScriptLoaded = false;
  private markersLoaded = false;
  private lastSec = -1;
  private firstRealTimeProgressFired = false;
  private lastRealTimeProgressFired = false;
  constructor(
    private telemetry: TelemetryService,
    private valuesSvc: ValuesService,
    private historySvc: HistoryService,
    private userSvc: UserService,
    private configSvc: ConfigService
  ) {}

  async init(
    videoTagId: string,
    file: string,
    msToken: string,
    manifest: string,
    posterImage: string,
    contentId: string,
    contentType: TContentType,
    mimeType: string,
    collectionId: string,
    start: number,
    markers: string[],
    subTitlesObj: { [lang: string]: string },
    misc: {
      enableContinueLearning: boolean;
      autoplay: boolean;
    }
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
    const player: amp.Player = amp(videoTagId, this.ampConfig(posterImage, markers, misc.autoplay), () => {
      notifierSubscription = interval(30000).subscribe(() => {
        this.notifier('RUNNING', contentId, collectionId, mimeType, player);
        if (misc.enableContinueLearning) {
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
            .toPromise()
            .catch(err => console.warn(err));
        }
      });
      player.addEventListener('ended', () => {
        this.notifier('DONE', contentId, collectionId, mimeType, player);
      });
      player.addEventListener('play', () => {
        if (this.configSvc.instanceConfig.platform.updateRealTimeProgress) {
          this.monitorForRealTimeProgress(player, contentId, mimeType, contentType);
        }
        this.notifier('PLAYING', contentId, collectionId, mimeType, player);
      });
      player.addEventListener('pause', () => {
        this.notifier('PAUSED', contentId, collectionId, mimeType, player);
      });
      player.addEventListener('disposing', () => {
        if (!this.lastRealTimeProgressFired && this.configSvc.instanceConfig.platform.updateRealTimeProgress) {
          this._fireRealTimeProgress(player, contentId, mimeType, contentType);
        }
        this.firstRealTimeProgressFired = false;
        this.lastRealTimeProgressFired = false;
        this.notifier('UNLOADED', contentId, collectionId, mimeType, player);
        if (notifierSubscription) {
          notifierSubscription.unsubscribe();
        }
      });
      player.addEventListener('loadeddata', () => {
        this.notifier('LOADED', contentId, collectionId, mimeType, player);
        if (start > 10 && player.duration() - start > 20) {
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

  private monitorForRealTimeProgress(
    player: amp.Player,
    contentId: string,
    mimeType: string,
    contentType: TContentType
  ) {
    const currentSec = Math.floor(player.currentTime());
    if (currentSec !== this.lastSec) {
      this.lastSec = currentSec;
      if (this.firstRealTimeProgressFired && this.lastRealTimeProgressFired) {
        return;
      }
      // fire first progress on 15s or 10% of content duration whichever is smaller
      if (!this.firstRealTimeProgressFired && currentSec >= Math.min(0.1 * player.duration(), 15)) {
        this.firstRealTimeProgressFired = true;
        this._fireRealTimeProgress(player, contentId, mimeType, contentType);
      }

      // fire last progress on -5s or 95% of content duration whichever is smaller
      if (!this.lastRealTimeProgressFired && currentSec >= Math.min(0.95 * player.duration(), player.duration() - 5)) {
        this.lastRealTimeProgressFired = true;
        this._fireRealTimeProgress(player, contentId, mimeType, contentType);
      }
    }
    setTimeout(() => {
      if (!player.paused()) {
        this.monitorForRealTimeProgress(player, contentId, mimeType, contentType);
      }
    }, 500);
  }

  private _fireRealTimeProgress(player: amp.Player, contentId: string, mimeType: string, contentType: TContentType) {
    if (!contentType) {
      return;
    }
    const req: IUserRealTimeProgressUpdateRequest = {
      content_type: contentType,
      current: [player.currentTime().toString()],
      max_size: player.duration(),
      mime_type: mimeType,
      user_id_type: 'uuid'
    };
    this.userSvc.realTimeProgressUpdate(contentId, req).subscribe();
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
          // console.log("event loaded after adding scripts");
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
    const markerLink = document.createElement('link');
    markerLink.setAttribute('rel', 'stylesheet');
    markerLink.setAttribute('href', '/public-assets/common/plugins/timeline-markers/timelineMarkers.css');
    document.body.appendChild(markerLink);
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

  ampConfig(poster: string, markers: string[], autoplay: boolean): amp.Player.Options {
    let config = { ...ampConfig, autoplay };
    if (markers.length) {
      config = {
        ...config,
        plugins: {
          timelineMarker: {
            markertime: markers
          }
        }
      };
    }
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
      case 'm3u8':
        return '';
      default:
        throw new AMPPluginError('MIME_CONTENT_MISMATCH');
    }
  }
}
