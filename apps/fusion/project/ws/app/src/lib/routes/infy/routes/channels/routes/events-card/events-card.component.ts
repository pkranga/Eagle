/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, Input } from '@angular/core'
import { IWsChannelEventsData } from '../../models/channels.model'

@Component({
  selector: 'ws-app-events-card',
  templateUrl: './events-card.component.html',
  styleUrls: ['./events-card.component.scss'],
})
export class EventsCardComponent implements OnInit {
  @Input() eventsData: IWsChannelEventsData[] | null = null

  constructor() {}

  ngOnInit() {}

  isCurrentTimeSmall(timestamp: string) {
    return new Date() < new Date(timestamp)
  }
}
