/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Pipe, PipeTransform } from '@angular/core'

interface ICertificationDate {
  day: number
  month: number
  year: number
  timeZone?: string
}

@Pipe({
  name: 'pipeDateConcat',
})
export class PipeDateConcatPipe implements PipeTransform {
  private readonly months: string[]

  constructor() {
    this.months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ]
  }

  transform(value: ICertificationDate): string {
    let dateStr = `${value.day} ${this.months[value.month - 1]} ${value.year}`
    if (value.timeZone) {
      dateStr += ` ${value.timeZone}`
    }

    return dateStr
  }
}
