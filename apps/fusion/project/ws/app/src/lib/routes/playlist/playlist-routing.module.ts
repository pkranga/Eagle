/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { NsPlaylist } from '@ws-widget/collection'

import { PlaylistHomeComponent } from './routes/playlist-home/playlist-home.component'
import { PlaylistCreateComponent } from './routes/playlist-create/playlist-create.component'
import { PlaylistsResolve } from './resolvers/playlists.resolve'
import { PlaylistDetailComponent } from './routes/playlist-detail/playlist-detail.component'
import { PlaylistResolve } from './resolvers/playlist.resolve'
import { PlaylistEditComponent } from './routes/playlist-edit/playlist-edit.component'
import { PlaylistNotificationComponent } from './routes/playlist-notification/playlist-notification.component'
import { PageResolve } from '@ws-widget/utils'

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'me',
  },
  {
    path: 'me',
    component: PlaylistHomeComponent,
    data: {
      type: NsPlaylist.EPlaylistTypes.ME,
      pageType: 'feature',
      pageKey: 'playlist',
    },
    resolve: {
      pageData: PageResolve,
      playlists: PlaylistsResolve,
    },
    runGuardsAndResolvers: 'paramsChange',
  },
  {
    path: 'me/:id',
    component: PlaylistDetailComponent,
    data: { type: NsPlaylist.EPlaylistTypes.ME },
    resolve: {
      playlist: PlaylistResolve,
    },
  },
  {
    path: 'me/:id/edit',
    component: PlaylistEditComponent,
    data: { type: NsPlaylist.EPlaylistTypes.ME },
    resolve: {
      playlist: PlaylistResolve,
    },
  },
  {
    path: 'shared',
    component: PlaylistHomeComponent,
    data: {
      type: NsPlaylist.EPlaylistTypes.SHARED,
      pageType: 'feature',
      pageKey: 'playlist',
    },
    resolve: {
      pageData: PageResolve,
      playlists: PlaylistsResolve,
    },
    runGuardsAndResolvers: 'paramsChange',
  },
  {
    path: 'shared/:id',
    component: PlaylistDetailComponent,
    data: { type: NsPlaylist.EPlaylistTypes.SHARED },
    resolve: {
      playlist: PlaylistResolve,
    },
  },
  {
    path: 'shared/:id/edit',
    component: PlaylistEditComponent,
    data: { type: NsPlaylist.EPlaylistTypes.SHARED },
    resolve: {
      playlist: PlaylistResolve,
    },
  },
  {
    path: 'create',
    component: PlaylistCreateComponent,
  },
  {
    path: 'notification',
    component: PlaylistNotificationComponent,
    data: { type: NsPlaylist.EPlaylistTypes.PENDING },
    resolve: {
      playlists: PlaylistsResolve,
    },
    runGuardsAndResolvers: 'paramsChange',
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [PlaylistsResolve, PlaylistResolve],
})
export class PlaylistRoutingModule { }
