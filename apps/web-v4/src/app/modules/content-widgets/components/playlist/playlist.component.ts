/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { UserService } from '../../../../services/user.service';
import { IContent } from '../../../../models/content.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss']
})
export class PlaylistComponent implements OnInit, OnDestroy {
  @Input() cardType: 'basic' | 'advanced' = 'advanced';
  recentAddedToPlaylists: IContent[] = [];
  playlistUpdateNotifier: Subscription;
  constructor(private userSvc: UserService) { }

  ngOnInit() {
    this.fetchRecentAdditionToPlaylist();
    this.playlistUpdateNotifier = this.userSvc.playlistChangeNotifier.subscribe(
      data => {
        if (data && data.content) {
          if (data.content.identifier && data.type === 'add') {
            this.recentAddedToPlaylists = this.recentAddedToPlaylists.filter(
              content => content.identifier !== data.content.identifier
            );
            this.recentAddedToPlaylists = [
              data.content,
              ...this.recentAddedToPlaylists
            ];
          }
        }
      }
    );
  }

  ngOnDestroy() {
    if (this.playlistUpdateNotifier) {
      this.playlistUpdateNotifier.unsubscribe();
    }
  }

  fetchRecentAdditionToPlaylist() {
    this.userSvc.fetchUserRecentPlaylist().subscribe(data => {
      if (data && data.length) {
        this.recentAddedToPlaylists = data || [];
      }
    });
  }
}
