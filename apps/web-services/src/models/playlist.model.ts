/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { EMimeTypes, TContentType } from './content.model'

export enum EPlaylistTypes {
  ME = 'user',
  SHARED = 'share',
  PENDING = 'pending',
}

export interface IPlaylistSbExtBase {
  user_email: string
  isShared: number
  visibility: string
  created_on: string
  playlist_title: string
  source_playlist_id?: string
  playlist_id: string
  shared_by?: {
    user_email: string
    user_id: string
    name: string
  }
  resource_ids: string[]
  shared_with: string
  shared_on: string
}

export interface IPlaylistSbExtV2 extends IPlaylistSbExtBase {
  resource: IPlaylistResource[]
}

export interface IPlaylistSbExt extends IPlaylistSbExtBase {
  resource: IResourceSbExt[]
}

export interface IResourceSbExt {
  appIcon: string
  resource_id: string
  time_duration: number
  mimeType: EMimeTypes
  resource_name: string
  contentType: TContentType
  resourceType: string
}

export interface IPlaylistSbExtResponse {
  result: {
    response: IPlaylistSbExtV2[]
  }
}

export interface IPlaylistSbExtRequest {
  changed_resources: string[]
  isShared: number
  playlist_id?: string
  playlist_title: string
  resource_ids: string[]
  user_action: string
}

export interface IPlaylistSbUpdateRequest {
  playlist_title: string
  content_ids: string[]
}

export interface IPlaylistUpsertRequest {
  id?: string
  title: string
  contentIds: string[]
  changedContentIds: string[]
  shareWith?: string[]
  shareMsg?: string
  editType: string
  userAction: string
  visibility: string
}

export interface IPlaylistUpdateTitleRequest {
  playlist_title: string
  content_ids: IPlaylistResource[]
}

export interface IPlaylist {
  contents: IPlaylistResource[]
  createdOn: string
  duration: number
  icon: string | null
  id: string
  name: string
  type: string
  sharedBy?: string
  sharedByDisplayName?: string
  sharedOn?: string
  visibility: string
}

export interface IPlaylistResource {
  appIcon: string
  identifier: string
  duration: number
  mimeType: EMimeTypes
  displayContentType: string
  name: string
  contentType: TContentType
  resourceType?: string
}

export interface IPlaylistShareRequestSbExt {
  request: {
    playlist_id: string
    playlist_title: string
    resource_ids: string[]
    shared_with: string[]
  }
}

export interface IPlaylistShareRequest {
  id: string
  name: string
  contentIds: string[]
  shareWith: string[]
  message?: string
}
