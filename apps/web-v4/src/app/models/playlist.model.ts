/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
export interface IUserAllPlayList {
  shared: IUserPlayList[];
  user: IUserPlayList[];
}
export interface IUserPlayList {
  playlist_id: string;
  playlist_title: string;
  isshared: number;
  resource: IPlayListContent[];
  resource_ids: string[];
  shared_by: string;
  source_playlist_id: string;
  user_email: string;
  visibility: string;
  created_on: number;
  shared_with: string;
  shared_on: number;
  isChecked: boolean;
}
export interface ISharePlayList {
  playlist_id: string;
  playlist_title: string;
  shared_with: string[];
  resource_ids: string[];
}

export interface IPlayListContent {
  resource_id: string;
  resource_name: string;
  time_duration: string; // CHECK_THIS
  contentType: string;
  mimeType: string;
}
export interface IPlayListSyncApiRequest {
  user_playlist_id: string;
  source_playlist_id: string;
  shared_by: string;
}

export interface IUserPlaylistApiResponse {
  response: IUserPlayList[];
}
export interface IUserPlaylistSync {
  notInShared: string[];
  notInUser: string[];
  isSame: boolean;
  user_resources: IPlayListContent[];
  shared_resources: IPlayListContent[];
}
export interface IUserPlaylistSyncApiResponse {
  response: IUserPlaylistSync;
}
export interface IPlaylistAddUpdateRequest {
  request: IUserPlaylistAddUpdateRequest;
}
export interface IUserPlaylistAddUpdateRequest {
  playlist_id?: string;
  playlist_title: string;
  isShared?: number;
  user_action: 'create' | string;
  resource_ids: string[];
  changed_resources?: string[];
  shared_by?: string;
  source_playlist_id?: string;
}
export interface IPlaylistAddUpdateResponse {
  response: string;
  playlist_id: string;
}
export interface IPlaylistRemoveRequest {
  playlist_id: string;
}
export interface IPlaylistRemoveResponse {
  response: string;
}
export interface IPlaylistShareResponse {
  response: IPlaylistShareResponseObj;
}
export interface IPlaylistShareResponseObj {
  result: string;
  InvalidUsers: string[];
}
