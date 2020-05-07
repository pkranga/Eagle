/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
// service imports
import { PlayerDataService } from '../services/player-data.service';

export interface IPlaylistsResolve {
  type: string;
  error?: string;
}

@Injectable()
export class PlaylistsResolve implements Resolve<IPlaylistsResolve> {
  constructor(private playerDataSvc: PlayerDataService, private router: Router) {}
  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<IPlaylistsResolve> {
    const type = 'playlists';
    try {
      this.playerDataSvc.data = { type };
      return { type };
    } catch (error) {
      return { type };
    }
  }
}
