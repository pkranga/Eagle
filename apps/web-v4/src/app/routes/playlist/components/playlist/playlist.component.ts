/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IUserPlayList, ISharePlayList } from '../../../../models/playlist.model';
import { PlaylistService } from '../../../../services/playlist.service';
import { IContent } from '../../../../models/content.model';
import { RoutingService } from '../../../../services/routing.service';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss']
})
export class PlaylistComponent implements OnInit {
  playlistUser: IUserPlayList[] = this.route.snapshot.data.playlistUser;
  playlistShared: IUserPlayList[] = [];

  showCreate = false;
  constructor(private route: ActivatedRoute, private playlistSvc: PlaylistService, public routingSvc: RoutingService) {}

  ngOnInit() {
    this.playlistSvc.userPlaylist.subscribe(data => {
      this.playlistUser = data;
      if (!this.playlistUser || !this.playlistUser.length) {
        this.showCreate = true;
      }
    });
    this.playlistSvc.fetchSharedPlaylist().subscribe(data => {
      this.playlistShared = data;
    });
  }
}
