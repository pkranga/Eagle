/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { KhubHomeComponent } from './components/khub-home/khub-home.component';
import { KhubViewComponent } from './components/khub-view/khub-view.component';
import { NeovisComponent } from './components/neovis/neovis.component';
import { KhubSearchComponent } from './components/khub-search/khub-search.component';
const routes: Routes = [
  {
    path: '',
    redirectTo: '/khub/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: KhubHomeComponent
  },
  {
    path: 'view/:itemId',
    component: KhubViewComponent
  },
  {
    path: 'kgraph/:topic',
    component: NeovisComponent
  },
  {
    path: 'search',
    component: KhubSearchComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KhubGoRoutingModule {}
