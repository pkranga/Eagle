/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
export namespace NsSettings {
  export interface INotificationGroup {
    group_id: string
    group_name: string
    events: INotificationEvent[]
    // below for UI. Actually it doesn't exist. using jugaad  talent
    show: boolean
  }

  export interface INotificationEvent {
    event_id: string
    recipients: INotificationRecipient[]
    event_name: string
  }

  export interface INotificationRecipient {
    modes: INotificationMode[]
    recipient: string
  }

  export interface INotificationMode {
    mode_id: string
    mode_name: string
    status: boolean
  }
}
