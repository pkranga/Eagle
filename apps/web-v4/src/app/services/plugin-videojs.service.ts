/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import videojs from 'video.js';
import 'videojs-contrib-quality-levels';
import 'videojs-hls-quality-selector';
import 'videojs-vr';
import { COMM_STATES, ICommEvent, IVideoPluginTelemetry } from '../models/comm-events.model';
import { IUserRealTimeProgressUpdateRequest } from '../models/user.model';
import { ConfigService } from './config.service';
import { HistoryService } from './history.service';
import { TelemetryService } from './telemetry.service';
import { UserService } from './user.service';
import { ValuesService } from './values.service';
import { TContentType } from '../models/content.model';

const videojsOptions: videojs.PlayerOptions = {
  controls: true,
  autoplay: true,
  preload: 'auto',
  fluid: true,
  techOrder: ['html5'],
  // nativeControlsForTouch: true,
  playbackRates: [0.75, 0.85, 1, 1.25, 2, 3],
  poster: ''
};

@Injectable({
  providedIn: 'root'
})
export class PluginVideojsService {
  private lastSec = -1;
  private firstRealTimeProgressFired = false;
  private lastRealTimeProgressFired = false;
  constructor(
    private historySvc: HistoryService,
    private telemetrySvc: TelemetryService,
    private valueSvc: ValuesService,
    private userSvc: UserService,
    private configSvc: ConfigService
  ) { }

  async init(
    videoTagId: string,
    manifest: string,
    posterImage: string,
    contentId: string,
    mimeType: string,
    contentType: TContentType,
    collectionId: string,
    start: number,
    subTitlesObj: { [lang: string]: string } = {},
  ): Promise<videojs.Player> {
    let notifierSubscription: Subscription;
    let maxStartTime = start;
    const player: videojs.Player = videojs(videoTagId, this.videojsOptionsUpdate(posterImage), () => {
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
          .toPromise()
          .catch(err => console.warn(err));
      });
      player.on('ended', () => {
        this.notifier('ENDED', contentId, collectionId, mimeType, player);
      });
      player.on('play', () => {
        if (this.configSvc.instanceConfig.platform.updateRealTimeProgress) {
          this.monitorForRealTimeProgress(player, contentId, mimeType, contentType);
        }
        this.notifier('PLAYING', contentId, collectionId, mimeType, player);
      });
      player.on('pause', () => {
        this.notifier('PAUSED', contentId, collectionId, mimeType, player);
      });
      player.on('dispose', () => {
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
      player.on('loadeddata', () => {
        this.notifier('LOADED', contentId, collectionId, mimeType, player);
        if (start > 10 && player.duration() - start > 20) {
          player.currentTime(start - 10);
        }
      });
    });

    player.src(manifest);

    // (player as any).vr({ projection: '360' });
    // (player as any).hlsQualitySelector();

    return player;
  }

  private videojsOptionsUpdate(poster: string): videojs.PlayerOptions {
    let options = {
      ...videojsOptions,
      poster
    };
    if (this.valueSvc.isAndroid || this.valueSvc.isIos) {
      const overrideNative = this.valueSvc.isAndroid;
      const html5 = {
        hls: {
          overrideNative
        },
        nativeVideoTracks: !overrideNative,
        nativeAudioTracks: !overrideNative,
        nativeTextTracks: !overrideNative
      };
      options = {
        ...options,
        html5
      };
    }

    return options;
  }

  private monitorForRealTimeProgress(
    player: videojs.Player,
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

  private _fireRealTimeProgress(
    player: videojs.Player,
    contentId: string,
    mimeType: string,
    contentType: TContentType
  ) {
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

  private notifier(state: COMM_STATES, contentId: string, courseId: string, mimeType: string, player: videojs.Player) {
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
    this.telemetrySvc.playerTelemetryEvent(commEvent);
  }
}
