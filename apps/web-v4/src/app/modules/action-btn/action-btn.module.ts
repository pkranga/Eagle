/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Material Modules
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';

// Components
import { BtnAnalyticsComponent } from './components/btn-analytics/btn-analytics.component';
import { BtnCallComponent } from './components/btn-call/btn-call.component';
import { BtnCohortsComponent } from './components/btn-cohorts/btn-cohorts.component';
import { BtnDownloadComponent } from './components/btn-download/btn-download.component';
import { BtnGoalsComponent } from './components/btn-goals/btn-goals.component';
import { BtnLikeComponent } from './components/btn-like/btn-like.component';
import { BtnMailMeComponent } from './components/btn-mail-me/btn-mail-me.component';
import { BtnMailUserComponent } from './components/btn-mail-user/btn-mail-user.component';
import { BtnPlaylistsComponent } from './components/btn-playlists/btn-playlists.component';
import { BtnShareComponent } from './components/btn-share/btn-share.component';
import { CallDialogComponent } from './components/call-dialog/call-dialog.component';
import { GoalSelectionComponent } from './components/goal-selection/goal-selection.component';
import { PlaylistSelectionComponent } from './components/playlist-selection/playlist-selection.component';
import { QueryMailComponent } from './components/query-mail/query-mail.component';
import { ShareDialogComponent } from './components/share-dialog/share-dialog.component';
import { SpinnerModule } from '../spinner/spinner.module';
import { MailMeDialogComponent } from './components/mail-me-dialog/mail-me-dialog.component';
import { BtnContentFeedbackComponent } from './components/btn-content-feedback/btn-content-feedback.component';
import { ContentFeedbackDialogComponent } from './components/content-feedback-dialog/content-feedback-dialog.component';
import { CustomDirectivesModule } from '../../directives/custom-directives.module';

@NgModule({
  declarations: [
    BtnAnalyticsComponent,
    BtnCallComponent,
    BtnCohortsComponent,
    BtnDownloadComponent,
    BtnGoalsComponent,
    BtnLikeComponent,
    BtnMailMeComponent,
    BtnMailUserComponent,
    BtnPlaylistsComponent,
    BtnShareComponent,
    CallDialogComponent,
    GoalSelectionComponent,
    PlaylistSelectionComponent,
    QueryMailComponent,
    ShareDialogComponent,
    MailMeDialogComponent,
    BtnContentFeedbackComponent,
    ContentFeedbackDialogComponent
  ],
  exports: [
    BtnAnalyticsComponent,
    BtnCallComponent,
    BtnCohortsComponent,
    BtnDownloadComponent,
    BtnGoalsComponent,
    BtnLikeComponent,
    BtnMailMeComponent,
    BtnMailUserComponent,
    BtnPlaylistsComponent,
    BtnShareComponent,
    BtnContentFeedbackComponent
  ],
  entryComponents: [
    CallDialogComponent,
    GoalSelectionComponent,
    PlaylistSelectionComponent,
    QueryMailComponent,
    ShareDialogComponent,
    MailMeDialogComponent,
    ContentFeedbackDialogComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
    SpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTooltipModule,
    MatDialogModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatChipsModule,
    MatInputModule,
    MatProgressBarModule,
    MatFormFieldModule,
    CustomDirectivesModule
  ]
})
export class ActionBtnModule {}
