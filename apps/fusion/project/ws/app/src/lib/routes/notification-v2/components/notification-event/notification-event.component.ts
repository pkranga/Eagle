/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, Input } from '@angular/core'
import { ENotificationEvent } from '../../models/notifications.model'

@Component({
  selector: 'ws-app-notification-event',
  templateUrl: './notification-event.component.html',
  styleUrls: ['./notification-event.component.scss'],
})
export class NotificationEventComponent implements OnInit {
  @Input() notificationEvent!: ENotificationEvent
  notificationEvents: typeof ENotificationEvent

  constructor() {
    this.notificationEvents = ENotificationEvent
  }

  ngOnInit() {}
}
