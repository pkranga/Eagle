/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';

@Injectable()
export class QuarterServiceService {
  constructor() {}

  getCurrentQuarter() {
    try {
      // code was changed as the quater was setting to Q3 due to math.ceil was taking divider as 4 by business logic
      const month = new Date().getMonth() + 1;
      const quarter = Math.ceil(month / 3);
      if (month >= 1 && month <= 3) {
        return [4];
      }
      if (month >= 4 && month <= 6) {
        return [1];
      }
      if (month >= 7 && month <= 9) {
        return [2];
      }
      if (month >= 10 && month <= 12) {
        return [3];
      }
      // return [quarter];
    } catch (e) {
      return [4];
    }
  }

  getDatesFromQuarters(quarters: any, year?: any) {
    try {
      const quarterDates = [];
      if (quarters && year) {
        quarters.map(function(current) {
          switch (current) {
            case 1:
              quarterDates.push(year + '/04/01-' + year + '/06/30');
              break;
            case 2:
              quarterDates.push(year + '/07/01-' + year + '/09/30');
              break;
            case 3:
              quarterDates.push(year + '/10/01-' + year + '/12/31');
              break;
            case 4:
              quarterDates.push(parseInt(year, 10) + 1 + '/01/01-' + (parseInt(year, 10) + 1) + '/03/31');
              break;
            default:
              break;
          }
        });
        return {
          startDate: quarterDates[0].split('-')[0],
          endDate: quarterDates[quarterDates.length - 1].split('-')[1]
        };
      } else {
        return {
          startDate: '2019/04/01',
          endDate: '2019/06/30'
        };
      }
      return null;
    } catch (e) {
      throw e;
    }
  }
}
