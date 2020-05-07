/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Injectable } from '@angular/core'
import { IEvent } from '../models/event.model'
import { Observable } from 'rxjs'
import { HttpClient } from '@angular/common/http'

const PROTECTED_SLAG_V8 = '/apis/protected/v8'

const API_END_POINTS = {
  LIVE_EVENTS: `${PROTECTED_SLAG_V8}/events`,
}

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  constructor(private http: HttpClient) {}

  fetchLiveEvents(): Observable<IEvent[]> {
    return this.http.get<IEvent[]>(`${API_END_POINTS.LIVE_EVENTS}`)
  }
}
