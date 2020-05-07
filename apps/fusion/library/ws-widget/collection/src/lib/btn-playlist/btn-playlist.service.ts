/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Injectable } from '@angular/core'
import { ReplaySubject, Observable, throwError } from 'rxjs'
import { tap, mergeMap, first, map } from 'rxjs/operators'
import { NsPlaylist } from './btn-playlist.model'
import { HttpClient } from '@angular/common/http'

const API_END_POINTS = {
  featureConfig: `/assets/configurations/feature/playlist.json`,
  getAllPlaylists: `/apis/protected/v8/user/playlist`,
  deletePlaylist: `/apis/protected/v8/user/playlist`,
  playlist: (type: NsPlaylist.EPlaylistTypes) => `/apis/protected/v8/user/playlist/${type}`,
  upsertPlaylist: `/apis/protected/v8/user/playlist`,
  acceptPlaylist: (playlistId: string) => `/apis/protected/v8/user/playlist/accept/${playlistId}`,
  rejectPlaylist: (playlistId: string) => `/apis/protected/v8/user/playlist/reject/${playlistId}`,
  sharePlaylist: '/apis/protected/v8/user/playlist/share',
  updatePlaylists: (playlistId: string) => `/apis/protected/v8/user/playlist/${playlistId}`,
}

@Injectable({
  providedIn: 'root',
})
export class BtnPlaylistService {
  private playlistSubject: { [key: string]: ReplaySubject<NsPlaylist.IPlaylist[]> } = {}
  isFetchingPlaylists = false

  constructor(private http: HttpClient) {
  }

  upsertPlaylist(playlistUpsertRequest: NsPlaylist.IPlaylistUpsertRequest, updatePlaylists = true) {
    return this.http.post<string>(API_END_POINTS.upsertPlaylist, playlistUpsertRequest).pipe(
      tap(_ => {
        if (updatePlaylists) {
          this.updatePlaylists()
        }
      }),
    )
  }

  getAllPlaylistsApi() {
    return this.http
      .get<NsPlaylist.IPlaylistResponse>(API_END_POINTS.getAllPlaylists)
  }

  getPlaylists(type: NsPlaylist.EPlaylistTypes) {
    if (!this.playlistSubject[type]) {
      this.initSubjects()
    }
    this.updatePlaylists()
    return this.playlistSubject[type].asObservable()
  }

  getAllPlaylists() {
    return this.getPlaylists(NsPlaylist.EPlaylistTypes.ME).pipe(
      mergeMap((my: NsPlaylist.IPlaylist[]) => this.getPlaylists(NsPlaylist.EPlaylistTypes.SHARED).pipe(
        map((shared: NsPlaylist.IPlaylist[]) => my.concat(shared)),
      )),
    )
  }

  getPlaylist(playlistId: string, type: NsPlaylist.EPlaylistTypes): Observable<NsPlaylist.IPlaylist | null> {
    return this.http
      .get<NsPlaylist.IPlaylist>(`${API_END_POINTS.playlist(type)}/${playlistId}`)
  }

  deletePlaylist(playlistId: string, type: NsPlaylist.EPlaylistTypes) {
    return this.http.delete(`${API_END_POINTS.deletePlaylist}/${playlistId}`).pipe(
      tap(() => {
        if (this.playlistSubject[type]) {
          this.playlistSubject[type].pipe(first()).subscribe((playlists: NsPlaylist.IPlaylist[]) => {
            this.playlistSubject[type].next(playlists.filter(playlist => playlist.id !== playlistId))
          })
        }
      }),
    )
  }

  editPlaylistName(playlist: NsPlaylist.IPlaylist) {

    return this.http.patch(`${API_END_POINTS.updatePlaylists(playlist.id)}`, {
      playlist_title: playlist.name,
      content_ids: playlist.contents,
    })

  }

  addPlaylistContent(playlist: NsPlaylist.IPlaylist, contentIds: string[], updatePlaylists = true) {
    return this.upsertPlaylist(
      {
        contentIds: playlist.contents.map(content => content.identifier).concat(contentIds),
        id: playlist.id,
        title: playlist.name,
        changedContentIds: contentIds,
        editType: playlist.editType,
        userAction: NsPlaylist.EPlaylistUserAction.ADD,
        visibility: playlist.visibility,
      },
      updatePlaylists,
    )
  }

  deletePlaylistContent(playlist: NsPlaylist.IPlaylist | undefined, contentIds: string[]) {
    if (playlist) {
      return this.upsertPlaylist(
        {
          id: playlist.id,
          title: playlist.name,
          contentIds: playlist.contents
            .map(item => item.identifier || '')
            .filter(id => !contentIds.includes(id || '')),
          changedContentIds: contentIds,
          userAction: NsPlaylist.EPlaylistUserAction.DELETE,
          editType: NsPlaylist.EPlaylistEditTypes.EDIT,
          visibility: playlist.visibility,
        },
      )
    }

    return throwError({ error: 'ERROR_PLAYLIST_UNDEFINED' })
  }

  acceptPlaylist(playlistId: string) {
    return this.http.get(API_END_POINTS.acceptPlaylist(playlistId)).pipe(
      // tap(() => {
      //   if (this.playlistSubject[NsPlaylist.EPlaylistTypes.PENDING]) {
      //     this.playlistSubject[NsPlaylist.EPlaylistTypes.PENDING].pipe(first()).subscribe((playlists: NsPlaylist.IPlaylist[]) => {
      //       const acceptedPlaylist = playlists.find(playlist => playlist.id === playlistId)
      //       if (acceptedPlaylist && this.playlistSubject[NsPlaylist.EPlaylistTypes.SHARED]) {
      //         this.playlistSubject[NsPlaylist.EPlaylistTypes.SHARED].pipe(first()).subscribe(sharedPlaylist => {
      //           this.playlistSubject[NsPlaylist.EPlaylistTypes.SHARED].next([acceptedPlaylist, ...sharedPlaylist])
      //         })
      //       }
      //       this.playlistSubject[NsPlaylist.EPlaylistTypes.PENDING].next(
      //         playlists.filter(playlist => playlist.id !== playlistId),
      //       )
      //     })
      //   }
      // }),
    )
  }

  rejectPlaylist(playlistId: string) {
    return this.http.delete(API_END_POINTS.rejectPlaylist(playlistId)).pipe(
      tap(() => {
        if (this.playlistSubject[NsPlaylist.EPlaylistTypes.PENDING]) {
          this.playlistSubject[NsPlaylist.EPlaylistTypes.PENDING].pipe(first()).subscribe((playlists: NsPlaylist.IPlaylist[]) => {
            this.playlistSubject[NsPlaylist.EPlaylistTypes.PENDING].next(
              playlists.filter(playlist => playlist.id !== playlistId),
            )
          })
        }
      }),
    )
  }

  sharePlaylist(shareRequest: NsPlaylist.IPlaylistShareRequest) {
    return this.http.post(API_END_POINTS.sharePlaylist, shareRequest)
  }

  private updatePlaylists() {
    if (this.isFetchingPlaylists) {
      return
    }
    this.isFetchingPlaylists = true
    if (!Object.entries(this.playlistSubject).length) {
      this.initSubjects()
    }
    this.http
      .get<NsPlaylist.IPlaylistResponse>(API_END_POINTS.getAllPlaylists).subscribe(
        (playlists: NsPlaylist.IPlaylistResponse) => {
          this.playlistSubject[NsPlaylist.EPlaylistTypes.ME].next(playlists.user)
          this.playlistSubject[NsPlaylist.EPlaylistTypes.SHARED].next(playlists.share)
          this.playlistSubject[NsPlaylist.EPlaylistTypes.PENDING].next(playlists.pending)
          this.isFetchingPlaylists = false
        },
        error => {
          this.playlistSubject[NsPlaylist.EPlaylistTypes.ME].error(error)
          this.playlistSubject[NsPlaylist.EPlaylistTypes.SHARED].error(error)
          this.playlistSubject[NsPlaylist.EPlaylistTypes.PENDING].error(error)
          this.isFetchingPlaylists = false
        })
  }

  private initSubjects() {
    this.playlistSubject[NsPlaylist.EPlaylistTypes.ME] = new ReplaySubject<NsPlaylist.IPlaylist[]>()
    this.playlistSubject[NsPlaylist.EPlaylistTypes.SHARED] = new ReplaySubject<NsPlaylist.IPlaylist[]>()
    this.playlistSubject[NsPlaylist.EPlaylistTypes.PENDING] = new ReplaySubject<NsPlaylist.IPlaylist[]>()
  }
}
