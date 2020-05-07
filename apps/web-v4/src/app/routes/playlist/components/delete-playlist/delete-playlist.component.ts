/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { PlaylistService } from '../../../../services/playlist.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { IUserPlayList } from '../../../../models/playlist.model';
import { TelemetryService } from '../../../../services/telemetry.service';

@Component({
  selector: 'app-delete-playlist',
  templateUrl: './delete-playlist.component.html',
  styleUrls: ['./delete-playlist.component.scss']
})
export class DeletePlaylistComponent implements OnInit {
  @ViewChild('playlistDeleted', { static: true }) playlistDeleted: ElementRef<any>;
  deleteInProgress: boolean;

  constructor(
    private snackbar: MatSnackBar,
    private playlistSvc: PlaylistService,
    public dialogRef: MatDialogRef<DeletePlaylistComponent>,
    @Inject(MAT_DIALOG_DATA) public playlist: IUserPlayList,
    private telemetrySvc: TelemetryService
  ) { }

  ngOnInit() { }

  removeUserPlaylist() {
    this.deleteInProgress = true;
    this.playlistSvc
      .removeUserPlaylist({
        playlist_id: this.playlist.playlist_id
      })
      .subscribe(response => {
        this.deleteInProgress = false;
        this.dialogRef.close();
        this.snackbar.open(this.playlistDeleted.nativeElement.value);
        this.telemetrySvc.playlistTelemetryEvent(
          'removed',
          this.playlist.playlist_id,
          this.playlist.resource_ids,
          undefined
        );
      });
  }
}
