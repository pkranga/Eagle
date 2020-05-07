/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
export interface INotificationsQueryParams {
  [key: string]: string | string[]
}

export interface INotificationData {
  data: INotification[]
  page: string
}

export interface INotification {
  classifiedAs: ENotificationType
  eventId: ENotificationEvent
  message: string
  notificationId: string
  receivedOn: Date
  seen: boolean
  seenOn: Date
  targetData: any
  userId: string
}

export enum ENotificationType {
  Action = 'Action',
  Information = 'Information',
}

export enum ENotificationEvent {
  // Learning Events
  ShareContent = 'share_content',
  SharePlaylist = 'share_playlist',
  ShareGoal = 'share_goal',

  // Authoring Events
  AddContributor = 'add_contributor',
  SendContent = 'send_content',
  RejectContent = 'reject_content',
  PublishContent = 'publish_content',
  DelegateContent = 'delegate_content',
  ApproveContent = 'approve_content',
}
