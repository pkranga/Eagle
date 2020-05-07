/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { ChannelsResolverComponent } from './routes/channels-resolver/channels-resolver.component'
import { ChannelsHomeComponent } from './routes/channels-home/channels-home.component'
import { PageResolve } from '@ws-widget/utils'

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ChannelsHomeComponent,
  },
  {
    path: ':tab',
    component: ChannelsResolverComponent,
  },
]

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ChannelsHomeComponent,
        data: {
          pageType: 'feature',
          pageKey: 'channels',
        },
        resolve: {
          channelsData: PageResolve,
        },
        children: routes,
      },
    ]),
  ],
  exports: [RouterModule],
})
export class ChannelsRoutingModule { }
