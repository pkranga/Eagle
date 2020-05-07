/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { slag, slagV2 } from '../constants/apiEndpoints.constant';
import { ILiveEventTelemetry } from '../models/comm-events.model';
import { IRecommendationRequest } from '../models/telemetry.model';
import { AuthService } from '../services/auth.service';
import { ConfigService } from '../services/config.service';

const LOCATION = 'NA';
const apiEndpoints = {
  TELEMETRY: `${slagV2}/telemetry`, // #POST
  TELEMETRY_PLAYER: `${slag}/telemetry/player`
};
@Injectable({
  providedIn: 'root'
})
export class TelemetryApiService implements OnDestroy {
  lastPageUrl = '';
  lastPageId = '';

  BUFFER_SIZE = 10;
  playerEventsBuffer: any[] = [];
  playerEventsFailSafeBuffer: any[] = [];
  isFiringPlayerTelemetry = false;

  constructor(private http: HttpClient, private auth: AuthService, private configSvc: ConfigService) { }

  fpTelemetryEvent(eid, type, url, title, resId) {
    const event = {
      type,
      plugin: 'webModule',
      data: {
        slideIndex: 0,
        title,
        url
      }
    };

    const eventRunning = {
      type,
      plugin: 'webModule',
      data: {
        slideIndex: 0,
        title,
        url,
        isIdeal: false,
        lostFocus: false
      }
    };

    const telemetryEvent = {
      eid,
      ver: '2.0',
      uid: this.auth.userId,
      sid: this.auth.sessionId,
      mid: '',
      ets: new Date().getTime(),
      courseid: '',
      restype: 'application/web-module',
      resid: resId,
      progress: null,
      duration: 0,
      bodhiuser: {
        email: this.auth.userEmail,
        location: LOCATION,
        unit: ''
      },
      playerdata: type === 'running' ? eventRunning : event,
      devicedata: { UA: navigator.userAgent }
    };
    // console.log('Player Telemetry > ', telemetryEvent)
    this._fireTelemetryEvent(telemetryEvent);
  }

  loginTelemetryEvent() {
    const eventBody = {
      eid: 'CP_LOGIN',
      ets: new Date().getTime(),
      ver: '1.0',
      mid: '',
      channel: '',
      sid: this.auth.sessionId,
      uid: this.auth.userId,
      did: '',
      pdata: {
        id: 'sunbird.portal',
        ver: '1.0'
      },
      cdata: [
        {
          id: '',
          type: ''
        }
      ],
      etags: {
        app: [],
        partner: [],
        dims: ['']
      },
      context: {
        sid: this.auth.sessionId
      },
      edata: {
        eks: {
          authprovider: 'keycloak',
          uaspec: {
            agent: '',
            ver: '',
            system: '',
            platform: '',
            raw: navigator.userAgent
          }
        }
      },
      bodhiuser: {
        email: this.auth.userEmail,
        location: LOCATION,
        unit: ''
      },
      bodhidata: {
        devicespec: {
          devicetype: 'mobile/desktop',
          os: 'Android Oreo 8.0',
          make: 'OnePlus 5T',
          id: 'physical device ID'
        }
      },
      devicedata: { UA: navigator.userAgent }
    };

    this._fireTelemetryEvent(eventBody);
  }

  notificationTelemetryEvent(
    action: string,
    numUnread?: number,
    notificationTitle?: string,
    notificationDate?: string
  ) {
    const eventBody = {
      eid: 'CP_NOTIFICATION',
      ets: new Date().getTime(),
      ver: '3.0',
      mid: '',

      actor: {
        id: this.auth.userId,
        email: this.auth.userEmail,
        type: navigator.userAgent
      },

      edata: {
        action,
        num_unread: numUnread,
        notification_title: notificationTitle,
        notification_received: notificationDate
      }
    };
    this._fireTelemetryEvent(eventBody);
  }

  likeUnlikeTelemetryEvent(isLiked: boolean, contentId: string) {
    const eventBody = {
      eid: 'CP_LIKE',
      ets: new Date().getTime(),
      ver: '3.0',
      mid: '',

      actor: {
        id: this.auth.userId,
        email: this.auth.userEmail,
        type: navigator.userAgent
      },

      context: {
        channel: '',
        env: 'portal',
        sid: this.auth.sessionId
      },

      edata: {
        type: isLiked ? 'LIKE' : 'UNLIKE', // like or unlike
        contentId
      }
    };
    this._fireTelemetryEvent(eventBody);
  }

  likeUnlikeBlogTelemetryEvent(isLiked: boolean, blogId: string) {
    const eventBody = {
      eid: 'CP_BLOG_LIKE',
      ets: new Date().getTime(),
      ver: '3.0',
      mid: '',

      actor: {
        id: this.auth.userId,
        email: this.auth.userEmail,
        type: navigator.userAgent
      },

      context: {
        channel: '',
        env: 'portal',
        sid: this.auth.sessionId
      },

      edata: {
        type: isLiked ? 'LIKE' : 'UNLIKE', // like or unlike
        blogId
      }
    };
    this._fireTelemetryEvent(eventBody);
  }

  upvoteDownvoteBlogTelemetryEvent(action, blogId) {
    const eventBody = {
      eid: 'CP_BLOG_VOTE',
      ets: new Date().getTime(),
      ver: '3.0',
      mid: '',

      actor: {
        id: this.auth.userId,
        email: this.auth.userEmail,
        type: navigator.userAgent
      },

      context: {
        channel: '',
        env: 'portal',
        sid: this.auth.sessionId
      },

      edata: {
        type: action, // upvote or downvote
        blogId
      }
    };
    this._fireTelemetryEvent(eventBody);
  }

  likeUnlikeQnATelemetryEvent(isLiked: boolean, qnaId: string) {
    const eventBody = {
      eid: 'CP_QNA_LIKE',
      ets: new Date().getTime(),
      ver: '3.0',
      mid: '',

      actor: {
        id: this.auth.userId,
        email: this.auth.userEmail,
        type: navigator.userAgent
      },

      context: {
        channel: '',
        env: 'portal',
        sid: this.auth.sessionId
      },

      edata: {
        type: isLiked ? 'LIKE' : 'UNLIKE', // like or unlike
        qnaId
      }
    };
    this._fireTelemetryEvent(eventBody);
  }

  upvoteDownvoteQnATelemetryEvent(action, qnaId) {
    const eventBody = {
      eid: 'CP_BLOG_VOTE',
      ets: new Date().getTime(),
      ver: '3.0',
      mid: '',

      actor: {
        id: this.auth.userId,
        email: this.auth.userEmail,
        type: navigator.userAgent
      },

      context: {
        channel: '',
        env: 'portal',
        sid: this.auth.sessionId
      },

      edata: {
        type: action, // upvote or downvote
        qnaId
      }
    };
    this._fireTelemetryEvent(eventBody);
  }

  feedbackSubmitTelemetryEvent(type: string, contentId?: string) {
    const eventBody = {
      eid: 'CP_FEEDBACK_SUBMIT',
      ets: new Date().getTime(),
      ver: '3.0',
      mid: '',

      actor: {
        id: this.auth.userId,
        email: this.auth.userEmail,
        type: navigator.userAgent
      },

      context: {
        channel: '',
        env: 'portal',
        sid: this.auth.sessionId
      },

      edata: {
        type: type.toLocaleUpperCase(), // application, content, bug
        contentId
      }
    };
    this._fireTelemetryEvent(eventBody);
  }

  appDownloadTelemetryEvent(geoLocation?: string) {
    const eventBody = {
      eid: 'CP_DOWNLOAD_APP',
      sid: this.auth.sessionId,
      ets: new Date().getTime(),
      ver: '1.0',
      mid: '',
      channel: '',
      uid: this.auth.userId,
      did: '',
      appver: '1.0.0',
      appos: 'android',
      bodhiuser: {
        email: this.auth.userEmail,
        location: geoLocation ? geoLocation : LOCATION,
        unit: ''
      },
      devicedata: { UA: navigator.userAgent }
    };

    this._fireTelemetryEvent(eventBody);
  }

  shareTelemetryEvent(
    cid: string,
    emailIds: string[],
    emailBody: string,
    type: string,
    contentIds?: string[]
  ) {
    const eventBody = {
      eid: type,
      sid: this.auth.sessionId,
      ets: new Date().getTime(),
      ver: '1.0',
      mid: '',
      channel: '',
      uid: this.auth.userId,
      did: '',
      bodhiuser: {
        email: this.auth.userEmail,
        location: LOCATION,
        unit: ''
      },
      bodhidata: {
        contentId: cid,
        emails: emailIds,
        emailBody,
        contentIds
      },
      devicedata: { UA: navigator.userAgent }
    };

    this._fireTelemetryEvent(eventBody);
  }

  callTelemetryEvent(cid: string, phoneNo: string) {
    const eventBody = {
      eid: 'CP_SME_CALL',
      sid: this.auth.sessionId,
      ets: new Date().getTime(),
      ver: '1.0',
      mid: '',
      channel: '',
      uid: this.auth.userId,
      did: '',
      bodhiuser: {
        email: this.auth.userEmail,
        location: LOCATION,
        unit: ''
      },
      bodhidata: {
        contentId: cid,
        // emailId: emailId,
        phoneNo
      },
      devicedata: { UA: navigator.userAgent }
    };
    // console.log('event: ', eventBody)
    this._fireTelemetryEvent(eventBody);
  }

  recommendationTelemetryEvent(request: IRecommendationRequest) {
    const eventBody = {
      eid: 'CP_RECOMMENDATION',
      sid: this.auth.sessionId,
      ets: new Date().getTime(),
      ver: '1.0',
      mid: '',
      channel: '',
      uid: this.auth.userId,
      did: '',
      bodhiuser: {
        email: this.auth.userEmail,
        location: LOCATION,
        unit: ''
      },
      bodhidata: {
        type: request.type,
        input: request.input,
        recommended: request.recommended,
        clicked: request.clicked,
        position: request.position
      },
      devicedata: { UA: navigator.userAgent }
    };

    this._fireTelemetryEvent(eventBody);
  }

  impressionTelemetryEvent(params) {
    const eventBody = {
      eid: 'CP_IMPRESSION',
      ets: new Date().getTime(),
      ver: '1.0',
      mid: '',
      channel: '',
      sid: this.auth.sessionId,
      uid: this.auth.userId,
      did: '',
      pdata: {
        id: 'lex.portal',
        ver: '1.0'
      },
      cdata: [
        {
          id: '',
          type: ''
        }
      ],
      etags: {
        app: [],
        partner: [],
        dims: []
      },
      context: {
        sid: this.auth.sessionId
      },
      edata: {
        eks: {
          env: params.pageEnv || this.configSvc.instanceConfig.platform.appName.toUpperCase(),
          type: params.pageType,
          pageid: params.pageId,
          id: params.contentId,
          name: params.contentName,
          url: params.pageUrl
        }
      },
      bodhiuser: {
        email: this.auth.userEmail,
        location: LOCATION,
        unit: ''
      },
      bodhidata: {
        pageinf: {
          env: params.pageEnv,
          type: params.pageType,
          pageid: params.pageId,
          id: params.contentId,
          name: params.contentName,
          url: params.pageUrl,
          pagedata: []
        },
        lastpageinf: {
          pageid: this.lastPageId,
          pagesection: '',
          url: this.lastPageUrl,
          pagedata: []
        }
      },
      devicedata: { UA: navigator.userAgent }
    };

    this.lastPageId = params.pageId;
    this.lastPageUrl = params.pageUrl;

    this._fireTelemetryEvent(eventBody);
  }

  goalTelemetryEvent(feature, goalId, contentIds, mailIds?: string[]) {
    // feature: 'added' | 'updated' | 'removed' | 'progress'

    const goalsEvent = {
      eid: 'CP_GOAL',
      ets: new Date().getTime(),
      ver: '1.0',
      mid: '',
      sid: this.auth.sessionId,
      uid: this.auth.userId,
      did: '',
      bodhiuser: {
        email: this.auth.userEmail,
        location: LOCATION,
        unit: ''
      },
      bodhidata: {
        feature,
        goalId,
        contentIds,
        mailIds: mailIds ? mailIds : undefined
      },
      devicedata: { UA: navigator.userAgent }
    };

    this._fireTelemetryEvent(goalsEvent);
  }

  preferenceTelemetryEvent(
    changeEnv: 'navbar' | 'settings',
    changedProperty: 'language' | 'theme' | 'fontSize',
    previousStateVal: string,
    currentStateVal: string
  ) {
    const preferenceEvent = {
      eid: 'CP_PREFERENCE',
      ets: new Date().getTime(),
      ver: '3.0',

      actor: {
        id: this.auth.userId,
        type: 'User',
        devicedata: { UA: navigator.userAgent }
      },

      context: {
        channel: this.configSvc.instanceConfig.platform.platform, // e.g. lex, amfam, siemens etc.
        env: changeEnv, // from where the pref was changed, from the navbar or settings page
        sid: this.auth.sessionId,
      },

      edata: {
        props: [changedProperty], // list of fields that were changed, eg. language, theme, fontSize
        state: {}, // current state of the preference object
        prevstate: {} // optional, previous state of preference object
      }
    };

    this._fireTelemetryEvent(preferenceEvent);

  }

  playlistTelemetryEvent(feature, playlistId, contentIds) {
    // feature: 'added' | 'updated' | 'removed' | 'progress'
    const playlistEvent = {
      eid: 'CP_PLAYLIST',
      ets: new Date().getTime(),
      ver: '1.0',
      mid: '',
      sid: this.auth.sessionId,
      uid: this.auth.userId,
      did: '',
      bodhiuser: {
        email: this.auth.userEmail,
        location: LOCATION,
        unit: ''
      },
      bodhidata: {
        feature,
        playlistId,
        contentIds
      },
      devicedata: { UA: navigator.userAgent }
    };

    this._fireTelemetryEvent(playlistEvent);
  }

  tncTelemetryEvent(tncAccepted) {
    const telemetryEvent = {
      eid: 'CP_TNC',
      ets: new Date().getTime(),
      ver: '1.0',
      mid: '',
      sid: this.auth.sessionId,
      uid: this.auth.userId,
      did: '',
      bodhiuser: {
        email: this.auth.userEmail,
        location: LOCATION,
        unit: ''
      },
      bodhidata: {
        tncAccepted
      },
      devicedata: { UA: navigator.userAgent }
    };

    this._fireTelemetryEvent(telemetryEvent);
  }

  interestAddedTelemetryEvent(selectedInterests) {
    const telemetryEvent = {
      eid: 'CP_INTERESTS_SUBMIT',
      ets: new Date().getTime(),
      ver: '1.0',
      mid: '',
      channel: '',
      sid: this.auth.sessionId,
      uid: this.auth.userId,
      did: '',
      pdata: {
        id: 'sunbird.portal',
        ver: '1.0'
      },
      cdata: [
        {
          id: '',
          type: ''
        }
      ],
      etags: {
        app: [],
        partner: [],
        dims: ['505c7c48ac6dc1edc9b08f21db5a571d']
      },
      context: {
        sid: this.auth.sessionId
      },
      edata: {
        eks: {}
      },
      bodhiuser: {
        email: this.auth.userEmail,
        location: LOCATION,
        unit: ''
      },
      bodhidata: {
        numintersts: selectedInterests.length,
        interestlist: selectedInterests
      },
      devicedata: { UA: navigator.userAgent }
    };
    this._fireTelemetryEvent(telemetryEvent);
  }

  liveStreamTelemetryEvent(eventData: ILiveEventTelemetry) {
    const liveStreamEvent = {
      eid: 'CP_LIVE_STREAM',
      ets: new Date().getTime(),
      ver: '3.0',
      mid: '',

      actor: {
        id: this.auth.userEmail,
        type: navigator.userAgent
      },

      context: {
        channel: '',
        env: '',
        sid: this.auth.sessionId
      },

      edata: {
        ...eventData
      }
    };

    this._fireTelemetryEvent(liveStreamEvent);
  }

  submitExerciseTelemetryEvent(type, numCharacters, fileType, fileSize) {
    const submitExerciseFeedbackEvent = {
      eid: 'CP_SUBMIT_EXERCISE',
      ets: new Date().getTime(),
      ver: '3.0',

      actor: {
        id: this.auth.userId,
        type: 'User',
        devicedata: { UA: navigator.userAgent }
      },

      context: {
        channel: this.configSvc.instanceConfig.platform.platform,
        env: 'exercise',
        sid: this.auth.sessionId,
      },

      edata: {
        type,
        numCharacters,
        fileType,
        fileSize
      }
    };
    this._fireTelemetryEvent(submitExerciseFeedbackEvent);
  }

  submitExerciseFeedbackTelemetryEvent(submissionId, feedbackBy, feedbackDate) {
    const submitExerciseFeedbackEvent = {
      eid: 'CP_SUBMIT_FEEDBACK',
      ets: new Date().getTime(),
      ver: '3.0',

      actor: {
        id: this.auth.userId,
        type: 'User',
        devicedata: { UA: navigator.userAgent }
      },

      context: {
        channel: this.configSvc.instanceConfig.platform.platform,
        env: 'exercise',
        sid: this.auth.sessionId,
      },

      edata: {
        submissionId,
        feedbackBy,
        feedbackDate
      }
    };
    this._fireTelemetryEvent(submitExerciseFeedbackEvent);
  }

  viewExerciseFeedbackorSubmissionEvent(viewType, submissionId, submittedOn, feedbackId, feedbackBy) {
    const viewExerciseFeedbackorSubmissionEvent = {
      eid: viewType === 'viewSubmission' ? 'CP_VIEW_SUBMISSION' : 'CP_VIEW_FEEDBACK',
      ets: new Date().getTime(),
      ver: '3.0',

      actor: {
        id: this.auth.userId,
        type: 'User',
        devicedata: { UA: navigator.userAgent }
      },

      context: {
        channel: this.configSvc.instanceConfig.platform.platform,
        env: 'exercise',
        sid: this.auth.sessionId,
      },

      edata: {
        submissionId,
        submittedOn,
        feedbackId: feedbackId ? feedbackId : null,
        feedbackBy: feedbackBy ? feedbackBy : null
      }
    };

    this._fireTelemetryEvent(viewExerciseFeedbackorSubmissionEvent);
  }

  public errorTelemetryEvent(
    url: string,
    requestBody: any,
    contentId: string = '',
    errorMessage: string = '',
    statusCode: number = -1,
    responseTime: number = -1
  ) {
    const edata = {
      url,
      requestBody,
      contentId,
      errorMessage,
      statusCode,
      responseTime
    };

    const eventBody = {
      eid: 'CP_ERROR',
      ets: new Date().getTime(),
      ver: '3.0',
      mid: '',

      actor: {
        id: this.auth.userId,
        type: navigator.userAgent
      },

      context: {
        channel: '',
        env: '',
        sid: this.auth.sessionId
      },
      edata
    };

    this._fireTelemetryEvent(eventBody);
  }

  playerRunningTelemetryEvent(
    resourceId: string,
    mimeType: string,
    courseId: string,
    event,
    force: boolean = false
  ) {
    const playerEvent = {
      eid: 'CP_ACTIVITY',
      edata: {
        timestamp: new Date().getTime(),
        resourceId,
        mimeType,
        courseId,
        playerdata: event,
        deviceData: { UA: navigator.userAgent }
      }
    };
    this._addPlayerTelemetryEvent(playerEvent, force);
  }

  private _addPlayerTelemetryEvent(telemetryEvent, force: boolean = false) {
    this.playerEventsBuffer.push(telemetryEvent);
    if (force || (this.playerEventsBuffer.length >= this.BUFFER_SIZE)) {
      if (!this.isFiringPlayerTelemetry && this.playerEventsFailSafeBuffer.length) {
        this.playerEventsBuffer = [...this.playerEventsBuffer, ...this.playerEventsFailSafeBuffer];
        this.playerEventsFailSafeBuffer = [...this.playerEventsBuffer];
      } else if (!this.isFiringPlayerTelemetry && !this.playerEventsFailSafeBuffer.length) {
        this.playerEventsFailSafeBuffer = [...this.playerEventsBuffer];
      } else if (this.isFiringPlayerTelemetry && this.playerEventsFailSafeBuffer.length) {
        this.playerEventsFailSafeBuffer = [...this.playerEventsFailSafeBuffer, ...this.playerEventsBuffer];
      }
      this._firePlayerTelemetryEvent();
    }
  }

  private _firePlayerTelemetryEvent() {
    if (!this.playerEventsBuffer.length) {
      return;
    }
    const eventBody = {
      id: 'lex.telemetry',
      ver: '2.0',
      ts: new Date().toISOString(),
      params: {
        requesterId: this.auth.userId,
        did: this.configSvc.preLoginConfig.keycloak.clientId,
        key: '13405d54-85b4-341b-da2f-eb6b9e546fff',
        // msgid: uuid4.generate()
        msgid: 'DUMMY-UUID'
      },
      events: this.playerEventsBuffer
    };

    this.playerEventsBuffer = [];
    this.isFiringPlayerTelemetry = true;
    this.http.post<any>(apiEndpoints.TELEMETRY_PLAYER, eventBody).subscribe(
      msg => {
        this.isFiringPlayerTelemetry = false;
        this.playerEventsFailSafeBuffer = [];
      },
      err => {
        this.isFiringPlayerTelemetry = false;
      }
    );
  }

  private _fireTelemetryEvent(telemetryEvent) {
    const eventBody = {
      id: 'lex.telemetry',
      ver: '2.0',
      ts: new Date().toISOString(),
      params: {
        requesterId: this.auth.userId,
        did: this.configSvc.preLoginConfig.keycloak.clientId,
        key: '13405d54-85b4-341b-da2f-eb6b9e546fff',
        // msgid: uuid4.generate()
        msgid: 'DUMMY-UUID'
      },
      events: [telemetryEvent]
    };

    this.http.post<any>(apiEndpoints.TELEMETRY, eventBody).subscribe();
  }

  ngOnDestroy(): void {
    this._firePlayerTelemetryEvent();
  }
}
