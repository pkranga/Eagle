/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CounterResolve } from './resolvers/counter.resolve';
import { CounterInfyMeResolve } from './resolvers/counter-infyme.resolve';
import { PlatformCounterComponent } from './components/platform-counter/platform-counter.component';
import { InfymeCounterComponent } from './components/infyme-counter/infyme-counter.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: PlatformCounterComponent,
    resolve: {
      platform: CounterResolve
    }
  },
  {
    path: 'infy-me',
    component: InfymeCounterComponent,
    resolve: {
      infyme: CounterInfyMeResolve
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [CounterResolve, CounterInfyMeResolve]
})
export class CounterRoutingModule {}
