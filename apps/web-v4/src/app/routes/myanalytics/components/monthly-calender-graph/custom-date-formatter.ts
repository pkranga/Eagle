/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { CalendarDateFormatter, DateFormatterParams } from 'angular-calendar';
import { DatePipe } from '@angular/common';

export class CustomDateFormatter extends CalendarDateFormatter {
  // you can override any of the methods defined in the parent class

  public monthViewColumnHeader({ date, locale }: DateFormatterParams): string {
    return new DatePipe(locale).transform(date, 'EEE', locale);
  }

  public monthViewTitle({ date, locale }: DateFormatterParams): string {
    return new DatePipe(locale).transform(date, 'MMM y', locale);
  }

  public weekViewColumnHeader({ date, locale }: DateFormatterParams): string {
    return new DatePipe(locale).transform(date, 'EEE', locale);
  }

  public dayViewHour({ date, locale }: DateFormatterParams): string {
    return new DatePipe(locale).transform(date, 'HH:mm', locale);
  }
}
