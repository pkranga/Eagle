/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, Inject } from '@angular/core'; import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
@Component({
  selector: 'ws-app-playlist-content-delete-dialog',
  templateUrl: './playlist-content-delete-dialog.component.html',
  styleUrls: ['./playlist-content-delete-dialog.component.scss']
  ,
})
export class PlaylistContentDeleteDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<PlaylistContentDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public playlistTitle: string,
  ) { }
}
