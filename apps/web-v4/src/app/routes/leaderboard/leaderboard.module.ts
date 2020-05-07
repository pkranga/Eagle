/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  MatListModule,
  MatCardModule,
  MatRadioModule,
  MatSelectModule,
  MatExpansionModule,
  MatTabsModule,
  MatIconModule,
  MatTooltipModule,
  MatButtonModule,
  MatToolbarModule,
  MatProgressBarModule,
  MatDividerModule
} from '@angular/material';

import { UtilityModule } from '../../modules/utility/utility.module';
import { SpinnerModule } from '../../modules/spinner/spinner.module';
import { LeaderboardRoutingModule } from './leaderboard-routing.module';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { LeaderboardApiService } from '../../apis/leaderboard-api.service';

@NgModule({
  declarations: [LeaderboardComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatListModule,
    MatCardModule,
    MatRadioModule,
    MatSelectModule,
    MatExpansionModule,
    MatTabsModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    MatToolbarModule,
    MatProgressBarModule,
    MatDividerModule,
    UtilityModule,
    SpinnerModule,
    LeaderboardRoutingModule
  ],
  providers: [LeaderboardApiService]
})
export class LeaderboardModule { }
