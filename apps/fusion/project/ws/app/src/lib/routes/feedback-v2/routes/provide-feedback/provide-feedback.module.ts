/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import {
  MatButtonModule,
  MatTabsModule,
  MatFormFieldModule,
  MatInputModule,
  MatIconModule,
  MatProgressSpinnerModule,
  MatSnackBarModule,
  MatBadgeModule,
} from '@angular/material'

import { BtnContentFeedbackV2Module } from '@ws-widget/collection'

import { ProvideFeedbackRoutingModule } from './provide-feedback-routing.module'
import { HomeComponent } from './components/home/home.component'
import { FeedbackComponent } from './components/feedback/feedback.component'
import { ContentRequestComponent } from './components/content-request/content-request.component'
import { ServiceRequestComponent } from './components/service-request/service-request.component'
import { FeedbackApiService } from '../../apis/feedback-api.service'
import { FeedbackSummaryResolver } from '../../resolvers/feedback-summary.resolver'
import { FeedbackConfigResolver } from '../../resolvers/feedback-config.resolver'
import { TourMatMenuModule } from 'ngx-tour-md-menu'

@NgModule({
  declarations: [
    HomeComponent,
    FeedbackComponent,
    ContentRequestComponent,
    ServiceRequestComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProvideFeedbackRoutingModule,
    BtnContentFeedbackV2Module,
    MatButtonModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    TourMatMenuModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatBadgeModule,
  ],
  providers: [FeedbackApiService, FeedbackSummaryResolver, FeedbackConfigResolver],
})
export class ProvideFeedbackModule { }
