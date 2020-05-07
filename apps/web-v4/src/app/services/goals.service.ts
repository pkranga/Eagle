/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import { map, switchMap, tap, filter, first } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import {
  IUserProgressGoals,
  IUserGoal,
  IUserGoalAddUpdateRequest,
  IUserGoalSharedWithResponse,
  IUserGoalSharedWith,
  IUserGoalSharedBy,
  IGoalAddUpdateRequest,
  IGoalAddUpdateResponse,
  IUserGoalRemovalApiRequest,
  ICommonGoalsCheckRequest,
  ICommonGoalsCheckResponse,
  IUserSharedGoalDeleteRequest,
  GoalUpdateResponse,
  IUserGoalRemoveSubsetRequest,
  IUserGoalRemoveSubset,
  ISharedGoalsProgressAccData,
  ISharedGoalsProgressCount,
  IGoalRemoveResponse,
  IPredefinedGoal,
  IPredefinedGoalsGroup
} from '../models/goal.model';

import { GoalApiService } from '../apis/goal-api.service';

@Injectable({
  providedIn: 'root'
})
export class GoalsService {
  private userGoalsSubject = new BehaviorSubject<IUserGoal[]>(null);
  private userGoalsProgressSubject = new BehaviorSubject<IUserProgressGoals>(null);
  private toBeSharedProgressSubject = new BehaviorSubject<IUserGoalSharedBy[]>(null);
  private sharedWithUserGoalsSubject = new BehaviorSubject<IUserGoalSharedWith[]>(null);
  private predefinedGoalsSubject = new BehaviorSubject<IPredefinedGoalsGroup[]>(null);
  private userGoalsUpdateInProgress = false;
  private userGoalsProgressUpdateInProgress = false;
  private toBeSharedGoalsUpdateInProgress = false;
  private sharedWithUserGoalsUpdateInProgress = false;
  private updatePredefinedInProgress = false;

  public userGoals = this.userGoalsSubject.pipe(
    tap(data => {
      if (data === null) {
        this.updateUserGoals();
      }
    }),
    filter(u => u !== null)
  );

  public userGoalsProgress = this.userGoalsProgressSubject.pipe(
    tap(data => {
      if (data === null) {
        this.updateUserGoalsProgress();
      }
    }),
    filter(u => u !== null)
  );

  public toBeSharedGoals = this.toBeSharedProgressSubject.pipe(
    tap(data => {
      if (data === null) {
        this.updateToBeSharedGoals();
      }
    }),
    filter(u => u != null)
  );

  public sharedWithUserGoals = this.sharedWithUserGoalsSubject.pipe(
    tap(data => {
      if (data === null) {
        this.updateShareWithUserGoals();
      }
    }),
    filter(u => u != null)
  );

  public predefinedGoals = this.predefinedGoalsSubject.pipe(
    tap(data => {
      if (data === null) {
        this.updatePredefinedGoals();
      }
    }),
    filter(u => u != null)
  );

  constructor(private goalsApi: GoalApiService) {}

  fetchUserProgressGoals(email?: string): Observable<IUserProgressGoals> {
    return this.goalsApi.USER_UserProgressGoals_fetch(email);
  }

  fetchGoalsSharedWithUser(): Observable<IUserGoalSharedWith[]> {
    return this.goalsApi.fetchGoalsSharedWithUser();
  }

  fetchGoalsSharedByUser(): Observable<IUserGoalSharedBy[]> {
    return this.goalsApi.fetchGoalsSharedByUser();
  }

  fetchSharedGoalsProgressData(goalObject): Observable<ISharedGoalsProgressAccData> {
    return this.goalsApi.USER_SharedGoalProgressData_fetch(goalObject);
  }

  fetchSharedGoalsProgressCount(goalObject): Observable<ISharedGoalsProgressCount> {
    return this.goalsApi.USER_SharedGoalProgressCount_fetch(goalObject);
  }

  addUpdateGoal(req: IGoalAddUpdateRequest, goalType?: string): Observable<IGoalAddUpdateResponse> {
    return this.goalsApi.addUpdateGoal(req, goalType).pipe(
      tap(response => {
        this.updateToBeSharedGoals();
        this.updateShareWithUserGoals();
        this.updateUserGoalsProgress();
        this.updatePredefinedGoals();
      })
    );
  }

  updateCommonGoalDuration(req, goalId) {
    return this.goalsApi.commonGoalDurationUpdate(req, goalId).pipe(
      tap(response => {
        this.updateUserGoalsProgress();
        this.updateToBeSharedGoals();
      })
    );
  }

  addUpdateGoal_v1(req: IGoalAddUpdateRequest): Observable<any> {
    return this.goalsApi.addUpdateGoal_v1(req).pipe(
      tap(response => {
        this.updateToBeSharedGoals();
        this.updateShareWithUserGoals();
        this.updateUserGoalsProgress();
      })
    );
  }

  updateUserGoals() {
    if (this.userGoalsUpdateInProgress) {
      return;
    }
    this.userGoalsUpdateInProgress = true;
    return this.goalsApi.fetchUserGoals().subscribe(
      userGoals => {
        this.userGoalsUpdateInProgress = false;
        this.userGoalsSubject.next(userGoals);
      },
      () => {
        this.userGoalsUpdateInProgress = false;
      }
    );
  }

  updateUserGoalsProgress() {
    if (this.userGoalsProgressUpdateInProgress) {
      return;
    }

    this.userGoalsProgressUpdateInProgress = true;
    return this.fetchUserProgressGoals().subscribe(
      userGoals => {
        this.userGoalsProgressUpdateInProgress = false;
        this.userGoalsProgressSubject.next(userGoals);
      },
      () => {
        this.userGoalsProgressUpdateInProgress = false;
      }
    );
  }

  updateToBeSharedGoals() {
    if (this.toBeSharedGoalsUpdateInProgress) {
      return;
    }
    this.toBeSharedGoalsUpdateInProgress = true;
    return this.fetchGoalsSharedByUser().subscribe(
      toBeSharedGoals => {
        this.toBeSharedGoalsUpdateInProgress = false;
        this.toBeSharedProgressSubject.next(toBeSharedGoals);
      },
      () => {
        this.toBeSharedGoalsUpdateInProgress = false;
      }
    );
  }

  updateShareWithUserGoals() {
    if (this.sharedWithUserGoalsUpdateInProgress) {
      return;
    }

    this.sharedWithUserGoalsUpdateInProgress = true;
    return this.fetchGoalsSharedWithUser().subscribe(
      sharedWithGoals => {
        this.sharedWithUserGoalsUpdateInProgress = false;
        this.sharedWithUserGoalsSubject.next(sharedWithGoals);
      },
      () => {
        this.sharedWithUserGoalsUpdateInProgress = false;
      }
    );
  }

  updatePredefinedGoals() {
    if (this.updatePredefinedInProgress) {
      return;
    }
    this.updatePredefinedInProgress = false;
    return this.fetchPredefinedGoals().subscribe(
      predefinedGoals => {
        this.updatePredefinedInProgress = false;
        this.predefinedGoalsSubject.next(predefinedGoals);
      },
      () => {
        this.updatePredefinedInProgress = false;
      }
    );
  }
  commonGoalsCheck(req: ICommonGoalsCheckRequest): Observable<ICommonGoalsCheckResponse> {
    return this.goalsApi.USER_CommonGoalsCheck(req);
  }

  addContentToGoal(goal: IUserGoal, contentId: string) {
    return this.updateGoal(goal, contentId, 'add');
  }
  removeContentFromGoal(goal: IUserGoal, contentId: string) {
    return this.updateGoal(goal, contentId, 'delete');
  }
  createGoal(goal: IUserGoalAddUpdateRequest) {
    return this.addUpdateGoal({
      goal_data: [goal]
    }).pipe(
      tap(response => {
        if (response && response.response.length && response.response[0].result === 'success') {
          this.updateUserGoals();
          this.updateUserGoalsProgress();
          this.updateToBeSharedGoals();
          this.updatePredefinedGoals();
        }
      })
    );
  }

  remindUsersOfSharedGoal(reminderObject): Observable<IGoalRemoveResponse> {
    return this.goalsApi.shareGoalOrPlaylist(reminderObject);
  }

  private updateGoal(goal: IUserGoal, contentId: string, action: 'add' | 'delete'): Observable<IUserGoal> {
    return this.goalsApi
      .USER_GoalRemoveSubset({
        goal_content_id: action === 'add' ? [...goal.goal_content_id, contentId] : goal.goal_content_id.filter(u => u !== contentId)
      })
      .pipe(
        map(response => ({
          contentIds: response.resource_list,
          time: response.suggested_time
        })),
        switchMap(({ contentIds, time }) => {
          const updatedGoal: IUserGoal = {
            ...goal,
            goal_content_id: contentIds,
            goal_duration: time
          };
          return this.addUpdateGoal({
            goal_data: [updatedGoal]
          }).pipe(map(() => updatedGoal));
        })
      );
  }

  deleteSharedGoal(req: IUserSharedGoalDeleteRequest): Observable<GoalUpdateResponse[]> {
    return this.goalsApi.USER_SharedGoal_Delete(req).pipe(
      tap(response => {
        this.updateToBeSharedGoals();
      })
    );
  }

  deleteGoal(req: IUserGoalRemovalApiRequest) {
    return this.goalsApi.USER_Goal_removal(req).pipe(
      tap(response => {
        this.userGoals.pipe(first()).subscribe(allGoals => {
          this.userGoalsSubject.next(allGoals.filter(item => item.goal_id !== req.goal_id));
        });
        this.toBeSharedGoals.pipe(first()).subscribe(allToBeSharedGoals => {
          this.toBeSharedProgressSubject.next(allToBeSharedGoals.filter(item => item.goal_id !== req.goal_id));
        });
        this.userGoalsProgress.pipe(first()).subscribe(allUserGoals => {
          this.userGoalsProgressSubject.next({
            goals_in_progress: allUserGoals.goals_in_progress.filter(g => g.goal_id !== req.goal_id),
            completed_goals: allUserGoals.completed_goals.filter(g => g.goal_id !== req.goal_id)
          });
        });
      })
    );
  }

  shareGoalOrPlaylist(req) {
    return this.goalsApi.shareGoalOrPlaylist(req);
  }

  fetchPredefinedGoals() {
    return this.goalsApi.fetchPredefinedGoals();
  }

  postShareItem(req) {
    return this.goalsApi.shareGoalOrPlaylist(req);
  }

  removeSubset(req: IUserGoalRemoveSubsetRequest): Observable<IUserGoalRemoveSubset> {
    return this.goalsApi.USER_GoalRemoveSubset(req);
  }
}
