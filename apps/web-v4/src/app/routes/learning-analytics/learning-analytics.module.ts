/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LearningAnalyticsRoutingModule } from './learning-analytics-routing.module';

// material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material';
import { LearningAnalyticsComponent } from './components/learning-analytics/learning-analytics.component';
import { ClientAnalyticsModule } from '../client-analytics/client-analytics.module';

@NgModule({
  declarations: [LearningAnalyticsComponent],
  imports: [
    CommonModule,
    LearningAnalyticsRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    ClientAnalyticsModule
  ]
})
export class LearningAnalyticsModule { }
