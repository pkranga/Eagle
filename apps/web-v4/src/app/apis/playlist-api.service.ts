/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IApiResponse } from '../models/apiResponse';
import {
  IUserPlayList,
  IUserPlaylistApiResponse,
  ISharePlayList,
  IPlaylistShareResponse,
  IPlayListSyncApiRequest,
  IUserPlaylistSync,
  IUserPlaylistSyncApiResponse,
  IUserPlaylistAddUpdateRequest,
  IPlaylistAddUpdateResponse,
  IPlaylistRemoveRequest,
  IPlaylistRemoveResponse
} from '../models/playlist.model';

@Injectable({
  providedIn: 'root'
})
export class PlaylistApiService {
  API_BASE = '/clientApi/v2';
  USER_API = `${this.API_BASE}/user`;

  apiEndpoints = {
    USER_PLAYLIST: `${this.USER_API}/playlist/getUserPlaylist`, // #GET
    ADD_UPDATE_PLAYLIST: `${this.USER_API}/playlist/addUpdatePlaylist`, // #POST
    USER_PLAYLIST_REMOVAL: `${this.USER_API}/playlist/removePlaylist`, // #DELETE
    USER_SHARED_PLAYLIST_REMOVAL: `${
      this.USER_API
    }/playlist/removeSharedPlaylist`, // #DELETE
    SHARED_PLAYLIST: `${this.USER_API}/playlist/getSharedPlaylist`, // #GET
    SYNC_PLAYLIST: `${this.USER_API}/playlist/getSyncPlaylist`, // #GET
    USER_SHARE_PLAYLIST: `${this.USER_API}/playlist/sharePlaylist`, // #POST
    COPY_SHARED_PLAYLIST: `${this.USER_API}/playlist/copySharedPlaylist` // #POST
  };

  constructor(private http: HttpClient) {}

  // For Playlist : Profile page
  fetchUserPlaylist(email?: string): Observable<IUserPlayList[]> {
    return this.http
      .get<IApiResponse<IUserPlaylistApiResponse>>(
        `${this.apiEndpoints.USER_PLAYLIST}?ts=${new Date().getTime()}` +
          (email ? `&email=${email}` : '')
      )
      .pipe(map(playlist => playlist.result.response));
  }
  sharePlaylist(req: ISharePlayList): Observable<IPlaylistShareResponse> {
    return this.http
      .post<IApiResponse<IPlaylistShareResponse>>(
        this.apiEndpoints.USER_SHARE_PLAYLIST,
        { request: req }
      )
      .pipe(map(response => response.result));
  }
  syncPlaylist(req: IPlayListSyncApiRequest): Observable<IUserPlaylistSync> {
    return this.http
      .get<IApiResponse<IUserPlaylistSyncApiResponse>>(
        `${this.apiEndpoints.SYNC_PLAYLIST}/${req.source_playlist_id}/${
          req.user_playlist_id
        }/${req.shared_by}?ts=${new Date().getTime()}`
      )
      .pipe(map(playlist => playlist.result.response));
  }
  fetchSharedPlaylist(): Observable<IUserPlayList[]> {
    return this.http
      .get<IApiResponse<IUserPlaylistApiResponse>>(
        `${this.apiEndpoints.SHARED_PLAYLIST}?ts=${new Date().getTime()}`
      )
      .pipe(map(playlist => playlist.result.response));
  }
  addUpdatePlaylist(
    req: IUserPlaylistAddUpdateRequest
  ): Observable<IPlaylistAddUpdateResponse> {
    return this.http
      .post<IApiResponse<IPlaylistAddUpdateResponse>>(
        this.apiEndpoints.ADD_UPDATE_PLAYLIST,
        { request: req }
      )
      .pipe(map(response => response.result));
  }
  copySharedPlaylist(
    req: IUserPlaylistAddUpdateRequest
  ): Observable<IPlaylistAddUpdateResponse> {
    return this.http
      .post<IApiResponse<IPlaylistAddUpdateResponse>>(
        this.apiEndpoints.COPY_SHARED_PLAYLIST,
        { request: req }
      )
      .pipe(map(response => response.result));
  }
  removeUserPlaylist(
    req: IPlaylistRemoveRequest
  ): Observable<IPlaylistRemoveResponse> {
    return this.http
      .post<IApiResponse<IPlaylistRemoveResponse>>(
        this.apiEndpoints.USER_PLAYLIST_REMOVAL,
        { request: req }
      )
      .pipe(map(response => response.result));
  }
  removeSharedPlaylist(
    req: IPlaylistRemoveRequest
  ): Observable<IPlaylistRemoveResponse> {
    return this.http
      .post<IApiResponse<IPlaylistRemoveResponse>>(
        this.apiEndpoints.USER_SHARED_PLAYLIST_REMOVAL,
        { request: req }
      )
      .pipe(map(response => response.result));
  }
}
