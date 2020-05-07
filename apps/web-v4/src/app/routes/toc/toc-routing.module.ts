/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentAccessGuard } from '../../guards/content-access.guard';
import { TocResolve } from '../../resolvers/toc.resolve';
import { TocComponent } from './components/toc/toc.component';

const routes: Routes = [
  {
    path: ':contentId',
    pathMatch: 'full',
    redirectTo: ':contentId/about'
  },
  {
    path: ':contentId/:tab',
    canActivate: [ContentAccessGuard],
    component: TocComponent,
    resolve: {
      tocContent: TocResolve
    },
    data: {
      contentAccessKeys: ['contentId']
    },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [TocResolve]
})
export class TocRoutingModule {}
