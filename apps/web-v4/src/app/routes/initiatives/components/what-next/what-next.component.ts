/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input } from '@angular/core';
import { MatCalendarCellCssClasses } from '@angular/material';
import { ConfigService } from '../../../../services/config.service';
import { UtilityService } from '../../../../services/utility.service';
import { IEventsConfig } from '../../../../models/wingspan-pages.model';

@Component({
  selector: 'app-what-next',
  templateUrl: './what-next.component.html',
  styleUrls: ['./what-next.component.scss']
})
export class WhatNextComponent implements OnInit {
  @Input() config: IEventsConfig;
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
  days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thrusday', 'Friday', 'Saturday', 'Sunday'];
  selectedDate: number;
  displaySelectedDate: string;
  fetchingEvents = true;
  showReleaseItems: { [title: string]: boolean } = {};
  eventsList = [];
  filteredEvents = [];
  tabs = [];
  selectedIndex: number;

  constructor(private configSvc: ConfigService, private utilitySvc: UtilityService) { }

  ngOnInit() {
    this.selectedDate = new Date().setHours(0, 0, 0, 0);
    this.getSelectedDateEvents();
  }

  onSelect(date) {
    this.selectedIndex = 0;
    this.selectedDate = date.setHours(0, 0, 0, 0);
    this.getSelectedDateEvents();
  }

  getSelectedDateEvents() {
    this.displaySelectedDate = this.months[new Date(this.selectedDate).getMonth()] + ' '
      + new Date(this.selectedDate).getDate() + ', '
      + new Date(this.selectedDate).getFullYear() + ' - '
      + this.days[new Date(this.selectedDate).getDay()];

    if (this.config && this.config.eventsList) {
      this.eventsList = this.config.eventsList.filter(event => event.timestamp === this.selectedDate);
      this.tabs = Array.from(new Set(this.eventsList.map(event => event.category))).filter(tab => tab !== '');
      this.tabs && this.tabs.length ? this.getFilteredEventsData(0) : this.filteredEvents = [];
    } else {
      this.filteredEvents = [];
    }
    this.fetchingEvents = false;
  }

  getFilteredEventsData(index) {
    this.filteredEvents = this.eventsList.filter(e => e.category === this.tabs[index]);
  }

  dateClass() {
    return (date: Date): MatCalendarCellCssClasses => {
      const highlightDate = this.config.eventsList
        .filter(event => event && event.timestamp)
        .some(d => d.timestamp === date.getTime());

      return highlightDate ? 'special-date' : '';
    }
  };
}

