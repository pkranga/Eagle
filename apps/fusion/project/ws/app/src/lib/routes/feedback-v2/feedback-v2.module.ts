/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatToolbarModule } from '@angular/material'

import { BtnPageBackModule } from '@ws-widget/collection'

import { FeedbackV2RoutingModule } from './feedback-v2-routing.module'
import { HomeComponent } from './components/home/home.component'
import { TourMatMenuModule } from 'ngx-tour-md-menu'

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    FeedbackV2RoutingModule,
    BtnPageBackModule,
    MatToolbarModule,
    TourMatMenuModule,
  ],
})
export class FeedbackV2Module { }
