/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { HomeComponent } from './components/home/home.component'

const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./routes/training-dashboard/training-dashboard.module').then(
        u => u.TrainingDashboardModule,
      ),
  },
  {
    path: ':contentId',
    loadChildren: () =>
      import('./routes/training-content/training-content.module').then(u => u.TrainingContentModule),
  },
  {
    path: '',
    redirectTo: 'dashboard',
  },
]

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: HomeComponent,
        children: routes,
      },
    ]),
  ],
  exports: [RouterModule],
})
export class TrainingRoutingModule {}
