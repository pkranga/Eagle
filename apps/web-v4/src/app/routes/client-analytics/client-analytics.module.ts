/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientAnalyticsComponent } from './components/client-analytics/client-analytics.component';
import { LineBarChartComponent } from './components/line-bar-chart/line-bar-chart.component';
import { BarChartComponent } from './components/bar-chart/bar-chart.component';
import { CourseDetailsComponent } from './components/course-details/course-details.component';
import { ClientAnalyticsRoutingModule } from './client-analytics-routing.module';
import { SearchComponent } from './components/search/search.component';
import { DownloadComponent } from './components/download/download.component';
import { QuaterFilterComponent } from './components/quater-filter/quater-filter.component';
import { FilterComponent } from './components/filter/filter.component';
import { TileComponent } from './components/tile/tile.component';
import { ClientTileComponent } from './components/client-tile/client-tile.component';
import { DemoMaterialModule } from './materialmodule';
import { SpinnerModule } from '../../modules/spinner/spinner.module';
import 'd3';
import 'nvd3';
import { NvD3Module } from 'ng2-nvd3';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Globals } from './utils/globals';
import { QuarterServiceService } from './services/quarter-service.service';
import { HomeAnalyticsComponent } from './components/home-analytics/home-analytics.component';
import { BoxPlotGraphComponent } from './components/box-plot-graph/box-plot-graph.component';
import { MyPlansComponent } from './components/my-plans/my-plans.component';
import { MyFeatureUsageComponent } from './components/my-feature-usage/my-feature-usage.component';
import { PlansCardComponent } from './components/plans-card/plans-card.component';
import { PieChartComponent } from './components/pie-chart/pie-chart.component';
import { TopCoursesComponent } from './components/top-courses/top-courses.component';
import { AnalyticsServiceService } from './services/analytics-service.service';
import { ProgressSpinnerModule } from '../../modules/progress-spinner/progress-spinner.module';
import { AssessmentComponent } from './components/assessment/assessment.component';
import { BarGraphComponent } from './components/bar-graph/bar-graph.component';
// import { SampleRoleTabComponent } from './components/sample-role-tab/sample-role-tab.component';

@NgModule({
  declarations: [
    ClientAnalyticsComponent,
    LineBarChartComponent,
    BarChartComponent,
    CourseDetailsComponent,
    SearchComponent,
    DownloadComponent,
    QuaterFilterComponent,
    FilterComponent,
    TileComponent,
    ClientTileComponent,
    HomeAnalyticsComponent,
    BoxPlotGraphComponent,
    MyPlansComponent,
    MyFeatureUsageComponent,
    PlansCardComponent,
    PieChartComponent,
    TopCoursesComponent,
    AssessmentComponent,
    BarGraphComponent
    // SampleRoleTabComponent
  ],
  imports: [
    CommonModule,
    DemoMaterialModule,
    ClientAnalyticsRoutingModule,
    SpinnerModule,
    NvD3Module,
    FormsModule,
    ReactiveFormsModule,
    ProgressSpinnerModule
  ],
  exports: [
    ClientAnalyticsComponent,
    LineBarChartComponent,
    BarChartComponent,
    CourseDetailsComponent,
    SearchComponent,
    DownloadComponent,
    QuaterFilterComponent,
    FilterComponent,
    TileComponent,
    ClientTileComponent,
    HomeAnalyticsComponent,
    BoxPlotGraphComponent,
    MyPlansComponent,
    MyFeatureUsageComponent,
    PlansCardComponent,
    PieChartComponent,
    TopCoursesComponent,
    AssessmentComponent,
    BarGraphComponent
  ],
  providers: [Globals, QuarterServiceService, AnalyticsServiceService]
})
export class ClientAnalyticsModule {}
