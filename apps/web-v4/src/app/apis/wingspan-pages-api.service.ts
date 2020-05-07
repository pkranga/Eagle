/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IToDoListResponse } from '../models/wingspan-pages.model';

@Injectable({
    providedIn: 'root'
})
export class WingspanPagesApiService {
    API_BASE = '/clientApi/v4';
    USER_API = `${this.API_BASE}/user`;

    apiEndpoints = {
        FETCH_TO_DOS: `${this.USER_API}/wingspan-pages/getToDos`,
    };

    constructor(private http: HttpClient) { }

    fetchToDos(id: string): Observable<IToDoListResponse[]> {
        return this.http.get<IToDoListResponse[]>(this.apiEndpoints.FETCH_TO_DOS + '/' + id);
    }


}
