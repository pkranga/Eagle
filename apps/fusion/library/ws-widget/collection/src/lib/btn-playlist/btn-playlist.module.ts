/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { BtnPlaylistComponent } from './btn-playlist.component'
import { BtnPlaylistDialogComponent } from './btn-playlist-dialog/btn-playlist-dialog.component'
import {
  MatIconModule,
  MatTooltipModule,
  MatButtonModule,
  MatMenuModule,
  MatProgressSpinnerModule,
  MatListModule,
  MatInputModule,
  MatFormFieldModule,
  MatDialogModule,
} from '@angular/material'
import { BtnPlaylistSelectionComponent } from './btn-playlist-selection/btn-playlist-selection.component'

@NgModule({
  declarations: [BtnPlaylistComponent, BtnPlaylistDialogComponent, BtnPlaylistSelectionComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // Material Imports
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatListModule,
  ],
  exports: [BtnPlaylistComponent],
  entryComponents: [BtnPlaylistComponent, BtnPlaylistDialogComponent],
})
export class BtnPlaylistModule { }
