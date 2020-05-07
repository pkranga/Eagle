/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input } from '@angular/core';
import { IUserPlayList } from '../../../../models/playlist.model';
import { PlaylistService } from '../../../../services/playlist.service';
import { IContent } from '../../../../models/content.model';

@Component({
  selector: 'app-user-playlist',
  templateUrl: './user-playlist.component.html',
  styleUrls: ['./user-playlist.component.scss']
})
export class UserPlaylistComponent implements OnInit {
  @Input()
  playlistUser: IUserPlayList[];

  constructor(private playlistSvc: PlaylistService) {}

  ngOnInit() {}
}
