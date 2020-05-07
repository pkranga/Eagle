/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { PageComponent } from '@ws-widget/collection'
import { PageResolve } from '../../../../../library/ws-widget/utils/src/public-api'
import { AnalyticsGuard } from './guards/analytics.guard'

const BASE_URL = `assets/configurations/${location.host.replace(':', '_')}`
const routes: Routes = [
  {
    path: '',
    component: PageComponent,
    data: {
      pageUrl: `${BASE_URL}/page/embed-learning-analytics`,
    },
    resolve: {
      pageData: PageResolve,
    },
    canActivate: [AnalyticsGuard],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnalyticsRoutingModule { }
