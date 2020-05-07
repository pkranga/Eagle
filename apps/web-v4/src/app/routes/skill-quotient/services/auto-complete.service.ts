/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// helper imports
import { constants } from '../utils/constant.utils';
import logger from '../../../utils/logger';

@Injectable({
  providedIn: 'root'
})
export class AutoCompleteService {
  constructor(private http: HttpClient) {}
  search(type: string, search_text: string): Observable<any> {
    try {
      return this.http.get(`${constants.SEARCH}?search_text=${search_text}&type=${type}`);
    } catch (e) {
      logger.error(e);
    }
  }
}
