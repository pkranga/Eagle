/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'durationTransform'
})
export class DurationTransformPipe implements PipeTransform {
  transform(data: number, type: 'time24' | 'hms' | 'hour'): any {
    if (data <= 0) {
      return '';
    }
    const h = Math.floor(data / 3600);
    const m = Math.floor((data % 3600) / 60);
    const s = Math.floor((data % 3600) % 60);
    let duration = '';
    let space = '';

    if (!type || type === 'time24') {
      duration += h > 0 ? `${this.pad(h, 2)}:` : '';
      duration += m > 0 ? `${this.pad(m, 2)}:` : '00:';
      duration += s > 0 ? this.pad(s, 2) : '00';
      return duration;
    } else if (type === 'hms') {
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
    } else if (type === 'hour') {
      if (h === 0) {
        duration += 'less than an hour';
      }
      if (h === 1) {
        duration += `${h} hour`;
      }
      if (h > 1) {
        duration += `${h} hours`;
      }
      return duration;
    }
  }

  private pad(num: number, size: number): string {
    let s = num + '';
    while (s.length < size) {
      s = '0' + s;
    }
    return s;
  }
}
