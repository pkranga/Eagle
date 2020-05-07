/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { HomeComponent } from './components/home/home.component'
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component'
import { HallOfFameComponent } from './components/hall-of-fame/hall-of-fame.component'
import { HallOfFameResolver } from './resolvers/hall-of-fame.resolver'
import { LeaderboardResolver } from './resolvers/leaderboard.resolver'

const routes: Routes = [
  {
    path: 'hall-of-fame',
    component: HallOfFameComponent,
    resolve: {
      hallOfFameResolve: HallOfFameResolver,
    },
  },
  {
    path: 'weekly',
    component: LeaderboardComponent,
    resolve: {
      leaderboardResolve: LeaderboardResolver,
    },
  },
  {
    path: 'monthly',
    component: LeaderboardComponent,
    resolve: {
      leaderboardResolve: LeaderboardResolver,
    },
  },
  {
    path: '',
    redirectTo: 'weekly',
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
export class LeaderboardRoutingModule {}
