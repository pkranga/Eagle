/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';

// material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

import { UtilityModule } from '../../modules/utility/utility.module';
import { ContentStripModule } from '../../modules/content-strip/content-strip.module';
import { SpinnerModule } from '../../modules/spinner/spinner.module';

import { ProfileComponent } from './components/profile/profile.component';
import { PublicProfileComponent } from './components/public-profile/public-profile.component';
import { MatTabsModule } from '@angular/material/tabs';
import {
  MatTooltipModule,
  MatDialogModule,
  MatListModule
} from '@angular/material';
import { ScrollHandlerModule } from '../../modules/scroll-handler/scroll-handler.module';
import { GoalDetailsDialogComponent } from './components/goal-details-dialog/goal-details-dialog.component';
import { PlaylistDetailsDialogComponent } from './components/playlist-details-dialog/playlist-details-dialog.component';
import { CustomDirectivesModule } from '../../directives/custom-directives.module';

@NgModule({
  declarations: [
    ProfileComponent,
    PublicProfileComponent,
    GoalDetailsDialogComponent,
    PlaylistDetailsDialogComponent
  ],
  imports: [
    CommonModule,
    UtilityModule,
    ProfileRoutingModule,
    ContentStripModule,
    SpinnerModule,
    MatTooltipModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatTabsModule,
    MatDialogModule,
    MatListModule,
    ScrollHandlerModule,
    CustomDirectivesModule
  ],
  entryComponents: [GoalDetailsDialogComponent, PlaylistDetailsDialogComponent]
})
export class ProfileModule {}
