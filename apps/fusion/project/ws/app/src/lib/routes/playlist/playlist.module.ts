/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import {
  MatIconModule,
  MatInputModule,
  MatTabsModule,
  MatButtonModule,
  MatSelectModule,
  MatButtonToggleModule,
  MatCheckboxModule,
  MatMenuModule,
  MatDialogModule,
  MatCardModule,
  MatRippleModule,
  MatSnackBarModule,
  MatToolbarModule,
  MatProgressSpinnerModule,
  MatTooltipModule,
} from '@angular/material'

import { PlaylistRoutingModule } from './playlist-routing.module'
import { PlaylistCardComponent } from './components/playlist-card/playlist-card.component'
import { PlaylistContentDeleteDialogComponent } from './components/playlist-content-delete-dialog/playlist-content-delete-dialog.component'
import { PlaylistDeleteDialogComponent } from './components/playlist-delete-dialog/playlist-delete-dialog.component'
import { PlaylistHomeComponent } from './routes/playlist-home/playlist-home.component'
import { PlaylistEditComponent } from './routes/playlist-edit/playlist-edit.component'
import { PlaylistNotificationComponent } from './routes/playlist-notification/playlist-notification.component'
import { PlaylistDetailComponent } from './routes/playlist-detail/playlist-detail.component'
import {
  BtnPlaylistModule,
  BtnPageBackModule,
  PickerContentModule,
  DisplayContentTypeModule,
  // EmailInputModule,
  TreeCatalogModule,
  UserImageModule,
  DisplayContentsModule,
  UserAutocompleteModule,
} from '@ws-widget/collection'
import { FilterPlaylistPipe } from './pipes/filter-playlist.pipe'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { PlaylistCreateComponent } from './routes/playlist-create/playlist-create.component'
import { PipeDurationTransformModule, DefaultThumbnailModule } from '@ws-widget/utils'
import { PlaylistShareDialogComponent } from './components/playlist-share-dialog/playlist-share-dialog.component'
import {
  PlaylistContentDeleteErrorDialogComponent,
} from './components/playlist-content-delete-error-dialog/playlist-content-delete-error-dialog.component'
import { WidgetResolverModule } from '@ws-widget/resolver'
import { TourMatMenuModule } from 'ngx-tour-md-menu'

@NgModule({
  declarations: [
    PlaylistCardComponent,
    PlaylistContentDeleteDialogComponent,
    PlaylistDeleteDialogComponent,
    PlaylistHomeComponent,
    PlaylistEditComponent,
    PlaylistNotificationComponent,
    PlaylistDetailComponent,
    FilterPlaylistPipe,
    PlaylistCreateComponent,
    PlaylistShareDialogComponent,
    PlaylistContentDeleteErrorDialogComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PlaylistRoutingModule,
    BtnPlaylistModule,
    BtnPageBackModule,
    WidgetResolverModule,
    DisplayContentTypeModule,
    PickerContentModule,
    PipeDurationTransformModule,
    // EmailInputModule,
    TreeCatalogModule,
    DefaultThumbnailModule,
    DisplayContentsModule,
    UserImageModule,
    UserAutocompleteModule,
    TourMatMenuModule,

    // material imports
    MatIconModule,
    MatInputModule,
    MatTabsModule,
    MatRippleModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatMenuModule,
    MatDialogModule,
    MatCardModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatTooltipModule,
  ],
  entryComponents: [
    PlaylistContentDeleteDialogComponent,
    PlaylistContentDeleteErrorDialogComponent,
    PlaylistDeleteDialogComponent,
    PlaylistShareDialogComponent,
  ],
})
export class PlaylistModule { }
