/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {
  IUserPlayList,
  IUserPlaylistSync
} from '../../../../models/playlist.model';
import { PlaylistService } from '../../../../services/playlist.service';
import { forkJoin } from 'rxjs';
import { TelemetryService } from '../../../../services/telemetry.service';
import { FetchStatus } from '../../../../models/status.model';

@Component({
  selector: 'app-sync-playlist',
  templateUrl: './sync-playlist.component.html',
  styleUrls: ['./sync-playlist.component.scss']
})
export class SyncPlaylistComponent implements OnInit {
  syncInformation: IUserPlaylistSync;
  toBeRemoved: any;
  toBeAdded: any;
  unaffected: any;

  fetchPlaylistDiffStatus: FetchStatus;
  syncStatus: FetchStatus;

  constructor(
    private playlistSvc: PlaylistService,
    public dialogRef: MatDialogRef<SyncPlaylistComponent>,
    @Inject(MAT_DIALOG_DATA) public playlist: IUserPlayList,
    private telemetrySvc: TelemetryService
  ) { }

  ngOnInit() {
    this.fetchPlaylistDiffStatus = 'fetching';
    this.playlistSvc
      .syncSharedPlaylist({
        shared_by: this.playlist.shared_by,
        source_playlist_id: this.playlist.source_playlist_id,
        user_playlist_id: this.playlist.playlist_id
      })
      .subscribe(result => {
        this.fetchPlaylistDiffStatus = 'done';
        this.syncInformation = result;
        if (this.syncInformation.shared_resources && this.syncInformation.notInUser) {
          this.toBeAdded = this.syncInformation.shared_resources.filter(item => {
            return this.syncInformation.notInUser.indexOf(item.resource_id) > -1;
          }
          );
        }
        if (this.syncInformation.user_resources && this.syncInformation.notInShared) {
          this.toBeRemoved = this.syncInformation.user_resources.filter(item =>
            this.syncInformation.notInShared.indexOf(item.resource_id) > -1
          );
          this.unaffected = this.syncInformation.user_resources.filter(
            item => this.syncInformation.notInShared.indexOf(item.resource_id) < 0
          );
        }
      }, error => {
        this.fetchPlaylistDiffStatus = 'error';
      });
  }

  syncPlaylist(remove: any[], add: any[]) {
    const observables = [];
    if (remove && remove.length) {
      remove = remove.map(item => item.value);
      observables.push(
        this.playlistSvc.removePlaylistContent(
          this.playlist,
          remove.map(item => item.resource_id)
        )
      );
    }

    if (add && add.length) {
      add = add.map(item => item.value);
      observables.push(this.playlistSvc.addPlaylistContent(this.playlist, add));
    }

    this.syncStatus = 'fetching';
    forkJoin(observables).subscribe(results => {
      this.syncStatus = 'done';
      this.telemetrySvc.playlistTelemetryEvent(
        'updated',
        this.playlist.playlist_id,
        this.playlist.resource_ids,
        undefined
      );
      this.dialogRef.close();
    }, () => {
      this.syncStatus = 'error';
    });
  }
}
