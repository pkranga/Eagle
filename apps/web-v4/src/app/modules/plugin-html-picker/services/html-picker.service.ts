/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IHtmlPicker } from '../models/html-picker.model';
@Injectable({
  providedIn: 'root'
})
export class HtmlPickerService {

  constructor(private http: HttpClient) { }

  getHtmlPickerData(url: string): Observable<IHtmlPicker> {
    return this.http.get<IHtmlPicker>(url);
  }
}
