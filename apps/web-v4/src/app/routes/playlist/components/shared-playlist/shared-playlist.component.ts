/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input } from '@angular/core';
import { IUserPlayList } from '../../../../models/playlist.model';
import { PlaylistService } from '../../../../services/playlist.service';
import { TelemetryService } from '../../../../services/telemetry.service';

@Component({
  selector: 'app-shared-playlist',
  templateUrl: './shared-playlist.component.html',
  styleUrls: ['./shared-playlist.component.scss']
})
export class SharedPlaylistComponent implements OnInit {
  @Input()
  playlistShared: IUserPlayList[];

  constructor(
    private playlistSvc: PlaylistService,
    private telemetrySvc: TelemetryService
  ) {}

  ngOnInit() {}

  copySharedPlaylist(playlist: IUserPlayList) {
    this.playlistSvc
      .copySharedPlaylist(
        {
          resource_ids: playlist.resource_ids,
          isShared: 0,
          playlist_title: playlist.playlist_title,
          user_action: 'create',
          shared_by: playlist.shared_by,
          source_playlist_id: playlist.playlist_id
        },
        playlist
      )
      .subscribe(result => {
        this.playlistShared = this.playlistShared.filter(
          p => p.playlist_id !== playlist.playlist_id
        );
        this.telemetrySvc.playlistTelemetryEvent(
          'accepted',
          result.playlist_id,
          playlist.resource_ids,
          undefined
        );
      });
  }

  removeSharedPlaylist(playlist: IUserPlayList) {
    this.playlistSvc
      .removeSharedPlaylist({
        playlist_id: playlist.playlist_id
      })
      .subscribe(result => {
        this.playlistShared = this.playlistShared.filter(
          p => p.playlist_id !== playlist.playlist_id
        );

        this.telemetrySvc.playlistTelemetryEvent(
          'rejected',
          playlist.playlist_id,
          playlist.resource_ids,
          undefined
        );
      });
  }
}
