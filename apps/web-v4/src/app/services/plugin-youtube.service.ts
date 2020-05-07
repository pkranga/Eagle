/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
/// <reference types="youtube" />
import { Injectable } from '@angular/core';
import { fromEvent, interval, Observable, of, Subject, Subscription, timer } from 'rxjs';
import { filter, first, map, switchMap } from 'rxjs/operators';
import { MIME_TYPE } from '../constants/mime.constants';
import { COMM_STATES, ICommEvent, IVideoPluginTelemetry } from '../models/comm-events.model';
import { IUserRealTimeProgressUpdateRequest } from '../models/user.model';
import { ConfigService } from './config.service';
import { HistoryService } from './history.service';
import { TelemetryService } from './telemetry.service';
import { UserService } from './user.service';
import { TContentType } from '../models/content.model';

export class YTPluginError extends Error {
  constructor(public code: 'INVALID_ID' | 'LOAD_ERROR', msg?: string) {
    super(msg);
  }
}

interface WindowYt extends Window {
  YT?: any;
}
declare var window: WindowYt;

export interface YTPlayerObject {
  player: YT.Player;
  dispose: () => void;
  stateChangeSubject: Subject<YT.PlayerState>;
}

@Injectable({
  providedIn: 'root'
})
export class PluginYoutubeService {
  private lastSec = -1;
  private firstRealTimeProgressFired = false;
  private lastRealTimeProgressFired = false;
  constructor(
    private telemetry: TelemetryService,
    private historySvc: HistoryService,
    private userSvc: UserService,
    private configSvc: ConfigService
  ) {}

  async init(
    ytDivId: string,
    artifactUrl: string,
    contentId: string,
    contentType: TContentType,
    courseId: string,
    start: number
  ): Promise<YTPlayerObject> {
    const vId = this.getVideoId(artifactUrl);
    if (!vId) {
      throw new YTPluginError('INVALID_ID');
    }
    await this.setupYTScript();
    return this.setupYTInstance(vId, ytDivId, contentId, contentType, courseId, start);
  }

  private setupYTInstance(
    videoId: string,
    ytDivId: string,
    contentId: string,
    contentType: TContentType,
    courseId: string,
    start: number
  ): YTPlayerObject {
    let intervalSub: Subscription = null;
    const pluginVars = { isIdeal: false, contentId, courseId };
    let maxStartTime = start;
    const stateChangeSubject = new Subject<YT.PlayerState>();
    const player = new YT.Player(ytDivId, {
      ...this.getYTConfig(videoId, start),
      events: {
        onReady: e => {
          this.raiseEventsAsPlugin('LOADED', pluginVars, player);
          intervalSub = interval(10 * 1000).subscribe(_ => {
            if (player) {
              this.raiseEventsAsPlugin('RUNNING', pluginVars, player);
              const playerCurrentTime = player.getCurrentTime();
              if (playerCurrentTime > maxStartTime) {
                maxStartTime = playerCurrentTime;
              }
              this.historySvc
                .saveContinueLearning(
                  {
                    contextPathId: contentId,
                    resourceId: contentId,
                    percentComplete: Math.round((100 * maxStartTime) / player.getDuration()) || 0,
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
        },
        onStateChange: event => {
          stateChangeSubject.next(event.data);
          switch (event.data) {
            case YT.PlayerState.UNSTARTED:
              this.raiseEventsAsPlugin('UNSTARTED', pluginVars, player);
              break;
            case YT.PlayerState.CUED:
              // this.raiseEventsAsPlugin('CUED', pluginVars, player);
              break;
            case YT.PlayerState.BUFFERING:
              this.raiseEventsAsPlugin('BUFFERING', pluginVars, player);
              break;
            case YT.PlayerState.PLAYING:
              pluginVars.isIdeal = false;
              if (this.configSvc.instanceConfig.platform.updateRealTimeProgress) {
                this.monitorForRealTimeProgress(player, contentId, contentType);
              }
              this.raiseEventsAsPlugin('PLAYING', pluginVars, player);
              break;
            case YT.PlayerState.PAUSED:
              pluginVars.isIdeal = true;
              this.raiseEventsAsPlugin('PAUSED', pluginVars, player);
              break;
            case YT.PlayerState.ENDED:
              if (intervalSub) {
                intervalSub.unsubscribe();
              }
              this.raiseEventsAsPlugin('ENDED', pluginVars, player);
              break;
          }
        }
      }
    });
    const dispose = () => {
      if (!this.lastRealTimeProgressFired && this.configSvc.instanceConfig.platform.updateRealTimeProgress) {
        this._fireRealTimeProgress(player, contentId, contentType);
      }
      this.firstRealTimeProgressFired = false;
      this.lastRealTimeProgressFired = false;
      this.raiseEventsAsPlugin('UNLOADED', pluginVars, player);
      if (intervalSub) {
        intervalSub.unsubscribe();
      }
    };
    return { player, dispose, stateChangeSubject };
  }

  private monitorForRealTimeProgress(player: YT.Player, contentId: string, contentType: TContentType) {
    const currentSec = Math.floor(player.getCurrentTime());
    if (currentSec !== this.lastSec) {
      this.lastSec = currentSec;
      if (this.firstRealTimeProgressFired && this.lastRealTimeProgressFired) {
        return;
      }
      // fire first progress on 15s or 10% of content duration whichever is smaller
      if (!this.firstRealTimeProgressFired && currentSec >= Math.min(0.1 * player.getDuration(), 15)) {
        this.firstRealTimeProgressFired = true;
        this._fireRealTimeProgress(player, contentId, contentType);
      }

      // fire last progress on -5s or 95% of content duration whichever is smaller
      if (
        !this.lastRealTimeProgressFired &&
        currentSec >= Math.min(0.95 * player.getDuration(), player.getDuration() - 5)
      ) {
        this.lastRealTimeProgressFired = true;
        this._fireRealTimeProgress(player, contentId, contentType);
      }
    }
    setTimeout(() => {
      if (player.getPlayerState() === YT.PlayerState.PLAYING) {
        this.monitorForRealTimeProgress(player, contentId, contentType);
      }
    }, 500);
  }
  private _fireRealTimeProgress(player: YT.Player, contentId: string, contentType: TContentType) {
    if (!contentType) {
      return;
    }
    const req: IUserRealTimeProgressUpdateRequest = {
      content_type: 'Resource',
      current: [player.getCurrentTime().toString()],
      max_size: player.getDuration(),
      mime_type: MIME_TYPE.youtube,
      user_id_type: 'uuid'
    };
    this.userSvc.realTimeProgressUpdate(contentId, req).subscribe();
  }
  private raiseEventsAsPlugin(
    state: COMM_STATES,
    pluginVars: { isIdeal: boolean; contentId: string; courseId: string },
    player: YT.Player
  ) {
    const videoTelemetryData: IVideoPluginTelemetry = {
      courseId: pluginVars.courseId,
      identifier: pluginVars.contentId,
      mimeType: MIME_TYPE.youtube,
      isIdeal: player.getPlayerState() === YT.PlayerState.PAUSED,
      isCompleted: state === 'ENDED',
      duration: this.getCurrentTime(player)
    };
    const commEvent: ICommEvent<IVideoPluginTelemetry> = {
      app: 'WEB_PLAYER_PLUGIN',
      plugin: 'youtube',
      type: 'TELEMETRY',
      state,
      data: videoTelemetryData
    };
    this.telemetry.playerTelemetryEvent(commEvent);
  }
  private getCurrentTime(player) {
    if (player) {
      return player.getCurrentTime();
    }
    return -1;
  }

  private async setupYTScript(): Promise<boolean> {
    let loadObservable: Observable<any>;
    if (window.YT) {
      loadObservable = of(true);
    } else if (document.getElementById('lex-yt-script')) {
      const previousAddedScript = document.getElementById('lex-yt-script');
      loadObservable = fromEvent(previousAddedScript, 'load').pipe(first());
    } else {
      const ytScript = document.createElement('script');
      ytScript.setAttribute('id', 'lex-yt-script');
      ytScript.setAttribute('src', 'https://www.youtube.com/iframe_api');
      ytScript.setAttribute('async', 'true');
      ytScript.setAttribute('defer', 'true');
      document.head.appendChild(ytScript);
      loadObservable = fromEvent(ytScript, 'load').pipe(first());
    }
    return loadObservable
      .pipe(
        switchMap(() =>
          timer(0, 500).pipe(
            filter(() => Boolean(window.YT && YT.Player)),
            first(),
            map(() => true)
          )
        )
      )
      .toPromise();
  }

  private getVideoId(url: string): string {
    const matches = url.match(/^https.*\/embed\/(.*)/);
    if (matches && matches[1]) {
      const parts = matches[1].split('?');
      if (parts && parts[0]) {
        return parts[0];
      }
    }
    return null;
  }

  private getYTConfig(videoId, start): YT.PlayerOptions {
    const youtubeDefaultPlayerVars: YT.PlayerVars = {
      autohide: 1, // YT.AutoHide.HideAllControls,
      autoplay: 1, // YT.AutoPlay.AutoPlay,
      color: 'red',
      controls: 2, // YT.Controls.ShowDelayLoadPlayer,
      disablekb: 0,
      enablejsapi: 1,
      loop: 1,
      modestbranding: 1, // YT.ModestBranding.Modest,
      origin: document.baseURI,
      playsinline: 1, // YT.PlaysInline.Inline,
      fs: 0,
      iv_load_policy: 3,
      start
    };

    const youtubeDefaultOptions: YT.PlayerOptions = {
      height: '100%',
      width: '100%',
      videoId,
      playerVars: youtubeDefaultPlayerVars
    };

    return youtubeDefaultOptions;
  }
}
