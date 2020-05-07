/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICounterPlatformResponse, ICounterInfyMeResponse } from '../models/counter.model';

@Injectable({
  providedIn: 'root'
})
export class CounterApiService {
  apiEndPoints = {
    platform: '/clientApi/v4/counter',
    infyMeCounter: 'clientApi/v4/counter/infyMe'
  };

  constructor(private http: HttpClient) { }

  fetchPlatformCounterData(): Observable<ICounterPlatformResponse> {
    return this.http.get<ICounterPlatformResponse>(this.apiEndPoints.platform);
  }
  fetchInfyMeCounterData(): Observable<ICounterInfyMeResponse> {
    return this.http.get<ICounterInfyMeResponse>(this.apiEndPoints.infyMeCounter);
  }
}
