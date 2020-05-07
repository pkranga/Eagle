/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IApiResponse } from '../models/apiResponse';
import { slagV2 } from '../constants/apiEndpoints.constant';
import { map } from 'rxjs/operators';
import { ITimeSpent } from '../models/timeSpent.model';
import { ILeaderBoard, ILeaderBoardItems } from '../models/leaderboard.model';

/**
 * CODE_REVIEW: API calls at service level
 */

const apiEndpoints = {
  leaderboard: `${slagV2}/leaderboard`
};
@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private http: HttpClient) {}

  getDashBoard(startDate: string, endDate: string, email?: string): Observable<ITimeSpent> {
    if (email === undefined) {
      // tslint:disable-next-line:max-line-length
      return this.http
        .get<IApiResponse<{ response: ITimeSpent }>>(`${slagV2}/user/dashboard?startdate=${startDate}&enddate=${endDate}`)
        .pipe(map(res => res.result.response));
    } else {
      // tslint:disable-next-line:max-line-length
      return this.http
        .get<IApiResponse<{ response: ITimeSpent }>>(`${slagV2}/user/dashboard?startdate=${startDate}&enddate=${endDate}&email=${email}`)
        .pipe(map(res => res.result.response));
    }
  }

  // Leaderboard
  getLeaderBoard(id: string): Observable<ILeaderBoard> {
    return this.getLeaderBoardData<ILeaderBoard>(id);
  }

  getHallOfFame(id: string): Observable<ILeaderBoardItems[]> {
    return this.getLeaderBoardData<ILeaderBoardItems[]>(id);
  }

  private getLeaderBoardData<T>(id: string): Observable<T> {
    return this.http.get<IApiResponse<{ response: T }>>(apiEndpoints.leaderboard + '/' + id).pipe(map(res => res.result.response));
  }
}
