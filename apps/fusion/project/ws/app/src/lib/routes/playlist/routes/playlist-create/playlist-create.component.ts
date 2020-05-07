/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, ViewChild, ElementRef } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { MatSnackBar } from '@angular/material'

import { TFetchStatus, NsPage, ConfigurationsService, EventService } from '@ws-widget/utils'
import { NsPlaylist, IPickerContentData, BtnPlaylistService, NsContent, NsAutoComplete } from '@ws-widget/collection'
import {
  PLAYLIST_TITLE_MIN_LENGTH, PLAYLIST_TITLE_MAX_LENGTH,
} from '../../constants/playlist.constant'

@Component({
  selector: 'ws-app-playlist-create',
  templateUrl: './playlist-create.component.html',
  styleUrls: ['./playlist-create.component.scss'],
})
export class PlaylistCreateComponent {

  @ViewChild('selectContent', { static: true }) selectContentMessage!: ElementRef<any>
  @ViewChild('createPlaylistError', { static: true }) createPlaylistErrorMessage!: ElementRef<any>
  @ViewChild('playlistForm', { static: true }) playlistForm!: ElementRef<any>

  createPlaylistForm: FormGroup
  createPlaylistStatus: TFetchStatus = 'none'

  pickerContentData: IPickerContentData = {
    availableFilters: ['contentType'],
  }

  selectedContentIds: Set<string> = new Set()
  // shareWithEmailIds: string[] | undefined = undefined
  sharedWithUsers: NsAutoComplete.IUserAutoComplete[] = []

  pageNavbar: Partial<NsPage.INavBackground> = this.configurationSvc.pageNavBar
  constructor(
    fb: FormBuilder,
    private router: Router,
    private events: EventService,
    private snackBar: MatSnackBar,
    private playlistSvc: BtnPlaylistService,
    private configurationSvc: ConfigurationsService,
  ) {
    this.createPlaylistForm = fb.group({
      title: [
        null,
        [Validators.required, Validators.minLength(PLAYLIST_TITLE_MIN_LENGTH), Validators.maxLength(PLAYLIST_TITLE_MAX_LENGTH)],
      ],
      visibility: [NsPlaylist.EPlaylistVisibilityTypes.PRIVATE],
      message: '',
    })
  }

  onContentSelectionChanged(content: Partial<NsContent.IContent>, checked: boolean) {
    if (content && content.identifier) {
      checked ? this.selectedContentIds.add(content.identifier) : this.selectedContentIds.delete(content.identifier)
    }
  }

  onFormSubmit() {
    if (this.createPlaylistForm && !this.createPlaylistForm.valid) {
      this.createPlaylistForm.markAsTouched({ onlySelf: true })
      if (this.playlistForm) {
        this.playlistForm.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
      return
    }

    if (!this.selectedContentIds.size) {
      this.snackBar.open(this.selectContentMessage.nativeElement.value)
      return
    }

    const formValues: { [field: string]: string } = this.createPlaylistForm.getRawValue()

    this.createPlaylistStatus = 'fetching'
    this.createPlaylistForm.disable()
    this.raiseTelemetry()
    this.playlistSvc.upsertPlaylist({
      title: formValues.title,
      changedContentIds: Array.from(this.selectedContentIds),
      contentIds: Array.from(this.selectedContentIds),
      editType: NsPlaylist.EPlaylistEditTypes.EDIT,
      shareWith: this.sharedWithUsers.map(user => user.wid),
      shareMsg: formValues.message,
      userAction: NsPlaylist.EPlaylistUserAction.CREATE,
      visibility: formValues.visibility as NsPlaylist.EPlaylistVisibilityTypes,
    }).subscribe(
      () => {
        this.router.navigate(['/app/playlist/me'])
      },
      () => {
        this.createPlaylistStatus = 'error'
        this.createPlaylistForm.enable()
        this.snackBar.open(this.createPlaylistErrorMessage.nativeElement.value)
      },
    )
  }

  updateUsers(users: NsAutoComplete.IUserAutoComplete[]) {
    if (Array.isArray(users)) {
      this.sharedWithUsers = users
    }
  }

  raiseTelemetry() {
    this.events.raiseInteractTelemetry(
      'playlist',
      'create',
      {},
    )
  }
}
