/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ws-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {
  events = [
    {
      title: 'Investing in cutting edge technologies and jobs of the future',
      time: 1556528400000
    },
    {
      title: 'Finding opportunities in India\'s next chapter',
      time: 1556623835000
    },
    {
      title: 'Hosting AFE in Hyderabad',
      time: 1559037154000
    },
    {
      title: 'Event at Bhabha Atomic Research Center.',
      time: 1559037154000
    },
    {
      title: 'Setting business models for big data and digital transformation',
      time: 1559037154000
    }
  ];

  constructor() {}

  ngOnInit() {
    this.events = this.events.filter(event => event.time > Date.now());
  }
}
