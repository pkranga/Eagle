/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../../../services/config.service';
import { IEvent } from '../../../../models/events.model';
import { FetchStatus } from '../../../../models/status.model';
import { MiscService } from '../../../../services/misc.service';

export type IEventArray = IEvent | string;
export type Type = 'previous' | 'live' | 'upcoming';
@Component({
  selector: 'ws-broadcast',
  templateUrl: './broadcast.component.html',
  styleUrls: ['./broadcast.component.scss']
})
export class BroadcastComponent implements OnInit {
  constructor(private configSvc: ConfigService, private miscSvc: MiscService) { }
  // upcomingEvents: string[] = [];
  type: Type;
  availableData = false;
  events: IEventArray[] = [];
  localDateArray: string[] = [];
  allEvents: any[] = [];
  liveEvents: IEvent[];
  liveUrl: string;
  fetchStatus: FetchStatus = 'fetching';
  allEventsIterate: any[] = [];
  counter = 0;
  enableNext = true;
  enablePrev = false;
  hideButtons = false;
  async ngOnInit() {
    await this.miscSvc.fetchLiveEvents().subscribe(
      data => {
        this.liveEvents = data;
        this.fetchStatus = 'done';
        this.availableData = true;
        setTimeout(() => this.onInItClickFunction(), 50);
      },
      err => {
        this.availableData = false;
        this.fetchStatus = 'error';
      }
    );
  }
  onInItClickFunction() {
    if (
      this.liveEvents &&
      this.liveEvents.filter(event => new Date(event.start_time).getTime() === new Date().getTime()).length > 0
    ) {
      // document.getElementById('liveEventButton').click();
      document.getElementById('previousEventButton').click();
    } else if (
      this.liveEvents &&
      this.liveEvents.filter(event => new Date(event.start_time).getTime() > new Date().getTime()).length > 0
    ) {
      // document.getElementById('upcomingEventButton').click();
      document.getElementById('previousEventButton').click();
    } else if (this.liveEvents) {
      document.getElementById('previousEventButton').click();
    }
  }
  showEventsDate(type: Type) {
    this.type = type;
    this.events = [];
    this.localDateArray = [];
    this.allEvents = [];
    if (type === 'previous') {
      this.sortDateArray(true);
      this.liveEvents.forEach(element => {
        if (type && new Date(element.start_time).getTime() < new Date().getTime()) {
          const data = new Date(element.start_time);
          const localDate = data.toLocaleDateString();
          if (!this.localDateArray.includes(localDate)) {
            this.allEvents.push(element.start_time);
            this.localDateArray.push(localDate);
          }
        }
      });
    } else if (type === 'live') {
      this.sortDateArray(false);
      this.liveEvents.forEach(element => {
        if (new Date(element.start_time) === new Date()) {
          const data = new Date(element.start_time);
          const localDate = data.toLocaleDateString();
          if (!this.localDateArray.includes(localDate)) {
            this.allEvents.push(element.start_time);
            this.localDateArray.push(localDate);
          }
        }
      });
    } else if (type === 'upcoming') {
      this.sortDateArray(false);
      this.liveEvents.forEach(element => {
        if (new Date(element.start_time) > new Date()) {
          const data = new Date(element.start_time);
          const localDate = data.toLocaleDateString();
          if (!this.localDateArray.includes(localDate)) {
            this.allEvents.push(element.start_time);
            this.localDateArray.push(localDate);
          }
        }
      });
    }
    this.allEventsIterate = this.allEvents.slice(0, 3);
    this.hideButtons = this.allEvents.length <= 3 ? true : false;
    this.showAllEvents(type);
  }
  showAllEvents(type: Type) {
    this.events = [];
    this.liveEvents.forEach(element => {
      if (type === 'previous') {
        if (new Date(element.start_time) < new Date()) {
          if (this.events.indexOf(new Date(element.start_time).toLocaleDateString()) <= -1) {
            this.events.push(new Date(element.start_time).toLocaleDateString());
          }
          this.events.push(element);
        }
      } else if (type === 'live') {
        if (new Date(element.start_time).toLocaleDateString() === new Date().toLocaleDateString() && new Date(element.start_time).getTime() <= new Date().getTime() && new Date(element.end_time).getTime() >= new Date().getTime()) {
          if (this.events.indexOf(new Date(element.start_time).toLocaleDateString()) <= -1) {
            this.events.push(new Date(element.start_time).toLocaleDateString());
          }
          this.events.push(element);
        }
      } else if (type === 'upcoming') {
        if (new Date(element.start_time) > new Date()) {
          if (this.events.indexOf(new Date(element.start_time).toLocaleDateString()) <= -1) {
            this.events.push(new Date(element.start_time).toLocaleDateString());
          }
          this.events.push(element);
        }
      }
    });
  }
  sortDateArray(flag) {
    this.liveEvents.sort(function compare(a, b) {
      const dateResult = new Date(a.start_time).valueOf() - new Date(b.start_time).valueOf();
      return dateResult;
    });
    if (flag) {
      return this.liveEvents.reverse();
    } else {
      return this.liveEvents;
    }
  }
}
