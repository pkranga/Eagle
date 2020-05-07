/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TrainingComponent } from './components/training/training.component';
import { TrainingBaseComponent } from './components/training-base/training-base.component';
import { TrainingDemoResolve } from './resolvers/training-demo.resolve';
import { TrainingProgramComponent } from './components/training-program/training-program.component';
import { TrainingDemoProgramResolve } from './resolvers/training-demo-program.resolve';

const routes: Routes = [
  {
    path: 'all',
    component: TrainingComponent,
    resolve: {
      allTrainingData: TrainingDemoResolve
    }
  },
  {
    path: 'program-group/:groupId',
    component: TrainingProgramComponent,
    resolve: {
      programGroup: TrainingDemoProgramResolve
    }
  },
  {
    path: '',
    pathMatch: 'prefix',
    redirectTo: 'all'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrainingDemoRoutingModule {}
