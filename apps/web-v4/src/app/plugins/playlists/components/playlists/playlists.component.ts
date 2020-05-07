/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../services/user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ws-playlists',
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.scss']
})
export class PlaylistsComponent implements OnInit {
  constructor(private userSvc: UserService, private route: ActivatedRoute) {}
  paramSubscription;
  playlistId;
  ngOnInit() {
    this.paramSubscription = this.route.params.subscribe(data => {
      this.playlistId = data.resourceId;
      this.userSvc.fetchPlaylistContent(this.playlistId).subscribe(data => {
        console.log(data);
      });
    });
  }
}
