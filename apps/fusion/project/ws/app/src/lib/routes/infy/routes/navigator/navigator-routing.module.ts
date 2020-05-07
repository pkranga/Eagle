/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { NavigatorHomeComponent } from './routes/navigator-home/navigator-home.component'
import { IndustriesComponent } from './routes/industries/industries.component'
import { ExploreComponent } from './routes/explore/explore.component'
import { RolesComponent } from './routes/roles/roles.component'
import { LeadersComponent } from './routes/leaders/leaders.component'
import { PageResolve } from '@ws-widget/utils'
import { LearningPathComponent } from './routes/learning-path/learning-path.component'
import { ResultComponent } from './routes/learning-path/components/result/result.component'
import { SearchResultResolve } from './resolvers/search-result.resolve'
import { AccountDetailsComponent } from './routes/account-details/account-details.component'
import { RoleComponent } from './routes/role/role.component'
import { LpDetailsComponent } from './routes/lp-details/lp-details.component'
import { FullstackProgramComponent } from './routes/fullstack-program/fullstack-program.component'
import { LaunchpadComponent } from './routes/launchpad/launchpad.component'
import { FsHomeComponent } from './routes/fs-home/fs-home.component'
import { IndustryAnalyticsComponent } from './routes/industry-analytics/industry-analytics.component'
import { RoleDetailsComponent } from './routes/role/role-details/role-details.component'

const API_SERVER_BASE = '/apis'

const PROXIES_SLAG_V8 = `${API_SERVER_BASE}/proxies/v8`

const routes: Routes = [
  {
    path: '',
    component: NavigatorHomeComponent,
  },
  {
    path: 'accounts',
    component: AccountDetailsComponent,
    data: {
      pageUrl: `${PROXIES_SLAG_V8}/web-hosted/navigator/json/accounts_data.json`,
    },
    resolve: {
      pageData: PageResolve,
    },
  },
  {
    path: 'accounts/:tab',
    component: AccountDetailsComponent,
    data: {
      pageUrl: `${PROXIES_SLAG_V8}/web-hosted/navigator/json/accounts_data.json`,
    },
    resolve: {
      pageData: PageResolve,
    },
  },
  {
    path: 'explore',
    component: ExploreComponent,
  },
  {
    path: 'fs/all',
    component: FsHomeComponent,
  },
  {
    path: 'fs/program/:id',
    component: FullstackProgramComponent,
  },
  {
    path: 'industries',
    component: IndustriesComponent,
    data: {
      pageUrl: `${PROXIES_SLAG_V8}/web-hosted/navigator/json/industries_data.json`,
    },
    resolve: {
      pageData: PageResolve,
    },
  },
  {
    path: 'analytics/:tag',
    component: IndustryAnalyticsComponent,
  },
  {
    path: 'industries/:tab',
    component: IndustriesComponent,
    data: {
      pageUrl: `${PROXIES_SLAG_V8}/web-hosted/navigator/json/industries_data.json`,
    },
    resolve: {
      pageData: PageResolve,
    },
  },
  {
    path: 'leaders',
    component: LeadersComponent,
    data: {
      pageUrl: `${PROXIES_SLAG_V8}/web-hosted/navigator/json/dmdata.json`,
    },
    resolve: {
      pageData: PageResolve,
    },
  },
  {
    path: 'lp/:id',
    component: LpDetailsComponent,
    data: {
      pageUrl: `${PROXIES_SLAG_V8}/web-hosted/navigator/json/data.json`,
    },
    resolve: {
      pageData: PageResolve,
    },
  },
  {
    path: 'roles',
    component: RolesComponent,
  },
  {
    path: 'role/:id',
    component: RoleComponent,
  }, {
    path: 'role-details/:variant',
    component: RoleDetailsComponent,
  },
  {
    path: 'sales/launchpad',
    component: LaunchpadComponent,
  },

  {
    path: 'tech/learning-path',
    component: LearningPathComponent,
  },
  {
    path: 'tech/learning-path/result',
    component: ResultComponent,
    resolve: {
      lpdata: SearchResultResolve,
    },
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [SearchResultResolve],
})
export class NavigatorRoutingModule {}
