/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import { formUrl } from '../../../utils/urlHelper';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  startDate: string;
  endDate: string;
  date: Date;
  constructor(private http: HttpClient) { }
  initializeValues() {
    this.date = new Date();
    this.startDate = (new Date().getFullYear()) - 1 +
      '-' +
      ('0' + (new Date().getMonth() + 2)).slice(-2) +
      '-' +
      ('0' + new Date().getDate()).slice(-2);
    this.endDate = new Date().getFullYear() +
      '-' +
      ('0' + (new Date().getMonth() + 2)).slice(-2) +
      '-' +
      ('0' + new Date().getDate()).slice(-2);;
  }
  getServer(serviceObj): Observable<any> {
    try {
      this.initializeValues();
      if (serviceObj.refiner === '' || serviceObj.refiner === null || serviceObj.refiner === undefined) {
        return this.http.get('/LA/LA/api/participants?aggsSize=1000&endDate=' + this.endDate + '&startDate=' + this.startDate + '&from=0&refinementfilter=' + encodeURIComponent('"source":["LEX"]') + '$' + encodeURIComponent(`"topics":[ "${serviceObj.contentId}" ]`));

      } else {
        return this.http.get('/LA/LA/api/participants?aggsSize=1000&endDate=' + this.endDate + '&startDate=' + this.startDate + '&from=0&refinementfilter=' + encodeURIComponent(serviceObj.refiner + '$' + '"source":["LEX"]') + '$' + encodeURIComponent(`"courseCode":[ "${serviceObj.contentId}" ]`));

      }
      // , UtilMethods.getAuthHeaders());
    } catch (e) {
      console.log(e);
    }
  }
}
