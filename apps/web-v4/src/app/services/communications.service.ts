/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import { MiscApiService } from '../apis/misc-api.service';
import { Observable } from 'rxjs';
import { IContent } from '../models/content.model';

@Injectable({
  providedIn: 'root'
})
export class CommunicationsService {
  constructor(private miscApi: MiscApiService) {}

  getInfyRadioContent(type: string): Observable<IContent[]> {
    return this.miscApi.fetchInfyRadioData(type);
  }
}
