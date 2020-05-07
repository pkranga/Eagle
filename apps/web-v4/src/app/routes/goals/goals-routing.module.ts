/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GoalsComponent } from './components/goals/goals.component';
import { GoalsResolve } from '../../resolvers/goals.resolve';
import { SharedGoalProgressComponent } from './components/shared-goal-progress/shared-goal-progress.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: GoalsComponent,
    resolve: {
      userGoalsProgress: GoalsResolve
    }
  },
  {
    path: 'track/:goalId',
    component: SharedGoalProgressComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [GoalsResolve],
  exports: [RouterModule]
})
export class GoalsRoutingModule { }
