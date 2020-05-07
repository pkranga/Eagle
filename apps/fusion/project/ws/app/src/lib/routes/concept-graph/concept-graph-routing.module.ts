/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { ConceptHomeComponent } from './routes/concept-home/concept-home.component'
import { ConceptGraphComponent } from './routes/concept-graph/concept-graph.component'
import { ConceptRootComponent } from './routes/concept-root/concept-root.component'

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ConceptHomeComponent,
  },
  {
    path: ':ids',
    component: ConceptGraphComponent,
  },
]

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ConceptRootComponent,
        children: routes,
      },
    ]),
  ],
  exports: [RouterModule],
})
export class ConceptGraphRoutingModule {}
