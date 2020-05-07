/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeConverter'
})
export class TimeConverterPipe implements PipeTransform {

  transform(value: number): string {
    if (!value) {
      return;
    }
    value = Math.round(value / 1000);
    if (value <= 0) { return '-'; }
    const h = Math.floor(value / 3600);
    const m = Math.floor(value % 3600 / 60);
    const s = Math.floor(value % 3600 % 60);
    let duration = '';
    let space = '';
    if (h > 0) {
      duration += `${h}h`;
    }
    if (m > 0) {
      if (h > 0) {
        space = ' ';
      }
      duration += `${space}${m}m`;
    }
    if (s > 0 && h === 0) {
      if (m > 0) {
        space = ' ';
      }
      duration += `${space}${s}s`;
    }
    return duration;
  }
}
