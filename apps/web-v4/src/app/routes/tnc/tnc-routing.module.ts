/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TncComponent } from './components/tnc/tnc.component';
import { TncResolve } from '../../resolvers/tnc.resolve';
import { ContestRulesComponent } from './components/contest-rules/contest-rules.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: TncComponent,
    resolve: {
      tnc: TncResolve
    }
  },
  {
    path: 'contest',
    component: ContestRulesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [TncResolve],
  exports: [RouterModule]
})
export class TncRoutingModule {}
