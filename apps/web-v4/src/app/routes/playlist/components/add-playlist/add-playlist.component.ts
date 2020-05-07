/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { IContent } from '../../../../models/content.model';
import { PlaylistService } from '../../../../services/playlist.service';
import { TelemetryService } from '../../../../services/telemetry.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-add-playlist',
  templateUrl: './add-playlist.component.html',
  styleUrls: ['./add-playlist.component.scss']
})
export class AddPlaylistComponent implements OnInit {

  @ViewChild('createSuccess', { static: true }) toastSuccess: ElementRef;
  @ViewChild('createFailed', { static: true }) toastFailure: ElementRef;

  playlistName: string;
  checkedContent: { [identifier: string]: boolean} = {};
  checkedContentMetas: IContent[];

  createPlaylistInProgress: boolean;

  constructor(
    private snackbar: MatSnackBar,
    private playlistSvc: PlaylistService,
    private telemetrySvc: TelemetryService) { }

  ngOnInit() {
  }

  createPlaylist() {
    this.createPlaylistInProgress = true;
    this.playlistSvc.createUserPlaylist(
      this.playlistName,
      this.checkedContentMetas,
      0
    ).subscribe(
      response => {
        this.snackbar.open(this.toastSuccess.nativeElement.value);
        this.createPlaylistInProgress = false;
        this.checkedContent = {};
        this.checkedContentMetas = [];
        this.playlistName = '';
        this.telemetrySvc
          .playlistTelemetryEvent(
            'added',
            response.playlist_id,
            Object.keys(this.checkedContent),
            undefined
          );
      },
      () => {
        this.createPlaylistInProgress = false;
        this.snackbar.open(this.toastFailure.nativeElement.value);
      }
    );
  }

}
