/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RoutingService } from '../../../../services/routing.service';
import { GoalsService } from '../../../../services/goals.service';
import {
  IUserGoalSharedWith,
  IUserGoalSharedBy,
  IPredefinedGoalsGroup,
  IPredefinedGoal
} from '../../../../models/goal.model';
import { FetchStatus } from '../../../../models/status.model';

type TUserGoalFilters = 'all' | 'in-progress' | 'completed';
@Component({
  selector: 'app-goals',
  templateUrl: './goals.component.html',
  styleUrls: ['./goals.component.scss']
})
export class GoalsComponent implements OnInit {
  goalsProgressData = this.route.snapshot.data.userGoalsProgress;
  goalsSharedWithUser: IUserGoalSharedWith[];
  goalsSharedByUser: IUserGoalSharedBy[];

  showCreate = false;

  filterMyGoals: TUserGoalFilters = 'all';
  displayMyGoals: any;

  predefinedGoals: IPredefinedGoalsGroup[];
  predefinedCheckedContent = {};
  predefinedCheckedContentMetas = [];
  selectedPredefinedGoal: IPredefinedGoal;

  showPredefinedGoalStepper: boolean;

  hasDeadlineCrossed: { [goalId: string]: boolean } = {};
  suggestedDuration: number;

  fetchPredefinedGoalsStatus: FetchStatus;

  constructor(
    private route: ActivatedRoute,
    public routingSvc: RoutingService,
    private goalsSvc: GoalsService
  ) {}

  ngOnInit() {
    this.filterChanged();
    this.goalsSvc.userGoalsProgress.subscribe(data => {
      if (data) {
        this.goalsProgressData = data;
        if (
          !this.goalsProgressData.goals_in_progress.length &&
          !this.goalsProgressData.completed_goals.length
        ) {
          this.showCreate = true;
        }
        this.goalsProgressData.goals_in_progress.concat(
          this.goalsProgressData.completed_goals.forEach(goal => {
            const date = new Date(parseInt(goal.goal_end_date, 10));
            this.hasDeadlineCrossed[goal.goal_id] =
              new Date().setHours(0, 0, 0, 0) > date.setHours(0, 0, 0, 0) &&
              goal.goalProgress < 1;
          })
        );
        this.filterChanged();
      }
    });
    this.goalsSvc.sharedWithUserGoals.subscribe(data => {
      if (data) {
        this.goalsSharedWithUser = data;
      }
    });
    this.goalsSvc.toBeSharedGoals.subscribe(data => {
      this.goalsSharedByUser = data;
    });

    this.fetchPredefinedGoalsStatus = 'fetching';
    this.goalsSvc.predefinedGoals.subscribe(
      data => {
        this.fetchPredefinedGoalsStatus = 'done';
        this.predefinedGoals = data;
        this.predefinedGoals = this.predefinedGoals.sort((a, b) =>
          a.goal_group_title.localeCompare(b.goal_group_title)
        );
        this.predefinedGoals.forEach(goalGroup => {
          goalGroup.goals = goalGroup.goals.sort((a, b) =>
            a.goal_title.localeCompare(b.goal_title)
          );
        });
      },
      error => {
        this.fetchPredefinedGoalsStatus = 'error';
      }
    );
  }

  filterChanged() {
    if (this.filterMyGoals === 'all') {
      this.displayMyGoals = this.goalsProgressData.goals_in_progress.concat(
        this.goalsProgressData.completed_goals
      );
    }
    if (this.filterMyGoals === 'in-progress') {
      this.displayMyGoals = this.goalsProgressData.goals_in_progress;
    }
    if (this.filterMyGoals === 'completed') {
      this.displayMyGoals = this.goalsProgressData.completed_goals;
    }
  }

  addPredefinedGoal(goal) {
    this.showPredefinedGoalStepper = true;
    this.selectedPredefinedGoal = goal;
    this.selectedPredefinedGoal.goal_content_id.forEach(contentId => {
      this.predefinedCheckedContent[contentId] = true;
    });
  }

  predefinedGoalCreated() {
    this.showPredefinedGoalStepper = false;
    this.selectedPredefinedGoal = undefined;
    this.predefinedCheckedContent = {};
    this.predefinedCheckedContentMetas = [];
  }
}
