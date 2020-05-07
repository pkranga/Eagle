/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { IContinueStrip } from '../models/content.model';
import { IViewerContinueLearningRequest } from '../models/playerEvents.model';

import { HistoryApiService } from '../apis/history-api.service';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  constructor(private historyApiSvc: HistoryApiService) {}

  fetchContinueLearning(pageSize: number, pageState?: string, email?: string): Observable<IContinueStrip> {
    return this.historyApiSvc.fetchContinueLearning(pageSize, pageState, email);
  }

  fetchContentContinueLearning(id: string): Observable<IContinueStrip> {
    return this.historyApiSvc.fetchContentContinueLearning(id);
  }

  saveContinueLearning(content: IViewerContinueLearningRequest, contentId: string): Observable<any> {
    return this.historyApiSvc.saveContinueLearning(content, contentId);
  }

  addToHistory(contentId: string) {
    return this.historyApiSvc.addHistory(contentId);
  }
}
