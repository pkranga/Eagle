/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { KbHomeComponent } from './routes/kb-home/kb-home.component'
import { KbDetailComponent } from './routes/kb-detail/kb-detail.component'
import { KbDetailResolve } from './resolvers/kb-detail.resolve'

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'home',
    component: KbHomeComponent,
  },
  {
    path: ':id',
    resolve: {
      content: KbDetailResolve,
    },
    component: KbDetailComponent,
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [KbDetailResolve],
})
export class KnowledgeBoardRoutingModule {}
