/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Injectable } from '@angular/core'
import { ENotificationEvent, INotification } from '../models/notifications.model'
import { Router } from '@angular/router'

@Injectable()
export class NotificationService {
  constructor(private router: Router) {}

  mapRoute(notification: INotification) {
    const event = notification.eventId
    let identifier: string
    let route: string

    switch (event) {
      case ENotificationEvent.ShareGoal:
        route = '/app/goals/me/pending-actions'
        break

      case ENotificationEvent.SharePlaylist:
        route = '/app/playlist/notification'
        break

      case ENotificationEvent.ShareContent:
      case ENotificationEvent.PublishContent:
        identifier = notification.targetData['identifier']
        if (!identifier) {
          route = ''
          break
        }

        route = `/app/toc/${identifier}/overview`
        break

      case ENotificationEvent.AddContributor:
      case ENotificationEvent.SendContent:
      case ENotificationEvent.RejectContent:
      case ENotificationEvent.DelegateContent:
      case ENotificationEvent.ApproveContent:
        identifier = notification.targetData['identifier']
        if (!identifier) {
          route = ''
          break
        }

        route = `/author/editor/${identifier}`
        break

      default:
        route = ''
    }

    if (route) {
      this.router.navigate([route])
    }
  }
}
