/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ForbiddenComponent } from './components/forbidden/forbidden.component';
import { InternalServerErrorComponent } from './components/internal-server-error/internal-server-error.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ServiceUnavailableComponent } from './components/service-unavailable/service-unavailable.component';
import { UnauthorisedComponent } from './components/unauthorised/unauthorised.component';
import { DisabledFeatureComponent } from './components/disabled-feature/disabled-feature.component';
import {UnavailableFeatureComponent} from './components/unavailable-feature/unavailable-feature.component';
const routes: Routes = [
  {
    path: 'forbidden',
    component: ForbiddenComponent
  },
  {
    path: 'internal-server-error',
    component: InternalServerErrorComponent
  },
  {
    path: 'feature-disabled',
    component: DisabledFeatureComponent
  },
  {
    path: 'feature-unavailable',
    component: UnavailableFeatureComponent
  },
  {
    path: 'page-not-found',
    component: NotFoundComponent
  },
  {
    path: 'service-unavailable',
    component: ServiceUnavailableComponent
  },
  {
    path: 'unauthorized',
    component: UnauthorisedComponent
  },
  {
    path: '',
    pathMatch: 'full',
    component: InternalServerErrorComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ErrorRoutingModule {}
