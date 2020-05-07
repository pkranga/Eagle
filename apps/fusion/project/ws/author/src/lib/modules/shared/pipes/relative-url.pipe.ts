/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { AUTHORING_CONTENT_BASE } from '@ws/author/src/lib/constants/apiEndpoints'
import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'relativeUrl',
})
export class RelativeUrlPipe implements PipeTransform {

  transform(value: string): any {
    return value ? `${AUTHORING_CONTENT_BASE}${encodeURIComponent(value)}` : ''
  }

}
