/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import {
  IPlaylist,
  IPlaylistResource,
  IPlaylistSbExt,
  IPlaylistSbExtBase,
  IPlaylistSbExtRequest,
  IPlaylistSbExtV2,
  IPlaylistSbUpdateRequest,
  IPlaylistUpdateTitleRequest,
  IPlaylistUpsertRequest,
  IResourceSbExt
} from '../models/playlist.model'
import { processDisplayContentType, processUrl } from '../utils/contentHelpers'

function transformToPlaylistBase(
  playlistSbExt: IPlaylistSbExtBase,
  contents: IPlaylistResource[]
): IPlaylist {
  return {
    contents: contents.map((content) => ({
      ...content,
      displayContentType: processDisplayContentType(content.contentType, content.resourceType),
    })),
    createdOn: playlistSbExt.created_on,
    duration: contents.reduce(
      (totalDuration: number, r: IPlaylistResource) => totalDuration + r.duration,
      0
    ),
    icon: contents.length ? contents[0].appIcon : null,
    id: playlistSbExt.playlist_id,
    name: playlistSbExt.playlist_title,
    sharedBy: playlistSbExt.shared_by && playlistSbExt.shared_by.user_id,
    sharedByDisplayName: playlistSbExt.shared_by && playlistSbExt.shared_by.name,
    sharedOn: playlistSbExt.shared_on,
    type: Boolean(playlistSbExt.shared_by) ? 'share' : 'user',
    visibility: playlistSbExt.visibility,
  }
}
export function transformToPlaylistV2(playlistSbExt: IPlaylistSbExtV2): IPlaylist {
  return transformToPlaylistBase(playlistSbExt, playlistSbExt.resource)
}

export function transformToPlaylist(playlistSbExt: IPlaylistSbExt): IPlaylist {
  const contents: IPlaylistResource[] = transformToResource(playlistSbExt.resource)
  return transformToPlaylistBase(playlistSbExt, contents)
}

function transformToResource(resources: IResourceSbExt[]): IPlaylistResource[] {
  return (resources || []).map((resource: IResourceSbExt) => ({
    appIcon: processUrl(resource.appIcon),
    contentType: resource.contentType,
    displayContentType: processDisplayContentType(resource.contentType, resource.resourceType),
    duration: resource.time_duration,
    identifier: resource.resource_id,
    mimeType: resource.mimeType,
    name: resource.resource_name,
  }))
}

export function transformToSbExtUpsertRequest(
  upsertRequest: IPlaylistUpsertRequest
): IPlaylistSbExtRequest {
  return {
    changed_resources: upsertRequest.changedContentIds,
    isShared: 0,
    playlist_id: upsertRequest.id,
    playlist_title: upsertRequest.title,
    resource_ids: upsertRequest.contentIds,
    user_action: upsertRequest.userAction,
  }
}
export function transformToSbExtUpdateRequest(
  updateRequest: IPlaylistUpdateTitleRequest
): IPlaylistSbUpdateRequest {
  return {
    content_ids: updateRequest.content_ids.map((content) => content.identifier),
    playlist_title: updateRequest.playlist_title,
  }
}
