/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import {
  PlaylistSelectionComponent,
  PlaylistSelectionDialogData
} from '../playlist-selection/playlist-selection.component';
import { IContent } from '../../../../models/content.model';
import { UtilityService } from '../../../../services/utility.service';
import { ConfigService } from '../../../../services/config.service';

@Component({
  selector: 'app-btn-playlists',
  templateUrl: './btn-playlists.component.html',
  styleUrls: ['./btn-playlists.component.scss']
})
export class BtnPlaylistsComponent implements OnInit {
  @Input()
  content: IContent;

  @Input()
  contentName: string;

  constructor(
    private dialog: MatDialog,
    private utilSvc: UtilityService,
    private configSvc: ConfigService
  ) {}

  ngOnInit() {}
  addToPlaylist(event: Event) {
    if (event && event.stopPropagation) {
      event.stopPropagation();
    }
    if (!this.configSvc.instanceConfig.features.btnMailUsers.available) {
      this.utilSvc.featureUnavailable();
      return;
    }
    this.dialog.open<PlaylistSelectionComponent, PlaylistSelectionDialogData>(
      PlaylistSelectionComponent,
      {
        data: {
          content: this.content,
          title: this.contentName
        }
      }
    );
  }
}
