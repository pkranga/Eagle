/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import { PlaylistApiService } from '../apis/playlist-api.service';
import { Observable, BehaviorSubject } from 'rxjs';
import {
  IUserPlayList,
  ISharePlayList,
  IPlaylistShareResponse,
  IPlaylistAddUpdateResponse,
  IPlayListContent,
  IUserPlaylistAddUpdateRequest,
  IPlaylistRemoveRequest,
  IPlayListSyncApiRequest
} from '../models/playlist.model';
import { tap, filter, first, map } from 'rxjs/operators';
import { IContent } from '../models/content.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  private userPlaylistSubject = new BehaviorSubject<IUserPlayList[]>(null);
  private userPlaylistUpdateInProgress = null;
  public userPlaylist = this.userPlaylistSubject.pipe(
    tap(u => {
      if (u === null) {
        this.updateUserPlaylist();
      }
    }),
    filter(u => u !== null)
  );
  constructor(private playlistApi: PlaylistApiService, private authSvc: AuthService) {}

  public fetchUserPlaylist(email?: string) {
    return this.playlistApi.fetchUserPlaylist(email);
  }

  private updateUserPlaylist() {
    if (this.userPlaylistUpdateInProgress) {
      return;
    }
    this.userPlaylistUpdateInProgress = true;
    this.fetchUserPlaylist().subscribe(
      data => {
        this.userPlaylistSubject.next(data);
        this.userPlaylistUpdateInProgress = false;
      },
      () => {
        this.userPlaylistUpdateInProgress = false;
      }
    );
  }
  fetchSharedPlaylist(): Observable<IUserPlayList[]> {
    return this.playlistApi.fetchSharedPlaylist();
  }

  updatePlaylistContent(playlist: IUserPlayList, contents: IContent | IContent[], action: 'add' | 'delete'): Observable<any | IUserPlayList> {
    if (!Array.isArray(contents)) {
      contents = [contents];
    }

    const content_ids = contents.map(content => content.identifier);
    const content_metas = contents.map(content => ({
      contentType: content.contentType,
      mimeType: content.mimeType,
      resource_id: content.identifier,
      resource_name: content.name,
      time_duration: content.duration.toString()
    }));

    const resourceIds = action === 'add' ? [...playlist.resource_ids, ...content_ids] : playlist.resource_ids.filter(u => !content_ids.includes(u));
    return this.playlistApi
      .addUpdatePlaylist({
        changed_resources: content_ids,
        isShared: playlist.isshared,
        playlist_id: playlist.playlist_id,
        playlist_title: playlist.playlist_title,
        resource_ids: resourceIds,
        user_action: action
      })
      .pipe(
        map(response => ({
          ...playlist,
          resource_ids: resourceIds,
          resource: action === 'add' ? [...playlist.resource, ...content_metas] : playlist.resource.filter(u => !content_ids.includes(u.resource_id))
        })),
        tap(updatedPlaylist => {
          this.userPlaylist.pipe(first()).subscribe(playlists => {
            this.userPlaylistSubject.next(playlists.map(p => (p.playlist_id === updatedPlaylist.playlist_id ? updatedPlaylist : p)));
          });
        })
      );
  }

  addPlaylistContent(playlist: IUserPlayList, resources: any) {
    const resourceIds = resources.map(item => item.resource_id);
    return this.playlistApi
      .addUpdatePlaylist({
        changed_resources: resourceIds,
        playlist_id: playlist.playlist_id,
        resource_ids: playlist.resource_ids.concat(resourceIds),
        user_action: 'add',
        playlist_title: playlist.playlist_title
      })
      .pipe(
        map(response => ({
          ...playlist,
          resource: playlist.resource.concat(resources)
        })),
        tap(updatedPlaylist => {
          this.userPlaylist.pipe(first()).subscribe(playlists => {
            this.userPlaylistSubject.next(playlists.map(p => (p.playlist_id === updatedPlaylist.playlist_id ? updatedPlaylist : p)));
          });
        })
      );
  }
  removePlaylistContent(playlist: IUserPlayList, resourceIds: string[]) {
    return this.playlistApi
      .addUpdatePlaylist({
        changed_resources: resourceIds,
        playlist_id: playlist.playlist_id,
        resource_ids: playlist.resource_ids.filter(item => !resourceIds.includes(item)),
        user_action: 'delete',
        playlist_title: playlist.playlist_title
      })
      .pipe(
        map(response => ({
          ...playlist,
          resource: playlist.resource.filter(u => !resourceIds.includes(u.resource_id))
        })),
        tap(updatedPlaylist => {
          this.userPlaylist.pipe(first()).subscribe(playlists => {
            this.userPlaylistSubject.next(playlists.map(p => (p.playlist_id === updatedPlaylist.playlist_id ? updatedPlaylist : p)));
          });
        })
      );
  }

  addUpdatePlaylist(req) {
    return this.playlistApi.addUpdatePlaylist(req);
  }

  createUserPlaylist(title: string, contents: IContent[], isShared: 0 | 1 = 0) {
    const resourceIds = contents.map(c => c.identifier);
    return this.playlistApi
      .addUpdatePlaylist({
        changed_resources: resourceIds,
        isShared,
        playlist_title: title,
        resource_ids: resourceIds,
        user_action: 'create'
      })
      .pipe(
        tap(res => {
          const newPlaylist: IUserPlayList = {
            playlist_id: res.playlist_id,
            playlist_title: title,
            isshared: isShared,
            resource_ids: resourceIds,
            shared_by: null,
            source_playlist_id: null,
            visibility: 'private',
            user_email: this.authSvc.userEmail,
            created_on: Date.now(),
            shared_on: Date.now(),
            isChecked: null,
            shared_with: null,
            resource: contents.map(
              (c: IContent): IPlayListContent => ({
                contentType: c.contentType,
                mimeType: c.mimeType,
                resource_id: c.identifier,
                resource_name: c.name,
                time_duration: c.duration.toString()
              })
            )
          };
          this.userPlaylist.pipe(first()).subscribe(playlists => {
            this.userPlaylistSubject.next([newPlaylist, ...playlists]);
          });
          // this.updateUserPlaylist();
        })
      );
  }

  copySharedPlaylist(req: IUserPlaylistAddUpdateRequest, playlist: IUserPlayList): Observable<IPlaylistAddUpdateResponse> {
    return this.playlistApi.copySharedPlaylist(req).pipe(
      tap(response => {
        this.playlistApi.fetchUserPlaylist().subscribe((data: any) => {
          console.log(data);
          this.userPlaylistSubject.next(data);
        });
      })
    );
  }

  sharePlaylist(req: ISharePlayList): Observable<IPlaylistShareResponse> {
    return this.playlistApi.sharePlaylist(req);
  }

  removeUserPlaylist(req: IPlaylistRemoveRequest) {
    return this.playlistApi.removeUserPlaylist(req).pipe(
      tap(updatedPlaylist => {
        this.userPlaylist.pipe(first()).subscribe(playlists => {
          this.userPlaylistSubject.next(playlists.filter(p => p.playlist_id !== req.playlist_id));
        });
      })
    );
  }

  removeSharedPlaylist(req: IPlaylistRemoveRequest) {
    return this.playlistApi.removeSharedPlaylist(req).pipe(
      tap(updatedPlaylist => {
        this.userPlaylist.pipe(first()).subscribe(playlists => {
          this.userPlaylistSubject.next(playlists.filter(p => p.playlist_id !== req.playlist_id));
        });
      })
    );
  }

  syncSharedPlaylist(req: IPlayListSyncApiRequest) {
    return this.playlistApi.syncPlaylist(req);
  }
}
