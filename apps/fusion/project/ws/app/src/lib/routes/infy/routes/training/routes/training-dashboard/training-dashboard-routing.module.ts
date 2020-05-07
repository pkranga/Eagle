/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { PageResolve } from '@ws-widget/utils'

import { HomeComponent } from './components/home/home.component'
import { TrainingScheduleComponent } from './components/training-schedule/training-schedule.component'
import { TrainingFeedbackComponent } from './components/training-feedback/training-feedback.component'
import { FeedbackListComponent } from './components/feedback-list/feedback-list.component'
import { FeedbackFormComponent } from './components/feedback-form/feedback-form.component'
import { TrainingApprovalComponent } from './components/training-approval/training-approval.component'
import { TrainingJitComponent } from './components/training-jit/training-jit.component'
import { JitFormComponent } from './components/jit-form/jit-form.component'
import { JitListComponent } from './components/jit-list/jit-list.component'
import { TrainingPrivilegesResolver } from '../../resolvers/training-privileges.resolver'

const routes: Routes = [
  {
    path: 'schedule',
    component: TrainingScheduleComponent,
  },
  {
    path: 'feedback',
    component: TrainingFeedbackComponent,
    children: [
      {
        path: 'pending',
        component: FeedbackListComponent,
      },
      {
        path: ':trainingId/:feedbackType',
        component: FeedbackFormComponent,
      },
      {
        path: '',
        redirectTo: 'pending',
      },
    ],
  },
  {
    path: 'approval',
    component: TrainingApprovalComponent,
  },
  {
    path: 'jit',
    component: TrainingJitComponent,
    children: [
      {
        path: 'request-training',
        component: JitFormComponent,
        resolve: {
          trainingConfigResolve: PageResolve,
        },
        data: {
          pageType: 'feature',
          pageKey: 'training',
        },
      },
      {
        path: 'my-training-requests',
        component: JitListComponent,
      },
      {
        path: '',
        redirectTo: 'my-training-requests',
        resolve: {
          trainingConfigResolve: PageResolve,
        },
        data: {
          pageType: 'feature',
          pageKey: 'training',
        },
      },
    ],
  },
  {
    path: '',
    redirectTo: 'schedule',
  },
]

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: HomeComponent,
        children: routes,
        resolve: {
          trainingPrivilegesResolve: TrainingPrivilegesResolver,
        },
      },
    ]),
  ],
  exports: [RouterModule],
})
export class TrainingDashboardRoutingModule {}
