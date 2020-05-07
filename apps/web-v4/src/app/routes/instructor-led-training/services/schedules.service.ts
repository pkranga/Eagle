/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class SchedulesService {
  constructor(private http: HttpClient) {}
  public getSchedule(dateObj): Observable<any> {
    try {
      const startDate = dateObj.startDate;
      const endDate = dateObj.endDate;
      const location = dateObj.location;
      const search = dateObj.search;
      let url: string;
      if (dateObj.location) {
        if (dateObj.search) {
          url = `/LA/coschedules/api/CourseOfferingSchedules?aggsSize=1000&endDate=${endDate}&startDate=${startDate}&from=0&refinementfilter='location':'${location}'&searchquery=${search}`;
        } else {
          url = `/LA/coschedules/api/CourseOfferingSchedules?aggsSize=1000&endDate=${endDate}&startDate=${startDate}&from=0&refinementfilter='location':'${location}'`;
        }
      } else {
        if (dateObj.search) {
          url = `/LA/coschedules/api/CourseOfferingSchedules?aggsSize=1000&endDate=${endDate}&startDate=${startDate}&from=0&searchquery=${search}`;
        } else {
          url = `/LA/coschedules/api/CourseOfferingSchedules?aggsSize=1000&endDate=${endDate}&startDate=${startDate}&from=0`;
        }
      }
      return this.http.get(url);
    } catch (e) {
      console.error(e);
    }
  }
}
