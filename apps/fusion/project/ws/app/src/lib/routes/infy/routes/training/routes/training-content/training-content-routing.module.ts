/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { PageResolve } from '@ws-widget/utils'

import { HomeComponent } from './components/home/home.component'
import { ContentResolver } from './resolvers/content.resolver'
import { TrainingCountResolver } from './resolvers/training-count.resolver'
import { TrainingPrivilegesResolver } from '../../resolvers/training-privileges.resolver'
import { TrainingsListComponent } from './components/trainings-list/trainings-list.component'
import { TrainingDetailsComponent } from './components/training-details/training-details.component'

const routes: Routes = [
  {
    path: 'trainings',
    component: TrainingsListComponent,
    resolve: {
      trainingConfigResolve: PageResolve,
    },
    data: {
      pageType: 'feature',
      pageKey: 'training',
    },
  },
  {
    path: ':trainingId',
    component: TrainingDetailsComponent,
  },
  {
    path: '',
    redirectTo: 'trainings',
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
          contentResolve: ContentResolver,
          trainingCountResolve: TrainingCountResolver,
          trainingPrivilegesResolve: TrainingPrivilegesResolver,
        },
      },
    ]),
  ],
  exports: [RouterModule],
})
export class TrainingContentRoutingModule {}
