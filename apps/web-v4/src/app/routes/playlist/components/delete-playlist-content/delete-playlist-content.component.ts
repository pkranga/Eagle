/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { PlaylistService } from '../../../../services/playlist.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { TelemetryService } from '../../../../services/telemetry.service';

@Component({
  selector: 'app-delete-playlist-content',
  templateUrl: './delete-playlist-content.component.html',
  styleUrls: ['./delete-playlist-content.component.scss']
})
export class DeletePlaylistContentComponent implements OnInit {
  @ViewChild('playlistUpdated', { static: true }) playlistUpdated: ElementRef<any>;
  deleteInProgress: boolean;

  constructor(
    private snackbar: MatSnackBar,
    private playlistSvc: PlaylistService,
    public dialogRef: MatDialogRef<DeletePlaylistContentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private telemetrySvc: TelemetryService
  ) { }

  ngOnInit() { }

  deletePlaylistContent() {
    this.deleteInProgress = true;
    this.playlistSvc
      .removePlaylistContent(this.data.playlist, [this.data.item.resource_id])
      .subscribe(response => {
        this.deleteInProgress = false;
        this.dialogRef.close();
        this.snackbar.open(this.playlistUpdated.nativeElement.value);
        this.telemetrySvc.playlistTelemetryEvent(
          'updated',
          this.data.playlist.playlist_id,
          this.data.playlist.resource_ids.filter(
            id => id !== this.data.item.resource_id
          ),
          undefined
        );
      });
  }
}
