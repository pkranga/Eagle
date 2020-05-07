/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  MatButtonModule,
  MatIconModule,
  MatCardModule,
  MatListModule,
  MatDialogModule,
  MatRadioModule,
  MatToolbarModule,
  MatTabsModule,
  MatSlideToggleModule
} from '@angular/material';

import { SpinnerModule } from '../../modules/spinner/spinner.module';
import { UtilityModule } from '../../modules/utility/utility.module';
import { ProgressModule } from '../../modules/progress/progress.module';
import { CustomDirectivesModule } from '../../directives/custom-directives.module';
import { LearningHistoryRoutingModule } from './learning-history-routing.module';

import { LearningHistoryComponent } from './components/learning-history/learning-history.component';
import { LearningHistoryApiService } from '../../apis/learning-history-api.service';
import { LearningHistoryProgressComponent } from './components/learning-history-progress/learning-history-progress.component';
import { ProgressRadialComponent } from './components/progress-radial/progress-radial.component';
import { CertificationApiService } from '../../apis/certification-api.service';
import { CertificationService } from '../../services/certification.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatListModule,
    MatDialogModule,
    MatRadioModule,
    MatToolbarModule,
    MatTabsModule,
    MatSlideToggleModule,
    SpinnerModule,
    UtilityModule,
    ProgressModule,
    CustomDirectivesModule,
    LearningHistoryRoutingModule
  ],
  declarations: [LearningHistoryComponent, LearningHistoryProgressComponent, ProgressRadialComponent],
  providers: [LearningHistoryApiService, CertificationService, CertificationApiService]
})
export class LearningHistoryModule {}
