/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CatalogComponent } from './components/catalog/catalog.component';
import { CatalogResolve } from '../../resolvers/catalog.resolve';
import { CatalogDetailsComponent } from './components/catalog-details/catalog-details.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: CatalogComponent,
    resolve: {
      catalog: CatalogResolve
    }
  },
  {
    path: ':id',
    component: CatalogDetailsComponent,
    resolve: {
      catalog: CatalogResolve
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [CatalogResolve],
  exports: [RouterModule]
})
export class CatalogRoutingModule { }
