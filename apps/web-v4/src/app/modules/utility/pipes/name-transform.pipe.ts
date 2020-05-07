/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Pipe, PipeTransform } from '@angular/core';

interface IUserName {
  firstName: string;
  lastName: string;
  email: string;
}

@Pipe({
  name: 'nameTransform'
})
export class NameTransformPipe implements PipeTransform {
  transform(value: IUserName, args?: any): any {
    let result = '';
    if (value.firstName) {
      result += value.firstName;
    }
    if (value.lastName && value.lastName !== value.firstName) {
      result += ' ' + value.lastName;
    }
    if (result.trim() !== '') {
      return result;
    }
    if (value.email) {
      return value.email;
    }
    return 'Anonymous User';
  }
}
