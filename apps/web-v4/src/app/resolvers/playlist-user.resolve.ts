/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

import { Observable } from 'rxjs';
import { PlaylistService } from '../services/playlist.service';
import { IUserPlayList } from '../models/playlist.model';
import { first } from 'rxjs/operators';

@Injectable()
export class PlaylistUserResolve implements Resolve<IUserPlayList[]> {
  constructor(private playlistSvc: PlaylistService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<IUserPlayList[]> | Promise<IUserPlayList[]> | IUserPlayList[] {
    return this.playlistSvc.userPlaylist.pipe(first());
  }
}
