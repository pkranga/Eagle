/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'

import {
  MatProgressSpinnerModule,
  MatCardModule,
  MatIconModule,
  MatDividerModule,
  MatButtonModule,
  MatExpansionModule,
  MatListModule,
  MatTabsModule,
} from '@angular/material'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { WidgetResolverModule } from '@ws-widget/resolver'

import { CardDetailComponent } from './components/card-detail/card-detail.component'
import { CompetencyHomeComponent } from './components/competency-home/competency-home.component'
import { AchievementsComponent } from './components/achievements/achievements.component'
import { HorizontalScrollerModule } from '@ws-widget/utils'

@NgModule({
  declarations: [CardDetailComponent, CompetencyHomeComponent, AchievementsComponent],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HorizontalScrollerModule,

    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatListModule,
    MatTabsModule,
    MatExpansionModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    WidgetResolverModule,
  ],
})
export class CompetencyModule {}
