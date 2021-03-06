/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { GoalHomeComponent } from './routes/goal-home/goal-home.component'
import { GoalsUserResolve } from './resolvers/goals-user.resolve'
import { GoalMeComponent } from './routes/goal-me/goal-me.component'
import { GoalCreateComponent } from './routes/goal-create/goal-create.component'
import { GoalCreateCommonComponent } from './components/goal-create-common/goal-create-common.component'
import { GoalCreateCustomComponent } from './components/goal-create-custom/goal-create-custom.component'
import { GoalsCommonResolve } from './resolvers/goals-common.resolve'
import { GoalOthersComponent } from './routes/goal-others/goal-others.component'
import { GoalsOthersResolve } from './resolvers/goals-others.resolve'
import { GoalTrackComponent } from './routes/goal-track/goal-track.component'
import { GoalTrackResolve } from './resolvers/goal-track.resolve'
import { GoalTrackAcceptComponent } from './components/goal-track-accept/goal-track-accept.component'
import { GoalTrackRejectComponent } from './components/goal-track-reject/goal-track-reject.component'
import { GoalNotificationComponent } from './routes/goal-notification/goal-notification.component'
import { GoalsPendingResolve } from './resolvers/goals-pending.resolve'
import { GoalTrackPendingComponent } from './components/goal-track-pending/goal-track-pending.component'

const routes: Routes = [
  {
    path: '',
    component: GoalHomeComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'me/all',
      },
      {
        path: 'me',
        redirectTo: 'me/all',
      },
      {
        path: 'me/all',
        component: GoalMeComponent,
        data: { type: 'all' },
        resolve: {
          userGoals: GoalsUserResolve,
        },
      },
      {
        path: 'others',
        component: GoalOthersComponent,
        resolve: {
          othersGoals: GoalsOthersResolve,
        },
      },
      {
        path: 'me/completed',
        component: GoalMeComponent,
        data: { type: 'completed' },
        resolve: {
          userGoals: GoalsUserResolve,
        },
      },
    ],
  },
  {
    path: 'others/track/:goalId',
    component: GoalTrackComponent,
    resolve: {
      trackGoal: GoalTrackResolve,
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'accepted',
      },
      {
        path: 'accepted',
        component: GoalTrackAcceptComponent,
      },
      {
        path: 'rejected',
        component: GoalTrackRejectComponent,
      },
      {
        path: 'pending',
        component: GoalTrackPendingComponent,
      },
    ],
  },
  {
    path: 'create',
    component: GoalCreateComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'common',
      },
      {
        path: 'common',
        component: GoalCreateCommonComponent,
        resolve: {
          commonGoals: GoalsCommonResolve,
        },
      },
      {
        path: 'custom',
        component: GoalCreateCustomComponent,
      },
    ],
  },
  {
    path: 'me/pending-actions',
    component: GoalNotificationComponent,
    resolve: {
      pendingGoals: GoalsPendingResolve,
    },
  },
  {
    path: 'edit/:goalType/:goalId',
    component: GoalCreateCustomComponent,
    data: { mode: 'edit' },
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [GoalsUserResolve, GoalsCommonResolve, GoalsOthersResolve, GoalTrackResolve, GoalsPendingResolve],
})
export class GoalsRoutingModule { }
