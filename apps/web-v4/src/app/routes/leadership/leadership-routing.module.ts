/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { LeadershipHomeComponent } from './components/leadership-home/leadership-home.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: LeadershipHomeComponent
  },
  {
    path: ':name',
    pathMatch: 'full',
    redirectTo: ':name/about'
  },
  {
    path: ':name/:tab',
    component: LandingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeadershipRoutingModule { }
