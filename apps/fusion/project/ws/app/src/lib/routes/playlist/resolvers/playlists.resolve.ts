/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Injectable } from '@angular/core'
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'

import { Observable, of } from 'rxjs'
import { map, catchError, first } from 'rxjs/operators'

import { IResolveResponse } from '@ws-widget/utils'
import { NsPlaylist, BtnPlaylistService } from '@ws-widget/collection'

@Injectable()
export class PlaylistsResolve
  implements
  Resolve<
  | Observable<IResolveResponse<NsPlaylist.IPlaylist[]>>
  | IResolveResponse<NsPlaylist.IPlaylist[]>
  > {
  constructor(private playlistSvc: BtnPlaylistService) { }

  resolve(
    route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot,
  ): Observable<IResolveResponse<NsPlaylist.IPlaylist[]>> {
    return this.playlistSvc
      .getPlaylists(route.data.type)
      .pipe(
        first(),
        map(data => ({ data, error: null })),
        catchError(error => of({ error, data: null })),
      )
  }
}
