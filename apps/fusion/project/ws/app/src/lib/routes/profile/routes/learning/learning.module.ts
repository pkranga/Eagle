/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { CommonModule } from '@angular/common'
import { LearningTimeComponent } from './components/learning-time/learning-time.component'
import { LearningHistoryComponent } from './components/learning-history/learning-history.component'
import { LearningHomeComponent } from './components/learning-home/learning-home.component'
import {
  MatButtonModule,
  MatIconModule,
  MatTabsModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatSelectModule,
  MatOptionModule,
  MatProgressSpinnerModule,
  MatListModule,
  MatCardModule,
  MatToolbarModule,
  MatSlideToggleModule,
  MatCheckboxModule,
  MatInputModule,
  MatGridListModule,
  MatPaginatorModule,
} from '@angular/material'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { LearningTimeResolver } from './resolvers/learning-time.resolver'
import { WidgetResolverModule } from '@ws-widget/resolver'
import { PipeDurationTransformModule } from '@ws-widget/utils'
import { LearningHistoryResolver } from './resolvers/learning-history.resolver'
import { LearningHistoryProgressComponent } from './components/learning-history-progress/learning-history-progress.component'
import { DisplayContentTypeModule } from '@ws-widget/collection'
import { ProgressRadialComponent } from './components/progress-radial/progress-radial.component'
import { CalendarModule } from '../../module/calendar-module/calendar.module'
import { HistoryCardComponent } from './components/history-card/history-card.component'

import { AnalyticsModule } from '../analytics/analytics.module'
import { BubbleChartComponent } from './components/bubble-chart/bubble-chart.component'
@NgModule({
  declarations: [
    LearningTimeComponent,
    LearningHistoryComponent,
    LearningHomeComponent,
    LearningHistoryProgressComponent,
    ProgressRadialComponent,
    HistoryCardComponent,
    BubbleChartComponent,
  ],
  imports: [
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatCardModule,
    MatToolbarModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatGridListModule,
    MatPaginatorModule,

    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CalendarModule,
    WidgetResolverModule,
    PipeDurationTransformModule,
    DisplayContentTypeModule,
    AnalyticsModule,
  ],
  providers: [LearningTimeResolver, LearningHistoryResolver],
})
export class LearningModule {}
