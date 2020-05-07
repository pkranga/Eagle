/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientAnalyticsComponent } from './components/client-analytics/client-analytics.component';
import { SearchComponent } from './components/search/search.component';
import { HomeAnalyticsComponent } from './components/home-analytics/home-analytics.component';
const routes: Routes = [
  {
    path: '',
    component: HomeAnalyticsComponent
  },
  {
    path: '/home-analytics',
    component: HomeAnalyticsComponent
  },
  {
    path: '/learning-analytics',
    component: ClientAnalyticsComponent
  },
  {
    path: '/search',
    component: SearchComponent
  }
  /**
   * TODO: Create a child routing system for tabs.
   * For filters use query params
   */
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientAnalyticsRoutingModule {}
