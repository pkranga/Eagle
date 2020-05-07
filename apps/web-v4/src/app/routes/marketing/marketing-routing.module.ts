/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MarketingComponent } from './components/marketing/marketing.component';
import { OfferingComponent } from './components/offering/offering.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: MarketingComponent
  },
  {
    path: 'offering',
    component: OfferingComponent
  },
  {
    path: ':type',
    pathMatch: 'full',
    component: MarketingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarketingRoutingModule {}
