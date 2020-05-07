/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trimAndReduce'
})
export class TrimAndReducePipe implements PipeTransform {
  //  trim the text to supplied value
  transform(value: any, args?: any): any {
    if (value && value.length > args) {
      return value.slice(0, args) + '...';
    }
    return value;
  }
}
