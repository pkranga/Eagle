/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import {
  Component,
  Input,
  ElementRef,
  ViewChild,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core'
import { NsPlaylist } from '../btn-playlist.model'
import { BtnPlaylistService } from '../btn-playlist.service'
import { MatSnackBar, MatListOption } from '@angular/material'
import { TFetchStatus, EventService } from '@ws-widget/utils'
import { FormControl, Validators } from '@angular/forms'

@Component({
  selector: 'ws-widget-btn-playlist-selection',
  templateUrl: './btn-playlist-selection.component.html',
  styleUrls: ['./btn-playlist-selection.component.scss'],
})
export class BtnPlaylistSelectionComponent implements OnInit {
  @ViewChild('contentAdd', { static: true }) contentAddMessage!: ElementRef<any>
  @ViewChild('contentRemove', { static: true }) contentRemoveMessage!: ElementRef<any>
  @ViewChild('playlistCreate', { static: true }) playlistCreate!: ElementRef<any>
  @ViewChild('contentUpdateError', { static: true }) contentUpdateError!: ElementRef<any>

  @Input() contentId!: string
  @Output() playlistCreateEvent = new EventEmitter()

  fetchPlaylistStatus: TFetchStatus = 'none'
  playlists: NsPlaylist.IPlaylist[] = []

  createPlaylistMode = false
  selectedPlaylists = new Set<string>()

  playlistNameFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(1),
    Validators.maxLength(100),
  ])

  constructor(
    private snackBar: MatSnackBar,
    private playlistSvc: BtnPlaylistService,
    private eventSvc: EventService,
  ) { }

  ngOnInit() {
    this.fetchPlaylistStatus = 'fetching'
    this.playlistSvc.getAllPlaylistsApi().subscribe(response => {
      this.fetchPlaylistStatus = 'done'
      this.playlists = response.user
      this.playlists.forEach(playlist => {
        if (playlist.contents.map(content => content.identifier).includes(this.contentId)) {
          this.selectedPlaylists.add(playlist.id)
        }
      })
    })
  }

  selectionChange(option: MatListOption) {
    const playlistId = option.value
    const checked = option.selected
    const playlist = this.playlists.find(item => item.id === playlistId)
    if (playlist && checked) {
      this.raiseTelemetry('add', playlistId, this.contentId)
      this.playlistSvc.addPlaylistContent(playlist, [this.contentId]).subscribe(
        () => {
          this.snackBar.open(this.contentAddMessage.nativeElement.value)
        },
        _ => {
          this.snackBar.open(this.contentUpdateError.nativeElement.value)
          this.selectedPlaylists.delete(playlistId)
          option.toggle()
        },
      )
    } else if (playlist && !checked) {
      this.raiseTelemetry('remove', playlistId, this.contentId)
      this.playlistSvc.deletePlaylistContent(playlist, [this.contentId]).subscribe(
        () => {
          this.snackBar.open(this.contentRemoveMessage.nativeElement.value)
        },
        _ => {
          this.snackBar.open(this.contentUpdateError.nativeElement.value)
          this.selectedPlaylists.add(playlistId)
          option.toggle()
        },
      )
    }
  }

  createPlaylist(playlistName: string, successToast: string, errorToast: string) {
    this.playlistCreateEvent.emit()
    this.playlistSvc.upsertPlaylist(
      {
        title: playlistName,
        changedContentIds: [this.contentId],
        contentIds: [this.contentId],
        editType: NsPlaylist.EPlaylistEditTypes.EDIT,
        userAction: NsPlaylist.EPlaylistUserAction.CREATE,
        visibility: NsPlaylist.EPlaylistVisibilityTypes.PRIVATE,
      },
      false,
    )
      .subscribe(
        _ => {
          this.snackBar.open(successToast)
        },
        _ => {
          this.snackBar.open(errorToast)
        },
      )
  }

  raiseTelemetry(action: 'add' | 'remove', playlistId: string, contentId: string) {
    this.eventSvc.raiseInteractTelemetry('playlist', `btn-playlist-${action}`, {
      playlistId,
      contentId,
    })
  }
}
