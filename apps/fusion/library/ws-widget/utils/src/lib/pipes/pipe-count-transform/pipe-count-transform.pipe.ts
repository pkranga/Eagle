/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'pipeCountTransform',
})
export class PipeCountTransformPipe implements PipeTransform {

  transform(value: number): string {
    const thousand = 1000
    const million = 1000000
    if (value > 0) {
      if (value < thousand) {
        return String(value)
      }
      if (value >= thousand && value < million) {
        const views = (value / thousand).toFixed(1)
        if (views.endsWith('0')) {
          return `${views.split('.')[0]}K`
        }
        return `${views}K`
      }
      {
        const views = (value / million).toFixed(1)
        if (views.endsWith('0')) {
          return `${views.split('.')[0]}M`
        }
        return `${views}M`
      }
    }
    return '0'
  }
}
