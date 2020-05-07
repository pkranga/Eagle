/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component } from '@angular/core'
import { MatDialogRef } from '@angular/material'

@Component({
  selector: 'ws-app-playlist-delete-dialog',
  templateUrl: './playlist-delete-dialog.component.html',
  styleUrls: ['./playlist-delete-dialog.component.scss'],
})
export class PlaylistDeleteDialogComponent {

  constructor(public dialogRef: MatDialogRef<PlaylistDeleteDialogComponent>) { }

}
