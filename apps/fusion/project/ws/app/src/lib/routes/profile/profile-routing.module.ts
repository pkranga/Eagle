/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { ProfileComponent } from './profile.component'
import { DashboardComponent } from './routes/dashboard/components/dashboard/dashboard.component'
import { CompetencyHomeComponent } from './routes/competency/components/competency-home/competency-home.component'
import { LearningHomeComponent } from './routes/learning/components/learning-home/learning-home.component'
import { LearningTimeComponent } from './routes/learning/components/learning-time/learning-time.component'
import { LearningHistoryComponent } from './routes/learning/components/learning-history/learning-history.component'
import { BadgesComponent } from './routes/badges/badges.component'
import { InterestComponent } from './routes/interest/components/interest/interest.component'
import { SettingsComponent } from './routes/settings/settings.component'

import { BadgesResolver } from './routes/badges/badges.resolver'
import { InterestUserResolve } from './routes/interest/resolvers/interest-user.resolve'
import { CompetencyResolverService } from './routes/competency/resolver/assessment.resolver'
import { CardDetailComponent } from './routes/competency/components/card-detail/card-detail.component'
import { AchievementsComponent } from './routes/competency/components/achievements/achievements.component'
import { LearningComponent } from './routes/analytics/routes/learning/learning.component'
import { RefactoringComponent } from './routes/analytics/routes/refactoring/refactoring.component'
import { LearningHistoryResolver } from './routes/learning/resolvers/learning-history.resolver'
import { LearningTimeResolver } from './routes/learning/resolvers/learning-time.resolver'
import { FeatureUsageComponent } from './routes/analytics/routes/feature-usage/feature-usage.component'
import { PlansComponent } from './routes/analytics/routes/plans/plans.component'
import { PageResolve } from '@ws-widget/utils'

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    data: {
      pageType: 'feature',
      pageKey: 'profile',
    },
    resolve: {
      pageData: PageResolve,
    },
  },
  {
    path: 'competency',
    component: CompetencyHomeComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'assessment',
      },
      {
        path: 'badges',
        component: BadgesComponent,
        resolve: {
          badges: BadgesResolver,
        },
      },
      {
        path: ':type',
        component: AchievementsComponent,
        resolve: {
          competencyData: CompetencyResolverService,
        },
      },
      {
        path: ':type/details',
        component: CardDetailComponent,
      },
    ],
  },
  {
    path: 'learning',
    component: LearningHomeComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'time',
      },
      {
        path: 'time',
        component: LearningTimeComponent,
        resolve: {
          timeSpentData: LearningTimeResolver,
          pageData: PageResolve,
        },
        data: {
          pageType: 'feature',
          pageKey: 'profile',
        },
        runGuardsAndResolvers: 'paramsOrQueryParamsChange',
      },
      {
        path: 'history',
        component: LearningHistoryComponent,
        data: {
          pageType: 'feature',
          pageKey: 'profile',
        },
        resolve: {
          learningHistory: LearningHistoryResolver,
          pageData: PageResolve,
        },
      },
    ],
    data: {
      pageType: 'feature',
      pageKey: 'profile',
    },
    resolve: {
      pageData: PageResolve,
    },
  },
  {
    path: 'interest',
    component: InterestComponent,
    resolve: {
      interests: InterestUserResolve,
    },
  },
  {
    path: 'refactoring',
    component: RefactoringComponent,
  },
  {
    path: 'plans',
    component: PlansComponent,
  },
  {
    path: 'collaborators',
    component: LearningComponent,
  },
  {
    path: 'feature-usage',
    component: FeatureUsageComponent,
  },
  {
    path: 'settings',
    component: SettingsComponent,
  },
]

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ProfileComponent,
        children: routes,
        data: {
          pageType: 'feature',
          pageKey: 'profile',
        },
        resolve: {
          pageData: PageResolve,
        },
      },
    ]),
  ],
  exports: [RouterModule],
})
export class ProfileRoutingModule { }
