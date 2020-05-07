/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { ISearchRequest } from './searchResponse.model';

export interface IToDoListResponse {
  name: string;
  identifier: string;
  isChecked: boolean;
}

export interface IChangeChampions {
  firstName: string;
  lastName: string;
  emailId: string;
  desc: string;
}
export interface IEvent {
  eventName: string;
  eventDate: string;
  eventTime: string;
}

export interface IWhatNextEvent {
  eventName: string;
  eventDesc?: string;
  items?: string[];
}

export interface IMail {
  mailTitle: string;
  mailDate: string;
  mailContentDownloadUrl: string;
}

export interface IReqData {
  title: string;
  searchQuery: ISearchRequest;
}
export interface IDashboard {
  name: string;
  url?: string;
}
export interface ISentientProgram {
  title: string;
  iconName: string;
}
