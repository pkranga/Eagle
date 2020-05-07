/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, Input, OnInit } from '@angular/core'
import { NsWidgetResolver, WidgetBaseComponent } from '@ws-widget/resolver'
import { MatDialog } from '@angular/material'
import { BtnPlaylistDialogComponent } from './btn-playlist-dialog/btn-playlist-dialog.component'
import { BtnPlaylistService } from './btn-playlist.service'
import { NsPlaylist } from './btn-playlist.model'
import { TFetchStatus } from '@ws-widget/utils'
import { NsContent } from '../_services/widget-content.model'

const VALID_CONTENT_TYPES: NsContent.EContentTypes[] = [
  NsContent.EContentTypes.MODULE,
  NsContent.EContentTypes.KNOWLEDGE_ARTIFACT,
  NsContent.EContentTypes.COURSE,
  NsContent.EContentTypes.PROGRAM,
  NsContent.EContentTypes.RESOURCE,
]

@Component({
  selector: 'ws-widget-btn-playlist',
  templateUrl: './btn-playlist.component.html',
  styleUrls: ['./btn-playlist.component.scss'],
})
export class BtnPlaylistComponent extends WidgetBaseComponent
  implements OnInit, NsWidgetResolver.IWidgetData<NsPlaylist.IBtnPlaylist> {
  @Input() widgetData!: NsPlaylist.IBtnPlaylist

  playlistsFetchStatus: TFetchStatus = 'none'
  playlists: NsPlaylist.IPlaylist[] = []
  selectedPlaylists: string[] = []
  isValidContent = false

  constructor(private dialog: MatDialog, private playlistSvc: BtnPlaylistService) {
    super()
  }

  ngOnInit() {
    if (this.widgetData && this.widgetData.contentType && VALID_CONTENT_TYPES.includes(this.widgetData.contentType)) {
      this.isValidContent = true
    }
  }

  getPlaylists(event: Event) {
    event.stopPropagation()
    this.playlistsFetchStatus = 'fetching'
    this.playlistSvc.getAllPlaylists().subscribe(
      (playlists: NsPlaylist.IPlaylist[]) => {
        this.playlists = playlists
        this.playlistsFetchStatus = 'done'
      },
      () => {
        this.playlistsFetchStatus = 'error'
      },
    )
  }

  openDialog() {
    this.dialog.open(BtnPlaylistDialogComponent, {
      width: '600px',
      data: {
        contentId: this.widgetData.contentId,
        contentName: this.widgetData.contentName,
      },
    })
  }
}
