/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatIconModule,
  MatTableModule,
  MatTabsModule,
  MatDividerModule,
  MatButtonModule,
  MatCardModule
} from '@angular/material';
import { TrainingDemoComponent } from './components/training-demo/training-demo.component';
import { TocTrainingCardComponent } from './components/toc-training-card/toc-training-card.component';
import { UtilityModule } from '../utility/utility.module';

@NgModule({
  declarations: [TrainingDemoComponent, TocTrainingCardComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatTableModule,
    MatTabsModule,
    MatDividerModule,
    MatButtonModule,
    MatCardModule,
    UtilityModule
  ],
  exports: [TrainingDemoComponent]
})
export class TrainingProgramDemoModule {}
