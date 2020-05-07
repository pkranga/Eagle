/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewerComponent } from './components/viewer/viewer.component';
import { ViewerResolve } from '../../resolvers/viewer.resolve';
import { ContentAccessGuard } from '../../guards/content-access.guard';

const routes: Routes = [
  {
    path: ':contentId/:resourceId',
    canActivate: [ContentAccessGuard],
    component: ViewerComponent,
    resolve: {
      viewerDetails: ViewerResolve
    },
    data: {
      contentAccessKeys: ['contentId', 'resourceId']
    },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange'
  },
  {
    path: ':resourceId',
    canActivate: [ContentAccessGuard],
    component: ViewerComponent,
    resolve: {
      viewerDetails: ViewerResolve
    },
    data: {
      contentAccessKeys: ['resourceId']
    },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [ViewerResolve]
})
export class ViewerRoutingModule {}
