/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CounterApiService } from '../apis/counter-api.service';
import { ICounterPlatformResponse, ICounterInfyMeEntity, ICounterInfyMeResponse } from '../models/counter.model';

@Injectable({
  providedIn: 'root'
})
export class CounterService {
  constructor(private counterApi: CounterApiService) { }

  fetchPlatformCounterData(): Observable<ICounterPlatformResponse> {
    return this.counterApi.fetchPlatformCounterData();
  }
  fetchInfyMeCounterData(): Observable<ICounterInfyMeResponse> {
    return this.counterApi.fetchInfyMeCounterData();
  }
}
