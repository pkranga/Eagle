/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NsContent } from '@ws-widget/collection'

export namespace NsAppToc {
  export interface IWsTocResponse {
    content: NsContent.IContent | null
    errorCode: EWsTocErrorCode | null
  }

  export enum EWsTocErrorCode {
    API_FAILURE = 'API_FAILURE',
    INVALID_DATA = 'INVALID_DATA',
    NO_DATA = 'NO_DATA',
  }

  export interface ITocBanner {
    analytics: string
    overview: string
    contents: string
    [key: string]: string
  }

  export interface ITocStructure {
    assessment: number
    course: number
    handsOn: number
    interactiveVideo: number
    learningModule: number
    other: number
    pdf: number
    podcast: number
    quiz: number
    video: number
    webModule: number
    webPage: number
    youtube: number
    [key: string]: number
  }
}

export namespace NsCohorts {
  export enum ECohortTypes {
    ACTIVE_USERS = 'activeusers',
    COMMON_GOALS = 'commongoals',
    AUTHORS = 'authors',
    EDUCATORS = 'educators',
    TOP_PERFORMERS = 'top-performers',
  }
  export interface ICohortsContent {
    first_name: string
    last_name: string
    email: string
    desc: string
    uid: string
    last_ts: number
    phone_No: string
    city: string
    userLocation?: string
    // below for UI only
    // mailContent?: ISendMailMeta;
  }

  // export interface ISendMailMeta {
  //   firstName?: string;
  //   lastName?: string;
  //   email: string;
  // }

  // export interface ICohortsUserData {
  //   first_name: string
  //   last_name: string
  // }

  export interface ICohortsGroupUsers {
    first_name: string
    last_name: string
    wid: string
    email: string
    // for ui only
    name: string
  }
}
