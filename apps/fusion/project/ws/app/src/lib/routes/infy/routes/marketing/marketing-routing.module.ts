/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { MarketingComponent } from './marketing.component'
import { MarketingServicesComponent } from './marketing-services/marketing-services.component'
import { PageResolve, MarketingOfferingResolve } from '@ws-widget/utils'
import { PageComponent } from '@ws-widget/collection'

const BASE_URL = `assets/configurations/${location.host.replace(':', '_')}`
const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'brandAssets',
  },
  {
    path: 'offering/:tag',
    component: PageComponent,
    data: {
      pageUrl: `${BASE_URL}/page/marketing-offering.json`,
    },
    resolve: {
      pageData: MarketingOfferingResolve,
    },
  },
  {
    path: 'services',
    component: MarketingServicesComponent,
  },
  {
    path: ':tab',
    component: PageComponent,
    data: {
      pageType: 'page',
      pageKey: 'tab',
    },
    resolve: {
      pageData: PageResolve,
    },
  },
]

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: MarketingComponent,
        children: routes,
      },
    ]),
  ],
  exports: [RouterModule],
})
export class MarketingRoutingModule { }
