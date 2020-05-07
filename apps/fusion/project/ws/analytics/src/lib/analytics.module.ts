/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { AnalyticsComponent } from './analytics.component'
import { AnalyticsRoutingModule } from './analytics-routing.module'

import { BtnPageBackModule, PageModule } from '@ws-widget/collection'

import {
  MatToolbarModule,
  MatButtonModule,
  MatIconModule,
} from '@angular/material'

@NgModule({
  declarations: [AnalyticsComponent],
  imports: [
    AnalyticsRoutingModule,
    BtnPageBackModule,
    PageModule,
    MatToolbarModule,
    CommonModule,
    MatButtonModule,
    MatIconModule,
  ],
  exports: [AnalyticsComponent],
})
export class AnalyticsModule { }
