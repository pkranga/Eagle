/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { IThemeColor } from './instanceConfig.model';

export type COMM_EVENT_TYPES =
  | 'APP_LOADED'
  | 'NAVIGATION_REQUEST'
  | 'NAVIGATION_NOTIFY'
  | 'AUTH_REQUEST'
  | 'AUTH_RESPONSE'
  | 'THEME_REQUEST'
  | 'THEME_RESPONSE'
  | 'DATA_REQUEST'
  | 'DATA_RESPONSE'
  | 'API_REQUEST'
  | 'API_RESPONSE'
  | 'TELEMETRY'
  | 'DOWNLOAD_ACTION'
  | 'OFFLINE_API_DATA'
  | 'OFFLINE_THEME_UPDATE'
  | 'OFFLINE_LOGO_UPDATE'
  | 'DOWNLOAD_IDS'
  | 'RELOAD';

export type OFFLINE_API_DATA_TYPES = 'CONTINUE_LEARNING' | 'TELEMETRY' | 'QUIZ_SUBMIT';

export type MOBILE_COMM_EVENT_DATA_TYPES = 'APP_DATA' | 'CONTENT_MANIFEST_REQUEST';

export type COMM_STATES =
  | 'NONE'
  | 'LOADED'
  | 'RUNNING'
  | 'UNSTARTED'
  | 'CUED'
  | 'BUFFERING'
  | 'PLAYING'
  | 'PAUSED'
  | 'ENDED'
  | 'SKIPPED'
  | 'SLIDE_CHANGE'
  | 'UNLOADED'
  | 'SUBMIT'
  | 'DONE'
  | 'FOCUS_LOST'
  | 'FOCUS_GAIN';

export type COMM_EVENT_APP_TYPE =
  | 'WEB_PORTAL'
  | 'WEB_PLAYER'
  | 'WEB_PLAYER_PLUGIN'
  | 'OFFLINE_APP'
  | 'ILP_FP'
  | 'MOBILE_APP';

export type PLAYER_PLUGIN =
  | 'NONE'
  | 'video'
  | 'quiz'
  | 'pdf'
  | 'audio'
  | 'youtube'
  | 'handson'
  | 'classdiagram'
  | 'certifications'
  | 'webModule'
  | 'iframe'
  | 'ilpfp'
  | 'iap';

export interface ICommEvent<T> {
  app: COMM_EVENT_APP_TYPE;
  type: COMM_EVENT_TYPES;
  state: COMM_STATES;
  plugin: PLAYER_PLUGIN;
  data: T;
  message?: IEventMessage;
  source?: string;
}

export interface IEventMessage {
  type: 'INFO' | 'LOG' | 'WARN' | 'ERROR';
  text: string;
}

export interface IThemeRequest {
  id: string;
}
export interface IThemeResponse {
  id: string;
  theme: ITheme;
}

export interface ITheme {
  themeName: string;
  themeDetails: IThemeColor;
}

export interface IAuthRequest {
  id: string;
}
export interface IAuthResponse {
  id: string;
  token: string;
}

export interface IDataRequest {
  id: string;
  contentId: string;
}
export type TDataError =
  | 'INVALID_RESOURCE'
  | 'INVALID_MIME'
  | 'NO_CONTENT'
  | 'MANIFEST_FETCH_FAILED'
  | 'MIME_CONTENT_MISMATCH'
  | 'UNKNOWN_ERROR'
  | 'COOKIE_SET_FAILURE'
  | 'CERTIFICATION_NO_ACCESS';
export interface IDataResponse<T> {
  id: string;
  data: T;
  error?: TDataError;
}

export interface IMobileAppDataResponse<T> {
  id: string;
  type: 'CONTENT_MANIFEST_RESPONSE' | 'APP_DATA' | 'DOWNLOADS';
  response: T;
  error?: TDataError;
}

export interface INavigationData {
  state: INavigationState;
  stateData: INavigationStateData;
}
export interface INavigationStateData {
  params?: string[];
  queryParams: {
    preserve: boolean;
  };
  target: 'self' | 'parent' | '_blank';
}
export type INavigationState = 'HOME' | 'VIEWER' | 'PLAYER' | 'TOC' | 'BACK' | 'CERTIFICATION';

export interface IApiRequest {
  id: string;
  method: 'GET' | 'POST' | 'DELETE' | 'PATCH' | 'PUT';
  url: string;
  headers?: {};
  tokenType: 'NONE' | 'KEYCLOAK' | 'MS';
  data?: any;
}

export interface IApiResponse {
  id: string;
  statusCode: number;
  response: any;
}

export interface IAmpDataResponse {
  manifest: string;
  token: string;
  posterImage: string;
}

// Telemetry events
export interface IPdfPluginTelemetry {
  identifier: string;
  courseId: string;
  mimeType: string;
  pageNumber: number;
  total: number;
  isCompleted: boolean;
  force?: boolean;
  isIdeal?: boolean;
  lostFocus?: boolean;
}

export interface IVideoPluginTelemetry {
  identifier: string;
  courseId: string;
  mimeType: string;
  duration: number;
  isIdeal: boolean;
  lostFocus?: boolean;
  isCompleted: boolean;
  force?: boolean;
}

export interface IQuizTelemetry {
  identifier: string;
  courseId: string;
  mimeType: string;
  questionIndex?: number;
  isSubmitted?: boolean;
  isCompleted?: boolean;
  force?: boolean;
  isIdeal?: boolean;
  lostFocus?: boolean;
  details?: any;
}

export interface IHandsOnTelemetry {
  identifier: string;
  courseId: string;
  mimeType: string;
  isSubmitted: boolean;
  force?: boolean;
  isIdeal?: boolean;
  lostFocus?: boolean;
}

export interface IClassDiagramTelemetry {
  identifier: string;
  courseId: string;
  mimeType: string;
  isSubmitted: boolean;
  force?: boolean;
  isIdeal?: boolean;
  lostFocus?: boolean;
}

export interface IIframeTelemetry {
  identifier: string;
  courseId: string;
  mimeType: string;
  url: string;
  isCompleted: boolean;
  force?: boolean;
  isIdeal?: boolean;
  lostFocus?: boolean;
}

export interface ILiveEventTelemetry {
  eventUrl: string;
  state: COMM_STATES;
  force?: boolean;
  isIdeal?: boolean;
  lostFocus?: boolean;
}

export type TelemetryEvents = IPdfPluginTelemetry | IVideoPluginTelemetry | IQuizTelemetry | IIframeTelemetry;

export interface IUserData {
  name: string;
  email: string;
}
