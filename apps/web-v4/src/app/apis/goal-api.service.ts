/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Observer } from 'rxjs';
import { interval } from 'rxjs';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { tap } from 'rxjs/operators';
import { mergeMap, first, catchError } from 'rxjs/operators';
import { IApiResponse } from '../models/apiResponse';
import {
  IPredefinedGoalsGroup,
  IPredefinedGoalApiResponse,
  IUserGoal,
  IUserGoalsApiResponse,
  ISharedGoalsProgressAccData,
  ISharedGoalProgressDataApiResponse,
  ISharedGoalsProgressCount,
  ISharedGoalProgressCountApiResponse,
  IUserProgressGoals,
  IUserProgressGoalsApiResponse,
  IUserGoalSharedWith,
  IUserGoalSharedWithResponse,
  IUserGoalSharedBy,
  IUserGoalSharedByResponse,
  IGoalAddUpdateRequest,
  IGoalAddUpdateResponse,
  ICommonGoalsCheckRequest,
  ICommonGoalsCheckResponse,
  IUserGoalRemovalApiRequest,
  IGoalRemoveResponse,
  IUserGoalRemoveSubsetRequest,
  IUserGoalRemoveSubset,
  IUserGoalRemoveSubsetApiResponse,
  IUserSharedGoalDeleteRequest,
  GoalUpdateResponse,
  IUserSharedGoalDeleteResponse
} from '../models/goal.model';
import { IEmailResponse } from '../models/email.model';

@Injectable({
  providedIn: 'root'
})
export class GoalApiService {
  constructor(private http: HttpClient) { }

  API_BASE = '/clientApi/v2';
  USER_API = `${this.API_BASE}/user`;

  apiEndpoints = {
    // user.goal
    USER_GOAL: `${this.USER_API}/goal`, // #GET|POST #DELETE/:goalID/:goalType
    USER_GOAL_COMMON: `${this.USER_API}/goal/common`, // #GET
    USER_GOAL_CUSTOM: `${this.USER_API}/goal/custom`, // #GET
    USER_GOAL_REMOVE_SUBSET: `${this.USER_API}/goal/removeSubset`,
    USER_GOAL_SHARED_WITH: `${this.USER_API}/goal/sharedWith`,
    USER_SHARED_PROGRESS_COUNT: `${this.USER_API}/goal/progressCount`,
    USER_SHARED_PROGRESS_DATA: `${this.USER_API}/goal/progressData`,
    USER_GOAL_SHARED_BY: `${this.USER_API}/goal/sharedBy`,
    USER_SHARED_GOAL_DELETE: `${this.USER_API}/goal/deleteShared`,
    USER_COMMON_GOALS_CHECK: `${this.USER_API}/goal/commonGoalsCheck`,
    USER_SHARE_ITEM: `${this.USER_API}/share/shareItem`,
    USER_GOAL_V1: `${this.USER_API}/goal/v1`,
    COMMON_GOAL_DURATION_UPDATE: `${this.USER_API}/`
  };

  // For Goals : Profile page
  fetchPredefinedGoals(): Observable<IPredefinedGoalsGroup[]> {
    return this.http
      .get<IApiResponse<IPredefinedGoalApiResponse>>(
        `${this.apiEndpoints.USER_GOAL_COMMON}?ts=${new Date().getTime()}`
      )
      .pipe(map(goals => goals.result.response));
  }
  fetchUserGoals(): Observable<IUserGoal[]> {
    return this.http
      .get<IApiResponse<IUserGoalsApiResponse>>(
        `${this.apiEndpoints.USER_GOAL_CUSTOM}?ts=${new Date().getTime()}`
      )
      .pipe(map(goals => goals.result.response));
  }
  shareGoalOrPlaylist(req): Observable<IEmailResponse> {
    return this.http
      .post<IApiResponse<IEmailResponse>>(this.apiEndpoints.USER_SHARE_ITEM, {
        request: req
      })
      .pipe(map(response => response.result));
  }
  fetchSharedGoalProgressData(req): Observable<ISharedGoalsProgressAccData> {
    return this.http
      .get<IApiResponse<ISharedGoalProgressDataApiResponse>>(
        `${this.apiEndpoints.USER_SHARED_PROGRESS_DATA}/${req.goal_id}/${
        req.goal_type
        }/${req.type}?ts=${new Date().getTime()}`
      )
      .pipe(map(goals => goals.result.response));
  }

  USER_SharedGoalProgressData_fetch(
    req
  ): Observable<ISharedGoalsProgressAccData> {
    return this.http
      .get<IApiResponse<ISharedGoalProgressDataApiResponse>>(
        `${this.apiEndpoints.USER_SHARED_PROGRESS_DATA}/${req.goal_id}/${
        req.goal_type
        }/${req.type}?ts=${new Date().getTime()}`
      )
      .pipe(map(goals => goals.result.response));
  }

  USER_SharedGoalProgressCount_fetch(
    req
  ): Observable<ISharedGoalsProgressCount> {
    return this.http
      .get<IApiResponse<ISharedGoalProgressCountApiResponse>>(
        `${this.apiEndpoints.USER_SHARED_PROGRESS_COUNT}/${req.goal_id}/${
        req.goal_type
        }/${req.type}?ts=${new Date().getTime()}`
      )
      .pipe(map(goals => goals.result.response));
  }
  USER_UserProgressGoals_fetch(email?: string): Observable<IUserProgressGoals> {
    const url = email
      ? `${
      this.apiEndpoints.USER_GOAL
      }?ts=${new Date().getTime()}&email=${email}`
      : `${this.apiEndpoints.USER_GOAL}?ts=${new Date().getTime()}`;
    return this.http
      .get<IApiResponse<IUserProgressGoalsApiResponse>>(url)
      .pipe(map(goals => goals.result.response));
  }
  fetchGoalsSharedWithUser(): Observable<IUserGoalSharedWith[]> {
    return this.http
      .get<IApiResponse<IUserGoalSharedWithResponse>>(
        `${this.apiEndpoints.USER_GOAL_SHARED_WITH}?ts=${new Date().getTime()}`
      )
      .pipe(map(goals => goals.result.response));
  }
  fetchGoalsSharedByUser(): Observable<IUserGoalSharedBy[]> {
    return this.http
      .get<IApiResponse<IUserGoalSharedByResponse>>(
        `${this.apiEndpoints.USER_GOAL_SHARED_BY}?ts=${new Date().getTime()}`
      )
      .pipe(map(goals => goals.result.response));
  }
  addUpdateGoal(
    req: IGoalAddUpdateRequest,
    goalType?: string
  ): Observable<IGoalAddUpdateResponse> {
    return this.http
      .post<IApiResponse<IGoalAddUpdateResponse>>(this.apiEndpoints.USER_GOAL + (goalType ? `type=${goalType}` : ''), {
        request: req
      })
      .pipe(map(response => response.result));
  }

  addUpdateGoal_v1(
    req: IGoalAddUpdateRequest
  ): Observable<IGoalAddUpdateResponse> {
    return this.http
      .post<IApiResponse<IGoalAddUpdateResponse>>(
        this.apiEndpoints.USER_GOAL_V1,
        {
          request: req
        }
      )
      .pipe(map(response => response.result));
  }

  USER_CommonGoalsCheck(
    req: ICommonGoalsCheckRequest
  ): Observable<ICommonGoalsCheckResponse> {
    return this.http
      .post<IApiResponse<ICommonGoalsCheckResponse>>(
        this.apiEndpoints.USER_COMMON_GOALS_CHECK,
        { request: req }
      )
      .pipe(map(response => response.result));
  }

  commonGoalDurationUpdate(req, goalId) {
    return this.http.put<any>(
      this.apiEndpoints.USER_GOAL_COMMON + '/' + goalId,
      req
    );
  }
  USER_Goal_removal(
    req: IUserGoalRemovalApiRequest
  ): Observable<IGoalRemoveResponse> {
    return this.http
      .delete<IApiResponse<IGoalRemoveResponse>>(
        `${this.apiEndpoints.USER_GOAL}/${req.goal_id}/${req.goal_type}`
      )
      .pipe(map(response => response.result));
  }
  USER_GoalRemoveSubset(
    req: IUserGoalRemoveSubsetRequest
  ): Observable<IUserGoalRemoveSubset> {
    return this.http
      .post<IApiResponse<IUserGoalRemoveSubsetApiResponse>>(
        this.apiEndpoints.USER_GOAL_REMOVE_SUBSET,
        { request: req }
      )
      .pipe(map(response => response.result.response));
  }

  USER_SharedGoal_Delete(
    req: IUserSharedGoalDeleteRequest
  ): Observable<GoalUpdateResponse[]> {
    return this.http
      .post<IApiResponse<IUserSharedGoalDeleteResponse>>(
        this.apiEndpoints.USER_SHARED_GOAL_DELETE,
        { request: req }
      )
      .pipe(map(response => response.result.response));
  }
}
