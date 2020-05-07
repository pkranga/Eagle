/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ElementRef
} from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatSnackBarModule,
  MatSnackBar
} from '@angular/material';
import { IUserPlayList } from '../../../../models/playlist.model';
import { PlaylistService } from '../../../../services/playlist.service';

@Component({
  selector: 'app-playlist-details-dialog',
  templateUrl: './playlist-details-dialog.component.html',
  styleUrls: ['./playlist-details-dialog.component.scss']
})
export class PlaylistDetailsDialogComponent implements OnInit {
  @ViewChild('successToast', { static: true }) successToast: ElementRef<any>;
  @ViewChild('failureToast', { static: true }) failureToast: ElementRef<any>;

  constructor(
    public dialogRef: MatDialogRef<PlaylistDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public playlist: IUserPlayList,
    private playlistSvc: PlaylistService,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit() {}

  copyPlaylist() {
    this.playlistSvc
      .addUpdatePlaylist({
        changed_resources: this.playlist.resource_ids,
        isShared: 0,
        playlist_title: this.playlist.playlist_title,
        resource_ids: this.playlist.resource_ids,
        user_action: 'create'
      })
      .subscribe(
        response => {
          this.snackbar.open(this.successToast.nativeElement.value);
        },
        err => {
          this.snackbar.open(this.failureToast.nativeElement.value);
        }
      );
  }
}
