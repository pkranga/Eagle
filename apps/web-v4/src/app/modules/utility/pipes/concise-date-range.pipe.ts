/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Pipe, PipeTransform } from '@angular/core';
import { format as formatDate } from 'date-fns';

interface IDateRange {
  startDate: Date;
  endDate: Date;
}

@Pipe({
  name: 'conciseDateRange'
})
export class ConciseDateRangePipe implements PipeTransform {
  transform(dateRange: IDateRange): string {
    try {
      let conciseRange: string, prefix: string, suffix: string;
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      const startMonth = formatDate(startDate, 'MMM');
      const endMonth = formatDate(endDate, 'MMM');
      const startYear = startDate.getFullYear();
      const endYear = endDate.getFullYear();

      if (startDate.getTime() === endDate.getTime()) {
        conciseRange = formatDate(endDate, 'DD MMM, YYYY');
        return conciseRange;
      }

      if (startYear !== endYear) {
        prefix = formatDate(startDate, 'D MMM, YYYY');
        suffix = formatDate(endDate, 'D MMM, YYYY');
        conciseRange = `${prefix} - ${suffix}`;
        return conciseRange;
      }

      if (startMonth !== endMonth) {
        prefix = formatDate(startDate, 'D MMM');
        suffix = formatDate(endDate, 'D MMM');
      } else {
        prefix = formatDate(startDate, 'D');
        suffix = formatDate(endDate, 'D MMM, YYYY');
      }

      conciseRange = `${prefix} - ${suffix}`;
      return conciseRange;
    } catch (e) {
      return '';
    }
  }
}
