/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, Inject } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
import { TFetchStatus } from '@ws-widget/utils'
import { NsPlaylist } from '../btn-playlist.model'

@Component({
  selector: 'ws-widget-btn-playlist-dialog',
  templateUrl: './btn-playlist-dialog.component.html',
  styleUrls: ['./btn-playlist-dialog.component.scss'],
})
export class BtnPlaylistDialogComponent {

  fetchPlaylists: TFetchStatus = 'none'
  playlists: NsPlaylist.IPlaylist[] | null = null

  constructor(
    public dialogRef: MatDialogRef<BtnPlaylistDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  onPlaylistCreate() {
    this.dialogRef.close()
  }
}
