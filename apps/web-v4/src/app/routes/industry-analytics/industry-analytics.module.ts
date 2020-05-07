/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsComponent } from './components/analytics/analytics.component';
import { SpinnerModule } from '../../modules/spinner/spinner.module';
import { DemoMaterialModule } from './materialmodule';
import { IndustryAnalyticsRoutingModule } from './industry-analytics-routing.module';
import { PieChartComponent } from './components/pie-chart/pie-chart.component';
import { HorizontalBarChartComponent } from './components/horizontal-bar-chart/horizontal-bar-chart.component';
@NgModule({
  declarations: [AnalyticsComponent, PieChartComponent, HorizontalBarChartComponent],
  imports: [
    CommonModule,
    SpinnerModule,
    DemoMaterialModule,
    IndustryAnalyticsRoutingModule
  ]
})
export class IndustryAnalyticsModule { }
