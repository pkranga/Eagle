/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Pipe, PipeTransform } from '@angular/core'

interface IDateRange {
  fromDate: Date
  toDate: Date
  timeZone?: string
}

@Pipe({
  name: 'pipeConciseDateRange',
})
export class PipeConciseDateRangePipe implements PipeTransform {
  transform(dateRange: IDateRange): string {
    try {
      let conciseRange: string
      let prefix: string
      let suffix: string
      const fromDate = new Date(dateRange.fromDate)
      const toDate = new Date(dateRange.toDate)

      const fromDateObj = {
        day: fromDate.getDate(),
        month: fromDate.toLocaleString('default', { month: 'short' }),
        year: fromDate.getFullYear(),
        time: fromDate.getTime(),
      }

      const toDateObj = {
        day: toDate.getDate(),
        month: toDate.toLocaleString('default', { month: 'short' }),
        year: toDate.getFullYear(),
        time: toDate.getTime(),
      }

      if (fromDateObj.time === toDateObj.time) {
        conciseRange = `${fromDateObj.day} ${fromDateObj.month} ${fromDateObj.year}`
        return conciseRange
      }

      if (fromDateObj.year !== fromDateObj.year) {
        prefix = `${fromDateObj.day} ${fromDateObj.month} ${fromDateObj.year}`
        suffix = `${toDateObj.day} ${toDateObj.month} ${toDateObj.year}`
        conciseRange = `${prefix} - ${suffix}`
        return conciseRange
      }

      if (fromDateObj.month === toDateObj.month) {
        prefix = `${fromDateObj.day}`
        suffix = `${toDateObj.day} ${toDateObj.month} ${toDateObj.year}`
      } else {
        prefix = `${fromDateObj.day} ${fromDateObj.month}`
        suffix = `${toDateObj.day} ${toDateObj.month} ${toDateObj.year}`
      }

      conciseRange = `${prefix} - ${suffix}`
      return conciseRange
    } catch (e) {
      return `${dateRange.fromDate} - ${dateRange.toDate}`
    }
  }
}
