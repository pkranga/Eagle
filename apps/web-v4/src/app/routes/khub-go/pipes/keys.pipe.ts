/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Pipe, PipeTransform } from '@angular/core';

/**
 * CODE_REVIEW: angular inbuilt pipe available for keyValue
 * Ignored warnings in code
 */

@Pipe({
  name: 'keys'
})
export class KeysPipe implements PipeTransform {
  // used to return key value pair
  transform(value: any, args: string[]): any {
    const keys = [];
    for (const key in value) {
      keys.push({ key, value: value[key] });
    }
    return keys;
  }
}
