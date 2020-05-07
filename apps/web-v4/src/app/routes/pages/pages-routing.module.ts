/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesHomeComponent } from './components/pages-home/pages-home.component';
import { SHomeComponent } from '../../modules/siemens/components/s-home/s-home.component';
import { HHomeComponent } from '../../modules/siemens/components/h-home/h-home.component';
import { UnconsciousBiasComponent } from '../../modules/siemens/components/unconscious-bias/unconscious-bias.component';
import { DigitalizationComponent } from '../../modules/siemens/components/digitalization/digitalization.component';
import { ChannelsComponent } from '../../modules/siemens/components/channels/channels.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'channels',
  },
  {
    path: 's-home',
    component: SHomeComponent
  },
  {
    path: 'h-home',
    component: HHomeComponent
  },
  {
    path: 'unconscious-bias',
    component: UnconsciousBiasComponent
  },
  {
    path: 'digitalization',
    component: DigitalizationComponent
  },
  {
    path: 'channels',
    component: ChannelsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
