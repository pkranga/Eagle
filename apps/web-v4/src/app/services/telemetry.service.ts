/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import { fromEvent } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { TelemetryApiService } from '../apis/telemetry-api.service';
import {
  COMM_EVENT_TYPES,
  ICommEvent,
  IHandsOnTelemetry,
  IIframeTelemetry,
  ILiveEventTelemetry,
  IPdfPluginTelemetry,
  IQuizTelemetry,
  IVideoPluginTelemetry
} from '../models/comm-events.model';
import { ConfigService } from './config.service';
import { AuthService } from './auth.service';
import { ITelemetryState } from '../models/telemetry.model';

declare var $t: any;

const COMM_STATE_TO_TYPE = {
  PLAYING: 'play',
  PAUSED: 'pause',
  FOCUS_LOST: 'lostFocus',
  FOCUS_GAIN: 'receivedFocus'
};

@Injectable({
  providedIn: 'root'
})
export class TelemetryService {
  private hasLostFocus = false;
  public lastEvent: ICommEvent<
    | IVideoPluginTelemetry
    | IPdfPluginTelemetry
    | IQuizTelemetry
    | IIframeTelemetry
  > = null;
  private useTelemetrySdk = this.configSvc.instanceConfig.platform.enableTelemetrySdkEvents;
  private telemetryConfig = this.configSvc.instanceConfig.platform.telemetryConfig;
  private telemetryState: ITelemetryState;

  constructor(
    private telemetryApi: TelemetryApiService,
    private configSvc: ConfigService,
    private authSvc: AuthService
  ) {
    this.addTelemetryGlobalEventHandler();
    this.focusChangeEventListener();
  }

  public startTelemetryEvent(type: string, mode: string) {

    if (this.useTelemetrySdk) {
      const config = {
        ...this.telemetryConfig,
        uid: this.authSvc.userId
      };

      $t.start(config, undefined, undefined, {
        type,
        mode,
        stageid: ''
      });
    }

  }

  public likeUnlikeTelemetryEvent(isLiked: boolean, contentId: string) {
    this.telemetryApi.likeUnlikeTelemetryEvent(isLiked, contentId);

    if (this.useTelemetrySdk) {
      $t.interact({
        type: 'like',
        subtype: isLiked ? 'like' : 'unlike',
        id: 'button'
      });
    }
  }

  public likeUnlikeBlogTelemetryEvent(isLiked: boolean, blogId: string) {
    this.telemetryApi.likeUnlikeBlogTelemetryEvent(isLiked, blogId);

    if (this.useTelemetrySdk) {
      $t.interact({
        type: 'blog',
        subtype: isLiked ? 'like' : 'unlike',
        id: 'button'
      });
    }
  }

  public upvoteDownvoteBlogTelemetryEvent(action: string, blogId: string) {
    this.telemetryApi.upvoteDownvoteBlogTelemetryEvent(action, blogId);

    if (this.useTelemetrySdk) {
      $t.interact({
        type: 'blog',
        subtype: action,
        id: 'button'
      });
    }
  }

  public likeUnlikeQnATelemetryEvent(isLiked: boolean, qnaId: string) {
    this.telemetryApi.likeUnlikeQnATelemetryEvent(isLiked, qnaId);

    if (this.useTelemetrySdk) {
      $t.interact({
        type: 'qna',
        subtype: isLiked ? 'like' : 'unlike',
        id: 'button'
      });
    }
  }

  public upvoteDownvoteQnATelemetryEvent(action: boolean, qnaId: string) {
    this.telemetryApi.likeUnlikeQnATelemetryEvent(action, qnaId);

    if (this.useTelemetrySdk) {
      $t.interact({
        type: 'qna',
        subtype: action,
        id: 'button'
      });
    }
  }

  public shareTelemetryEvent(cid: string, emailIds: string[], emailBody: string, type: string, contentIds?: string[]) {
    this.telemetryApi.shareTelemetryEvent(cid, emailIds, emailBody, type, contentIds);

    if (this.useTelemetrySdk) {
      $t.share({
        dir: 'Out',
        type: 'Link',
        items: emailIds.map((value: string) => ({
          obj: {
            id: contentIds,
            type: 'Content'
          },
          to: {
            id: value,
            type: 'User'
          }
        }))
      });
    }
  }

  public impressionTelemetryEvent(params) {
    this.telemetryApi.impressionTelemetryEvent(params);

    if (this.useTelemetrySdk) {

      // If previous page was content viewer, send end event for the content player
      if (this.telemetryState && this.telemetryState.player && this.telemetryState.player.contentId) {
        $t.end({
          contentId: this.telemetryState.player.contentId,
          type: 'player',
        });

        this.telemetryState.player = {
          contentId: undefined
        };
      }

      $t.impression({
        type: params.pageType,
        pageid: params.pageId
      });
    }
  }

  public errorTelemetryEvent(
    url: string,
    requestBody: any,
    contentId: string = '',
    errorMessage: string = '',
    statusCode: number = -1,
    responseTime: number = -1
  ) {
    this.telemetryApi.errorTelemetryEvent(url, requestBody, contentId, errorMessage, statusCode, responseTime);
  }

  public callTelemetryEvent(cid: string, phoneNo: string) {
    this.telemetryApi.callTelemetryEvent(cid, phoneNo);

    if (this.useTelemetrySdk) {
      $t.interact({ type: 'call', id: 'button' },
        {
          object: {
            contentId: cid,
            phone: phoneNo
          }
        }
      );
    }
  }

  public tncTelemetryEvent(isAccepted: boolean) {
    this.telemetryApi.tncTelemetryEvent(isAccepted);

    if (this.useTelemetrySdk) {
      $t.interact({ type: 'tnc', subtype: 'accept', id: 'button' });
    }

  }

  public interestTelemetryEvent(selectedInterests: any) {
    this.telemetryApi.interestAddedTelemetryEvent(selectedInterests);
  }

  public feedbackTelemetryEvent(type: string, contentId: string) {
    this.telemetryApi.feedbackSubmitTelemetryEvent(type, contentId);
  }

  public loginTelemetryEvent() {
    this.telemetryApi.loginTelemetryEvent();
  }

  public appDownloadTelemetryEvent() {
    this.telemetryApi.appDownloadTelemetryEvent();
  }

  public preferenceTelemetryEvent(
    changeEnv: 'navbar' | 'settings',
    changedProperty: 'language' | 'theme' | 'fontSize',
    previousStateVal: string,
    currentStateVal: string
  ) {
    this.telemetryApi.preferenceTelemetryEvent(changeEnv, changedProperty, previousStateVal, currentStateVal);
  }

  public goalTelemetryEvent(feature: string, goalId: string, contentIds: string[], mailIds: string[]) {
    this.telemetryApi.goalTelemetryEvent(feature, goalId, contentIds, mailIds);

    if (this.useTelemetrySdk) {
      $t.interact(
        {
          type: 'goal',
          subtype: feature,
          id: 'button'
        },
        {
          object: {
            goalId,
            contentIds
          }
        }
      );
    }
  }

  public liveTelemetryEvent(eventData: ILiveEventTelemetry) {
    eventData.lostFocus = this.hasLostFocus;
    if (eventData.lostFocus || eventData.isIdeal) {
      return;
    }
    this.telemetryApi.liveStreamTelemetryEvent(eventData);
  }

  public playlistTelemetryEvent(feature: string, playlistId: string, contentIds: string[], mailIds: string[]) {
    this.telemetryApi.playlistTelemetryEvent(feature, playlistId, contentIds);

    if (this.useTelemetrySdk) {
      $t.interact(
        { type: 'playlist', subtype: feature, id: 'button' },
        {
          object: {
            playlistId,
            contentIds
          }
        }
      );
    }
  }

  public submitExerciseTelemetryEvent(type, numCharacters, fileType, fileSize) {
    this.telemetryApi.submitExerciseTelemetryEvent(type, numCharacters, fileType, fileSize);
  }

  public submitExerciseFeedbackTelemetryEvent(submissionId, feedbackBy, feedbackDate) {
    this.telemetryApi.submitExerciseFeedbackTelemetryEvent(submissionId, feedbackBy, feedbackDate);
  }

  public viewExerciseFeedbackorSubmissionEvent(viewType, submissionId, submittedOn, feedbackId, feedbackBy) {
    this.telemetryApi.viewExerciseFeedbackorSubmissionEvent(viewType, submissionId, submittedOn, feedbackId, feedbackBy);
  }

  public playerTelemetryEvent(
    event: ICommEvent<
      | IVideoPluginTelemetry
      | IPdfPluginTelemetry
      | IQuizTelemetry
      | IHandsOnTelemetry
      | IIframeTelemetry
    >
  ) {
    event.data.lostFocus = this.hasLostFocus;
    this.lastEvent = event;
    // Transform this to the older version of telemetry
    /**
     * The current version has its state is COMM_STATE
     * and the previous version has it state in data.type
     */
    // console.warn('TELEMETRY SERVICE');
    if (event.state === 'RUNNING' && (this.hasLostFocus || event.data.isIdeal)) {
      return;
    }

    const edata = this.transformCommEvent(event);
    // console.log('FIRING PLAYER TELEMETRY', event);
    this.telemetryApi.playerRunningTelemetryEvent(
      event.data.identifier,
      event.data.mimeType,
      event.data.courseId,
      edata,
      event.data.force
    );

    if (this.useTelemetrySdk) {
      if (event.state === 'LOADED') {
        $t.start({}, event.data.identifier, '1.0', {
          type: 'player',
          mode: 'play',
          stageid: ''
        });

        this.telemetryState = {
          player: {
            contentId: event.data.identifier
          }
        };
      }

      if (event.state === 'RUNNING') {
        $t.heartbeat({
          edata: {
            contentId: event.data.identifier
          }
        });
      }
    }
  }

  private focusChangeEvent() {
    if (this.lastEvent) {
      const event: ICommEvent<
        | IVideoPluginTelemetry
        | IPdfPluginTelemetry
        | IQuizTelemetry
        | IIframeTelemetry
      > = {
        ...this.lastEvent,
        state: this.hasLostFocus ? 'FOCUS_LOST' : 'FOCUS_GAIN',
        data: {
          ...this.lastEvent.data,
          lostFocus: this.hasLostFocus
        }
      };
      this.playerTelemetryEvent(event);
    }
  }

  private focusChangeEventListener() {
    fromEvent(window, 'focus').subscribe(() => {
      this.hasLostFocus = false;
      this.focusChangeEvent();
    });
    fromEvent(window, 'blur').subscribe(() => {
      this.hasLostFocus = true;
      this.focusChangeEvent();
    });
  }

  private addTelemetryGlobalEventHandler() {
    const TELEMETRY_EVENT_TYPE: COMM_EVENT_TYPES = 'TELEMETRY';
    fromEvent<MessageEvent>(window, 'message')
      .pipe(
        filter(event => event && event.data && event.data.type === TELEMETRY_EVENT_TYPE),
        map(event => event.data)
      )
      .subscribe(event => {
        this.playerTelemetryEvent(event);
      });
  }

  private transformCommEvent(
    event: ICommEvent<
      | IVideoPluginTelemetry
      | IPdfPluginTelemetry
      | IQuizTelemetry
      | IIframeTelemetry
    >
  ) {
    if (event.data.courseId === event.data.identifier) {
      event.data.courseId = null;
    }
    const transformedEvent = {
      data: event.data,
      type: COMM_STATE_TO_TYPE[event.state] || event.state.toLowerCase(),
      plugin: event.plugin
    };

    // console.log('transformed event', transformedEvent);
    return transformedEvent;
  }
}
