/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'daysRemaining'
})
export class DaysRemainingPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    if (value) {
      const date = new Date();
      const last = new Date(value);
      const diff = Math.floor(last.getTime() - date.getTime());
      const day = 1000 * 60 * 60 * 24;

      const days = Math.floor(diff / day);
      return days + ' day(s)';
    }
    return '';
  }
}
