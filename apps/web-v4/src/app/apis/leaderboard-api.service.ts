/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IApiResponse, IApiResponseResultResponse } from '../models/apiResponse';
import { ILeaderboardToppers, ILeaderboardTopperDetails } from '../models/leaderboard.model';

@Injectable()
export class LeaderboardApiService {
  API_BASE = '/clientApi/v2';
  LEADERBOARD_API = 'leaderboard';

  private currentDate = new Date();

  currentDateObj: {
    week: number;
    month: number;
    year: number;
  } = {
      week: this.getCurrentWeekNumber(this.currentDate),
      month: this.currentDate.getMonth() + 1,
      year: this.currentDate.getFullYear()
    };

  constructor(private http: HttpClient) { }

  getLeaderboardData(
    leaderboardType: string,
    durationType: string,
    durationValue?: number,
    year?: number
  ): Observable<ILeaderboardToppers | ILeaderboardTopperDetails[]> {
    const apiEndpoint = leaderboardType + durationType;
    return this.http.get<IApiResponse<IApiResponseResultResponse<ILeaderboardToppers | ILeaderboardTopperDetails[]>>>(
      `${this.API_BASE}/${this.LEADERBOARD_API}/${leaderboardType}/${durationType}`
      + ((durationValue && year) ? `/${durationValue}/${year}` : ``)
    ).pipe(
      map(data => data.result.response)
      );
  }

  getCurrentWeekNumber(inputDate: Date) {
    const date: Date = new Date(
      Date.UTC(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate())
    );
    const dayNum = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    return Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  }
}
