/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Globals } from '../utils/globals';

@Injectable({
  providedIn: 'root'
})
export class ClientAnalyticsService {
  format_date_plus_month: string;
  format_date: string;
  date: Date;
  selected_date_format: String;

  constructor(private http: HttpClient, public globals: Globals) {}

  getData(selectedStartDate, selectedEndDate, serviceObj): Observable<any> {
    try {
      this.globals.serviceCalled =
        '/LA1/api/siemens?aggsSize=200&endDate=' +
        selectedEndDate +
        '&startDate=' +
        selectedStartDate +
        '&from=0'+'&contentType='+serviceObj.contentType;
      return this.http.get(
        '/LA1/api/siemens?aggsSize=200&endDate=' +
          selectedEndDate +
          '&startDate=' +
          selectedStartDate +
          '&from=0'+'&contentType='+serviceObj.contentType
      );
      // , UtilMethods.getAuthHeaders());
    } catch (e) {
      console.log(e);
    }
  }

  getFilteredServers(
    Filters: Array<String>,
    dict: Map<String, String>,
    selectedStartDate: string,
    selectedEndDate: string
  ) {
    dict.clear();
    // const options = new RequestOptions({ withCredentials: false });
    // let headers = new Headers();
    // headers.append('Cache-Control', 'no-store');
    // headers.append('withCredentials', 'true');
    // const options = new RequestOptions({ headers: headers });
    // const options = new RequestOptions({ withCredentials: true });
    let url;
    let refiner = '';
    let searchRefiner: String = '';

    for (const entry of Filters) {
      // console.log(Filters,entry.split(':'));
      // console.log(dict.get(entry.split(':')[0]))

      if (dict.get(entry.split(':')[0]) === undefined) {
        dict.set(entry.split(':')[0], '');
      }

      if (dict.get(entry.split(':')[0]) === '') {
        dict.set(entry.split(':')[0], entry.split(/:(.+)/)[1]);
      } else {
        dict.set(entry.split(':')[0], dict.get(entry.split(':')[0]) + ',' + entry.split(/:(.+)/)[1]);
      }
    }
    if (dict.size !== 0) {
      const dictIterator = dict.entries();
      let fil = dictIterator.next().value;
      while (fil !== undefined) {
        if (refiner !== '') {
          if (fil[0] === `"Search"`) {
            searchRefiner = fil[1].replace(/"/g, ``);
          } else {
            refiner = refiner + '$' + fil[0] + ':[' + fil[1] + ']';
          }
        } else {
          if (fil[0] === `"Search"`) {
            searchRefiner = fil[1].replace(/"/g, ``);
          } else {
            refiner = refiner + fil[0] + ':[' + fil[1] + ']';
          }
        }
        fil = dictIterator.next().value;
      }

      if (searchRefiner === '') {
        url =
          `/LA1/api/siemens?aggsSize=200&endDate=` +
          encodeURIComponent(selectedEndDate.toString()) +
          `&startDate=` +
          encodeURIComponent(selectedStartDate.toString()) +
          `&from=0&refinementfilter=` +
          encodeURIComponent(refiner);
        this.globals.serviceCalled = url;
        return this.http.get(url);
      } else if (refiner === '') {
        url =
          `/LA1/api/siemens?aggsSize=200&endDate=` +
          encodeURIComponent(selectedEndDate.toString()) +
          `&startDate=` +
          encodeURIComponent(selectedStartDate.toString()) +
          `&from=0` +
          '&search_query=' +
          searchRefiner.toString();
        this.globals.serviceCalled = url;
        return this.http.get(url);
      } else {
        url =
          `/LA1/api/siemens?aggsSize=200&endDate=` +
          encodeURIComponent(selectedEndDate.toString()) +
          `&startDate=` +
          encodeURIComponent(selectedStartDate.toString()) +
          `&from=0&refinementfilter=` +
          encodeURIComponent(refiner) +
          '&search_query=' +
          searchRefiner.toString();
        this.globals.serviceCalled = url;
        return this.http.get(url);
      }
    } else {
      this.globals.serviceCalled =
        '/LA1/api/siemens?aggsSize=200&endDate=' +
        selectedEndDate +
        '&startDate=' +
        selectedStartDate +
        '&from=0';
      return this.http.get(
        '/LA1/api/siemens?aggsSize=200&endDate=' +
          selectedEndDate +
          '&startDate=' +
          selectedStartDate +
          '&from=0'
      );
    }
  }
}
