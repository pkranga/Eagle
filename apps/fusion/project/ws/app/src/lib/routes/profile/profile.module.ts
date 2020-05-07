/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import {
  MatButtonModule,
  MatIconModule,
  MatListModule,
  MatSidenavModule,
  MatToolbarModule,
  MatTooltipModule,
} from '@angular/material'
import { TourMatMenuModule } from 'ngx-tour-md-menu'

// modules
import { ProfileRoutingModule } from './profile-routing.module'
import { BadgesModule } from './routes/badges/badges.module'
import { CompetencyModule } from './routes/competency/competency.module'
import { DashboardModule } from './routes/dashboard/dashboard.module'
import { LearningModule } from './routes/learning/learning.module'
import { InterestModule } from './routes/interest/interest.module'
import { SettingsModule } from './routes/settings/settings.module'
import { RouterModule } from '@angular/router'
import { BtnPageBackModule } from '@ws-widget/collection'

// comps
import { ProfileComponent } from './profile.component'

import { InterestUserResolve } from './routes/interest/resolvers/interest-user.resolve'
import { BadgesResolver } from './routes/badges/badges.resolver'
import { CompetencyResolverService } from './routes/competency/resolver/assessment.resolver'
import { LogoutModule } from '@ws-widget/utils'
import { AnalyticsModule } from './routes/analytics/analytics.module'
import { LearningTimeResolver } from './routes/learning/resolvers/learning-time.resolver'
import { LearningHistoryResolver } from './routes/learning/resolvers/learning-history.resolver'

@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    BadgesModule,
    CompetencyModule,
    DashboardModule,
    InterestModule,
    LearningModule,
    SettingsModule,
    AnalyticsModule,
    BtnPageBackModule,
    LogoutModule,
    TourMatMenuModule,
    RouterModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
  ],
  providers: [
    InterestUserResolve,
    BadgesResolver,
    CompetencyResolverService,
    LearningTimeResolver,
    LearningHistoryResolver,
  ],
})
export class ProfileModule { }
