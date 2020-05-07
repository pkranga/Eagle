/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { OnInit, Input, OnChanges } from '@angular/core';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { isSameDay, isSameMonth } from 'date-fns';
import { Subject } from 'rxjs';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
import { CalendarDateFormatter } from 'angular-calendar';
import { CustomDateFormatter } from './custom-date-formatter';
const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  },
  black: {
    primary: 'rgb(0,0,0)',
    secondary: 'rgb(0,0,0)'
  },
  grey: {
    primary: '#616161',
    secondary: '#616161'
  },
  green: {
    primary: '#5ba46e',
    secondary: '#5ba46e'
  }
};

@Component({
  selector: 'app-monthly-calender-graph',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './monthly-calender-graph.component.html',
  styleUrls: ['./monthly-calender-graph.component.scss'],
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter
    }
  ]
})
export class MonthlyCalenderGraphComponent implements OnInit, OnChanges {
  @Input() public data = [];
  @Input() startDate;
  @Input() count: number;
  @Input() mainTitle = 'My #of mins on LEX - this calender month';
  // public viewDate:any;
  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();
  chartData: CalendarEvent[] = [];
  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {}
    }
  ];
  refresh: Subject<any> = new Subject();
  activeDayIsOpen = false;

  // constructor(public globals:Globals) {
  //   this.viewDate=new Date ();
  // }
  constructor() {}

  ngOnInit() {
    // this.processData(this.data)
  }

  ngOnChanges() {
    this.viewDate = new Date();
    if (this.count > 1) {
      this.viewDate = new Date(this.startDate);
    }

    this.processData(this.data);
  }

  processData(data: any) {
    let dataPoints: any;
    data.forEach(element => {
      if (element[1] === '0.0') {
        dataPoints = {
          // title: 'Time spent on this day : '+ ' '+ element[1]+ ' minutes',
          title: element[1] + ' minutes',
          start: new Date(element[0]),
          color: colors.grey
        };
      } else {
        dataPoints = {
          title: element[1] + ' minutes',
          start: new Date(element[0]),
          color: colors.green
        };
      }

      this.chartData.push(dataPoints);
    });
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
      if ((isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) || events.length === 0) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
    }
  }

  eventTimesChanged({ event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.handleEvent('Dropped or resized', event);
    this.refresh.next();
  }

  handleEvent(action: string, event: CalendarEvent): void {}
}
