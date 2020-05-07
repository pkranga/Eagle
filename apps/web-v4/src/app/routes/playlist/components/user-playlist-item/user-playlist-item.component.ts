/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input, Inject, ViewChild, ElementRef } from '@angular/core';
import { IUserPlayList } from '../../../../models/playlist.model';
import { PlaylistService } from '../../../../services/playlist.service';
import { IContent } from '../../../../models/content.model';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { SyncPlaylistComponent } from '../sync-playlist/sync-playlist.component';
import { SharePlaylistComponent } from '../share-playlist/share-playlist.component';
import { TelemetryService } from '../../../../services/telemetry.service';
import { DeletePlaylistComponent } from '../delete-playlist/delete-playlist.component';
import { DeletePlaylistContentComponent } from '../delete-playlist-content/delete-playlist-content.component';

@Component({
  selector: 'app-user-playlist-item',
  templateUrl: './user-playlist-item.component.html',
  styleUrls: ['./user-playlist-item.component.scss']
})
export class UserPlaylistItemComponent implements OnInit {
  @ViewChild('playlistUpdated', { static: true }) playlistUpdated: ElementRef<any>;

  @Input()
  playlist: IUserPlayList;

  checkedContent: { [identifier: string]: boolean } = {};
  checkedContentMetas: IContent[];

  showContentPicker = false;

  addContentInProgress = false;

  constructor(
    private snackbar: MatSnackBar,
    private playlistSvc: PlaylistService,
    public dialog: MatDialog,
    private telemetrySvc: TelemetryService
  ) { }

  ngOnInit() { }

  sharePlaylist(playlist: IUserPlayList, userEmails: string[]) {
    this.playlistSvc.sharePlaylist({
      playlist_id: playlist.playlist_id,
      playlist_title: playlist.playlist_title,
      resource_ids: playlist.resource_ids,
      shared_with: userEmails
    });
  }

  openSyncDialog(playlist: IUserPlayList) {
    const dialogRef = this.dialog.open(SyncPlaylistComponent, {
      width: '700px',
      data: playlist
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed', result);
    });
  }

  openDeleteDialog(playlist: IUserPlayList) {
    const dialogRef = this.dialog.open(DeletePlaylistComponent, {
      width: '700px',
      data: playlist
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed', result);
    });
  }

  openDeleteContentFromPlaylistDialog(playlist: IUserPlayList, item) {
    const dialogRef = this.dialog.open(DeletePlaylistContentComponent, {
      width: '700px',
      data: { playlist, item }
    });
  }

  openShareDialog(playlist: IUserPlayList) {
    const dialogRef = this.dialog.open(SharePlaylistComponent, {
      width: '700px',
      data: playlist
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed', result);
    });
  }

  syncSharedPlaylist(playlist: IUserPlayList) {
    this.playlistSvc
      .syncSharedPlaylist({
        shared_by: playlist.shared_by,
        user_playlist_id: playlist.playlist_id,
        source_playlist_id: playlist.source_playlist_id
      })
      .subscribe();
  }

  addPlaylistContent() {
    this.addContentInProgress = true;
    this.playlistSvc
      .updatePlaylistContent(this.playlist, this.checkedContentMetas, 'add')
      .subscribe(
        response => {
          this.addContentInProgress = false;
          this.snackbar.open(this.playlistUpdated.nativeElement.value);
          this.telemetrySvc.playlistTelemetryEvent(
            'updated',
            this.playlist.playlist_id,
            Object.keys(this.checkedContent),
            undefined
          );
          this.showContentPicker = false;
          this.checkedContent = {};
          this.checkedContentMetas = [];
        },
        () => {
          this.addContentInProgress = false;
        }
      );
  }
}
