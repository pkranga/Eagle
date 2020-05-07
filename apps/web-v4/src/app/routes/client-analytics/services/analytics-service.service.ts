/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceObj } from '../../../models/myAnalytics.model';

@Injectable()
export class AnalyticsServiceService {
  constructor(private http: HttpClient) {}

  getData(serviceObj: ServiceObj): Observable<any> {
    try {
      const apiCall = `/LA1/api/${serviceObj.type}`;
      const params = `startDate=${serviceObj.startDate}&endDate=${serviceObj.endDate}`;
      const refiner = `&contentType=${serviceObj.contentType}&isCompleted=${serviceObj.isCompleted}`;
      return this.http.get(`${apiCall}?${params}${refiner}`);
    } catch (e) {
      console.error(e);
    }
  }

  getNsoSelected(serviceObj: ServiceObj, nsoId: string) {
    try {
      const apiCall = `/LA1/api/${serviceObj.type}`;
      const params = `startDate=${serviceObj.startDate}&endDate=${serviceObj.endDate}`;
      const refiner = `&contentType=${serviceObj.contentType}&isCompleted=${serviceObj.isCompleted}`;
      return this.http.get(`${apiCall}?${params}${refiner}&roleId=${nsoId}`);
    } catch (e) {
      console.error(e);
    }
  }
}
