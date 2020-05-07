/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
export interface ICohortsContent {
  first_name: string;
  last_name: string;
  email: string;
  desc: string;
  uid: string;
  last_ts: number;
  phone_No: string;
  city: string;
  userLocation?: string;
  // below for UI only
  mailContent?: ISendMailMeta;
}

export interface ISendMailMeta {
  firstName?: string;
  lastName?: string;
  email: string;
}

export interface ICohortsActiveUsers {
  active_users: ICohortsContent[];
  similar_goals_users: ICohortsContent[];
}

export interface ICohortsSMEs {
  educators: ICohortsContent[];
  highPerfomers: ICohortsContent[];
  authors: ICohortsContent[];
}

export interface ICohorts {
  type: string;
  name: string;
  contents: ICohortsContent[];
}

export interface ICohortsActiveUsersApiResponse {
  response: ICohortsActiveUsers;
}
export interface ICohortsSMEsApiResponse {
  response: ICohortsSMEs;
}
