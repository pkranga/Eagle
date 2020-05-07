/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CatalogResolve } from '../../resolvers/catalog.resolve';
import { DetailHomeComponent } from "./components/detail-home/detail-home.component";
import { JustForYouComponent } from "./components/just-for-you/just-for-you.component";
import { ChannelComponent } from "./components/channel/channel.component";
import { BroadcastComponent } from "./components/broadcast/broadcast.component";
const routes: Routes = [
  {
    path: '',
    component: DetailHomeComponent,
    resolve: {
      catalog: CatalogResolve
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'just-for-you'
      },
      {
        path: 'just-for-you',
        component: JustForYouComponent,
        data: {
          routeConfig: { featureKeys: ['infyTv'] },
          configKey: 'infyTv'
        }
      },
      {
        path: 'channels',
        component: ChannelComponent,
        resolve: {
          catalog: CatalogResolve
        }
      },
      {
        path: 'broadcast',
        component: BroadcastComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [CatalogResolve],
  exports: [RouterModule]
})
export class InfyTVRoutingModule { }
