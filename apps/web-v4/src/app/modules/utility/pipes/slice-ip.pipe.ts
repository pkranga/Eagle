/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Pipe, PipeTransform } from '@angular/core';
import { ValuesService } from '../../../services/values.service';

@Pipe({
  name: 'sliceIp'
})
export class SliceIpPipe implements PipeTransform {
  constructor(private valueSvc: ValuesService) {}
  transform(url: string): string {
    if (!url) {
      return '/none';
    }
    return url.replace(this.valueSvc.CONTENT_URL_PREFIX_REGEX, '');
  }
}
