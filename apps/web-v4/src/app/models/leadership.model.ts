/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { IInstanceConfigBannerUnit } from 'src/app/models/instanceConfig.model';
import { ISearchRequest } from 'src/app/models/searchResponse.model';

export interface ILeader {
  designation: string;
  disabled?: boolean;
  emailId: string;
  link: string;
  name: string;
  profileImage: string;
  role: string;
}

export interface ILeaderConfig {
  ravi: ILeaderData;
  mohit: ILeaderData;
}
export interface ILeaderData {
  tabs: ILeaderTabs[];
  mailMeta: ILeaderMailMeta;
  profile: ILeader;
  about: string;
  twitterUrl: string;
  articles: ILeaderArticle[];
  trailblazersSearchRequest: ISearchRequest;
  communicationSearchRequest: ISearchRequest;
  discussId: string;
}

export interface ILeaderTabs {
  title: string;
  banners: IInstanceConfigBannerUnit[];
}

export interface ILeaderArticle {
  title: string;
  postedOn: string;
  abstract: string;
  iconUrl: string;
  url: string;
}

export interface ILeaderMailMeta {
  subject: string;
  placeholder: string;
  emailTo: string;
  name: string;
}
