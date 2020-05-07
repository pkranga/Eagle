/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import 'd3';
import 'nvd3';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NvD3Module } from 'ng2-nvd3';
import { MyAnalyticsComponent } from './components/my-analytics/my-analytics.component';
import { MyAnalyticsRoutingModule } from './myanalytics-routing.module';
import { BoxPlotGraphComponent } from './components/box-plot-graph/box-plot-graph.component';
import { UtilityModule } from '../../modules/utility/utility.module';
import { PieGraphComponent } from './components/pie-graph/pie-graph.component';
import { StackedGraphComponent } from './components/stacked-graph/stacked-graph.component';
import { TileComponent } from './components/tile/tile.component';
import { QuarteFilterComponent } from './components/quarte-filter/quarte-filter.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoMaterialModule } from './materialmodule';
import { MyPlansComponent } from './components/my-plans/my-plans.component';
import { MyAssessmentsComponent } from './components/my-assessments/my-assessments.component';
import { MyCollaboratorsComponent } from './components/my-collaborators/my-collaborators.component';
import { MyFeatureUsageComponent } from './components/my-feature-usage/my-feature-usage.component';
import { TopCoursesComponent } from './components/top-courses/top-courses.component';
import { OrgAnalyticsComponent } from './components/org-analytics/org-analytics.component';
import { MyLearningComponent } from './components/my-learning/my-learning.component';
import { ChartsModule } from 'ng2-charts';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { MonthlyCalenderGraphComponent } from './components/monthly-calender-graph/monthly-calender-graph.component';
import { RadarGraphComponent } from './components/radar-graph/radar-graph.component';
import { ProgressSpinnerModule } from '../../modules/progress-spinner/progress-spinner.module';
import { SpinnerModule } from '../../modules/spinner/spinner.module';
import { DonutGraphComponent } from './components/donut-graph/donut-graph.component';
import { BubbleChartComponent } from './components/bubble-chart/bubble-chart.component';
import { PieChartComponent } from './components/pie-chart/pie-chart.component';
import { PlansCardComponent } from './components/plans-card/plans-card.component';
import {AnalyticsServiceService} from './services/analytics-service.service';
import {QuarterServiceService} from './services/quarter-service.service';
import { LearningHistoryComponent } from './components/learning-history/learning-history.component';
import { CompletionSpinnerModule } from '../../modules/completion-spinner/completion-spinner.module';
@NgModule({
  declarations: [
    MyAnalyticsComponent,
    BoxPlotGraphComponent,
    PieGraphComponent,
    StackedGraphComponent,
    TileComponent,
    QuarteFilterComponent,
    MyPlansComponent,
    MyAssessmentsComponent,
    MyCollaboratorsComponent,
    MyFeatureUsageComponent,
    OrgAnalyticsComponent,
    MyLearningComponent,
    MonthlyCalenderGraphComponent,
    RadarGraphComponent,
    DonutGraphComponent,
    BubbleChartComponent,
    PieChartComponent,
    TopCoursesComponent,
    PlansCardComponent,
    LearningHistoryComponent
  ],
  imports: [
    MatProgressSpinnerModule,
    CommonModule,
    CompletionSpinnerModule,
    MyAnalyticsRoutingModule,
    NvD3Module,
    UtilityModule,
    SpinnerModule,
    ProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    DemoMaterialModule,
    ChartsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    SpinnerModule
  ],
  providers:[AnalyticsServiceService,QuarterServiceService]
})
export class MyanalyticsModule { }
