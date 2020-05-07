/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { PlaylistService } from '../../../../services/playlist.service';
import {
  IUserPlayList,
  IPlaylistAddUpdateResponse
} from '../../../../models/playlist.model';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { IContent } from '../../../../models/content.model';
import { FormControl, Validators } from '@angular/forms';
import { UserService } from '../../../../services/user.service';

export interface PlaylistSelectionDialogData {
  content: IContent;
  title: string;
}
interface IPlaylistSelectionUnit {
  hasContent: boolean;
  playlist: IUserPlayList;
  updating: boolean;
}
@Component({
  selector: 'app-playlist-selection',
  templateUrl: './playlist-selection.component.html',
  styleUrls: ['./playlist-selection.component.scss']
})
export class PlaylistSelectionComponent implements OnInit {

  @ViewChild('playlistUpdateSuccess', { static: true }) playlistUpdateSuccess: ElementRef;
  @ViewChild('failedPlaylistToast', { static: true }) failedPlaylistToast: ElementRef;

  playlistCreationInProgress = false;
  playlistIsLoading = true;
  playlistCreationEnabled = false;
  selectionPlaylists$: Observable<
    IPlaylistSelectionUnit[]
    > = this.playlistSvc.userPlaylist.pipe(
      tap(() => (this.playlistIsLoading = false)),
      map(playlists =>
        playlists.map(
          (playlist: IUserPlayList): IPlaylistSelectionUnit => ({
            playlist,
            updating: false,
            hasContent: playlist.resource_ids.includes(
              this.data.content.identifier
            )
          })
        )
      )
    );

  playlistNameFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(10)
  ]);
  constructor(
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<PlaylistSelectionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PlaylistSelectionDialogData,
    private playlistSvc: PlaylistService,
    private userSvc: UserService
  ) { }

  ngOnInit() { }

  createPlaylist(title: string, createSuccessToast: string) {
    this.playlistCreationInProgress = true;
    this.playlistSvc.createUserPlaylist(title, [this.data.content]).subscribe(
      (data: IPlaylistAddUpdateResponse) => {
        this.playlistCreationInProgress = false;
        this.snackBar.open(createSuccessToast);
        this.dialogRef.close();
      },
      () => {
        this.playlistCreationInProgress = false;
        this.snackBar.open(this.failedPlaylistToast.nativeElement.value);
      }
    );
  }
  updatePlaylist(selectionPlaylist: IPlaylistSelectionUnit) {
    selectionPlaylist.updating = true;
    this.playlistSvc
      .updatePlaylistContent(
      selectionPlaylist.playlist,
      this.data.content,
      selectionPlaylist.hasContent ? 'delete' : 'add'
      )
      .subscribe(
      () => {
        selectionPlaylist.updating = false;
        this.userSvc.playlistChangeNotifier.next({
          content: this.data.content,
          type: selectionPlaylist.hasContent ? 'delete' : 'add'
        });
        this.snackBar.open(this.playlistUpdateSuccess.nativeElement.value);
      },
      () => {
        selectionPlaylist.updating = false;
        this.snackBar.open(this.failedPlaylistToast.nativeElement.value);
      }
      );
  }
  unitPlaylistTrackBy(index: number, item: IPlaylistSelectionUnit) {
    return item.playlist.playlist_id;
  }
}
