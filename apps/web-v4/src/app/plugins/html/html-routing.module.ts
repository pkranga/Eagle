/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// component imports
import { HtmlComponent } from './components/html/html.component';

// resolver import
import { PluginResolve } from '../../resolvers/plugin.resolve';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HtmlComponent,
    resolve: {
      playerDetails: PluginResolve
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [PluginResolve],
  exports: [RouterModule]
})
export class HtmlRoutingModule {}
