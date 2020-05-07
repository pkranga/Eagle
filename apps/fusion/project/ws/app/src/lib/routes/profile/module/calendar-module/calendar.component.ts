/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core'
import { MatCalendarCellCssClasses } from '@angular/material'

@Component({
  selector: 'ws-app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  selectedDate: any
  @Output() notify = new EventEmitter<string>()
  @Input() specialDates: number[] = []
  onSelect(event: string) {
    this.selectedDate = event
    this.notify.emit(event)
  }

  dateClass() {
    return (date: Date): MatCalendarCellCssClasses => {
      if (this.specialDates.includes(new Date(date).getTime() + 330 * 60000)) {
        return 'special-date'
      }

      return ''
    }
  }

  constructor() {}

  ngOnInit() {}
}
