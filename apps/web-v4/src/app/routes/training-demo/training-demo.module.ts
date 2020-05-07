/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatCardModule,
  MatIconModule,
  MatTabsModule,
  MatTableModule,
  MatDividerModule,
  MatToolbarModule,
  MatButtonModule
} from '@angular/material';

import { TrainingDemoRoutingModule } from './training-demo-routing.module';
import { TrainingComponent } from './components/training/training.component';
import { TrainingCardComponent } from './components/training-card/training-card.component';
import { UtilityModule } from '../../modules/utility/utility.module';
import { TrainingBaseComponent } from './components/training-base/training-base.component';
import { TrainingDemoResolve } from './resolvers/training-demo.resolve';
import { TrainingProgramComponent } from './components/training-program/training-program.component';
import { TrainingDemoProgramResolve } from './resolvers/training-demo-program.resolve';

@NgModule({
  declarations: [TrainingComponent, TrainingCardComponent, TrainingBaseComponent, TrainingProgramComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatTabsModule,
    MatTableModule,
    MatDividerModule,
    MatToolbarModule,
    MatButtonModule,
    TrainingDemoRoutingModule,
    UtilityModule
  ],
  exports: [TrainingCardComponent],
  providers: [TrainingDemoResolve, TrainingDemoProgramResolve]
})
export class TrainingDemoModule {}
