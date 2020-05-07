/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'limitTo'
})
export class LimitToPipe implements PipeTransform {
  transform(data: any, limit?: number): any {
    if (!data || !data.length) {
      return null;
    }
    if (!limit) {
      limit = 5;
    }
    if (data instanceof Array) {
      return data.slice(0, limit);
    } else if (typeof data === 'string') {
      const slicedString = data.substr(0, limit);
      if (limit < data.length) {
        return slicedString + '...';
      }
      return slicedString;
    }
    return null;
  }
}
