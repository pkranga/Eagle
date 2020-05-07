/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NsContent } from '../_services/widget-content.model'

export namespace NsPlaylist {
  export enum EPlaylistUserAction {
    CREATE = 'create',
    ADD = 'add',
    DELETE = 'delete',
  }

  export enum EPlaylistTypes {
    ME = 'user',
    SHARED = 'share',
    PENDING = 'pending',
  }

  export enum EPlaylistEditTypes {
    ONLY_VIEW = 'view',
    EDIT = 'edit',
  }

  export enum EPlaylistVisibilityTypes {
    PUBLIC = 'public',
    PRIVATE = 'private',
  }

  export interface IPlaylistResponse {
    user: IPlaylist[]
    share: IPlaylist[]
    pending: IPlaylist[]
  }

  export interface IPlaylist {
    id: string
    name: string
    contents: NsContent.IContentMinimal[]
    createdOn: string
    duration: number
    editType: EPlaylistEditTypes
    visibility: EPlaylistVisibilityTypes
    icon: string
    sharedBy?: string
    sharedByDisplayName?: string
    sharedOn?: string
  }

  export interface IPlaylistUpsertRequest {
    id?: string
    title: string
    contentIds: string[]
    changedContentIds: string[]
    shareWith?: string[]
    shareMsg?: string
    editType: EPlaylistEditTypes
    userAction: EPlaylistUserAction
    visibility: EPlaylistVisibilityTypes
  }

  export interface IPlaylistShareRequest {
    id: string
    name: string
    contentIds: string[]
    shareWith: string[]
    shareMsg?: string
  }

  export interface IBtnPlaylist {
    contentId: string
    contentName: string
    contentType: NsContent.EContentTypes
    mode: 'dialog' | 'menu'
    isDisabled?: false
  }
}
