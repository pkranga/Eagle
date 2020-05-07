/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, Inject, ViewChild, ElementRef } from '@angular/core'
import { NsPlaylist, BtnPlaylistService, NsAutoComplete } from '@ws-widget/collection'
import { TFetchStatus } from '@ws-widget/utils'
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material'

@Component({
  selector: 'ws-app-playlist-shar-dialog',
  templateUrl: './playlist-share-dialog.component.html',
  styleUrls: ['./playlist-share-dialog.component.scss'],
})
export class PlaylistShareDialogComponent {

  @ViewChild('shareError', { static: true }) shareErrorMessage!: ElementRef<any>

  users: NsAutoComplete.IUserAutoComplete[] = []
  sharePlaylistStatus: TFetchStatus = 'none'

  constructor(
    private snackBar: MatSnackBar,
    private playlistSvc: BtnPlaylistService,
    private dialogRef: MatDialogRef<PlaylistShareDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public playlist: NsPlaylist.IPlaylist,
  ) { }

  sharePlaylist(shareMsg: string, successToast: string) {
    if (this.playlist) {
      this.sharePlaylistStatus = 'fetching'
      this.playlistSvc.sharePlaylist({
        shareMsg,
        id: this.playlist.id,
        contentIds: this.playlist.contents.map(content => content.identifier),
        name: this.playlist.name,
        shareWith: this.users.map(user => user.wid),
      }).subscribe(
        () => {
          this.sharePlaylistStatus = 'done'
          this.snackBar.open(successToast)
          this.dialogRef.close()
        },
        () => {
          this.sharePlaylistStatus = 'error'
          this.snackBar.open(this.shareErrorMessage.nativeElement.value)
        },
      )
    }
  }

  updateUsers(users: NsAutoComplete.IUserAutoComplete[]) {
    if (Array.isArray(users)) {
      this.users = users
    }
  }

}
