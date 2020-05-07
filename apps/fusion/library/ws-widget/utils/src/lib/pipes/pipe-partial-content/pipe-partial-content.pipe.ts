/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'pipePartialContent',
})
export class PipePartialContentPipe implements PipeTransform {

  transform(value: any, keys: string[]): any {
    const result: { [key: string]: any } = {}
    for (const key of keys) {
      if (value[key]) {
        result[key] = value[key]
      }
    }
    return result
  }

}
