/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// material
import { MatToolbarModule } from '@angular/material/toolbar';

import { PlaylistRoutingModule } from './playlist-routing.module';
import {
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatExpansionModule,
  MatListModule,
  MatIconModule,
  MatDialogModule,
  MatChipsModule,
  MatSnackBarModule,
  MatTooltipModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContentPickerModule } from '../../modules/content-picker/content-picker.module';

import { PlaylistComponent } from './components/playlist/playlist.component';
import { UserPlaylistComponent } from './components/user-playlist/user-playlist.component';
import { SharedPlaylistComponent } from './components/shared-playlist/shared-playlist.component';
import { AddPlaylistComponent } from './components/add-playlist/add-playlist.component';
import {
  UserPlaylistItemComponent,
} from './components/user-playlist-item/user-playlist-item.component';
import { SyncPlaylistComponent } from './components/sync-playlist/sync-playlist.component';
import { SpinnerModule } from '../../modules/spinner/spinner.module';
import { SharePlaylistComponent } from './components/share-playlist/share-playlist.component';
import { DeletePlaylistComponent } from './components/delete-playlist/delete-playlist.component';
import { DeletePlaylistContentComponent } from './components/delete-playlist-content/delete-playlist-content.component';

@NgModule({
  declarations: [
    PlaylistComponent,
    UserPlaylistComponent,
    SharedPlaylistComponent,
    AddPlaylistComponent,
    UserPlaylistItemComponent,
    SyncPlaylistComponent,
    SharePlaylistComponent,
    DeletePlaylistComponent,
    DeletePlaylistContentComponent
  ],
  imports: [
    CommonModule,
    PlaylistRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatDialogModule,
    MatExpansionModule,
    ContentPickerModule,
    MatDialogModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    SpinnerModule
  ],
  entryComponents: [
    SyncPlaylistComponent,
    SharePlaylistComponent,
    DeletePlaylistComponent,
    DeletePlaylistContentComponent
  ]
})
export class PlaylistModule {}
