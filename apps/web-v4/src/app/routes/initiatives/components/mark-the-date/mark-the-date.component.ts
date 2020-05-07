/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input } from '@angular/core';
import { IEvent } from '../../../../models/initiatives';

@Component({
  selector: 'app-mark-the-date',
  templateUrl: './mark-the-date.component.html',
  styleUrls: ['./mark-the-date.component.scss']
})

export class MarkTheDateComponent implements OnInit {

  @Input() eventsData;

  months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];
  markTheDateEvents = [];
  upcomingEvents = [];
  constructor() { }

  ngOnInit() {
    this.markTheDateEvents = this.eventsData.eventsList.filter(event => event.timestamp > new Date().setHours(0, 0, 0, 0)
      && event.priority === 1);
    this.markTheDateEvents.forEach(event => {
      event.eventDate = new Date(event.timestamp);
    });
    this.upcomingEvents = this.eventsData.eventsList.filter(event => event.timestamp > new Date().setHours(0, 0, 0, 0)
      && event.priority === 2);
    this.upcomingEvents.forEach(event => {
      event.eventDate = new Date(event.timestamp);
    });
  }
}
