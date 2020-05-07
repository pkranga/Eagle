/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { MatSnackBar, MatDialog } from '@angular/material'
import {
  NsPlaylist,
  BtnPlaylistService,
  NsContent,
  WidgetContentService,
  viewerRouteGenerator,
  NsError,
  ROOT_WIDGET_CONFIG,
} from '@ws-widget/collection'
import { TFetchStatus, ConfigurationsService, NsPage, UtilityService } from '@ws-widget/utils'
import { PlaylistDeleteDialogComponent } from '../../components/playlist-delete-dialog/playlist-delete-dialog.component'
import {
  PlaylistContentDeleteDialogComponent,
} from '../../components/playlist-content-delete-dialog/playlist-content-delete-dialog.component'
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'
import { PlaylistShareDialogComponent } from '../../components/playlist-share-dialog/playlist-share-dialog.component'
import {
  PlaylistContentDeleteErrorDialogComponent,
} from '../../components/playlist-content-delete-error-dialog/playlist-content-delete-error-dialog.component'
import { NsWidgetResolver } from '@ws-widget/resolver'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import {
  PLAYLIST_TITLE_MIN_LENGTH, PLAYLIST_TITLE_MAX_LENGTH,
} from '../../constants/playlist.constant'
import { Subscription } from 'rxjs'

@Component({
  selector: 'ws-app-playlist-detail',
  templateUrl: './playlist-detail.component.html',
  styleUrls: ['./playlist-detail.component.scss'],
})
export class PlaylistDetailComponent implements OnInit, OnDestroy {

  @ViewChild('playlistDeleteFailed', { static: true }) playlistDeleteFailedMessage!: ElementRef<any>

  playlist: NsPlaylist.IPlaylist | null = this.route.snapshot.data.playlist.data
  type: NsPlaylist.EPlaylistTypes = this.route.snapshot.data.type
  error = this.route.snapshot.data.playlist.error

  isIntranetAllowedSettings = false
  playlistPlayLink: { url: string, queryParams: { [key: string]: any } } | null = null
  deletePlaylistStatus: TFetchStatus = 'none'
  addContentStatus: TFetchStatus = 'none'

  selectedContentIds = new Set<string>()
  fetchPlayerUrlStatus: TFetchStatus = 'none'
  pageNavbar: Partial<NsPage.INavBackground> = this.configSvc.pageNavBar

  errorWidget: NsWidgetResolver.IRenderConfigWithTypedData<NsError.IWidgetErrorResolver> = {
    widgetType: ROOT_WIDGET_CONFIG.errorResolver._type,
    widgetSubType: ROOT_WIDGET_CONFIG.errorResolver.errorResolver,
    widgetData: {
      errorType: 'internalServer',
    },
  }
  editPlaylistForm!: FormGroup
  changeName!: boolean
  defaultThumbnail = ''
  prefChangeSubscription: Subscription | null = null

  constructor(
    fb: FormBuilder,
    private snackBar: MatSnackBar,
    public configSvc: ConfigurationsService,
    private contentSvc: WidgetContentService,
    private playlistSvc: BtnPlaylistService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    public router: Router,
    private utilitySvc: UtilityService,
  ) {
    const instanceConfig = this.configSvc.instanceConfig
    if (instanceConfig) {
      this.defaultThumbnail = instanceConfig.logos.defaultContent
    }
    this.editPlaylistForm = fb.group({
      title: [
        this.playlist ? this.playlist.name : null,
        [Validators.required, Validators.minLength(PLAYLIST_TITLE_MIN_LENGTH), Validators.maxLength(PLAYLIST_TITLE_MAX_LENGTH)],
      ],
      visibility: [NsPlaylist.EPlaylistVisibilityTypes.PRIVATE],
    })
  }

  ngOnInit() {
    if (this.playlist) {
      this.playlistSvc
        .getPlaylist(this.playlist.id, this.type)
        .subscribe(playlist => {
          this.playlist = playlist
        })
      this.getPlayUrl()
    }
    this.isIntranetAllowedSettings = this.configSvc.isIntranetAllowed
    this.prefChangeSubscription = this.configSvc.prefChangeNotifier.subscribe(() => {
      this.isIntranetAllowedSettings = this.configSvc.isIntranetAllowed
    })
  }

  ngOnDestroy() {
    if (this.prefChangeSubscription) {
      this.prefChangeSubscription.unsubscribe()
    }
  }

  deletePlaylist() {
    const dialogRef = this.dialog.open(PlaylistDeleteDialogComponent)

    dialogRef.afterClosed().subscribe(shouldDelete => {
      if (shouldDelete && this.playlist) {
        this.deletePlaylistStatus = 'fetching'
        this.playlistSvc
          .deletePlaylist(this.playlist.id, this.type)
          .subscribe(
            () => {
              this.deletePlaylistStatus = 'done'
              this.router.navigate(['/app/playlist/me'])
            },
            _err => {
              this.deletePlaylistStatus = 'error'
              this.snackBar.open(this.playlistDeleteFailedMessage.nativeElement.value)
            })
      }
    })
  }

  editName(changeName: boolean) {
    const formValues: { [field: string]: string } = this.editPlaylistForm.getRawValue()
    if (formValues.title && this.playlist) {
      this.changeName = changeName
      if (!this.changeName) {
        this.playlist.name = formValues.title
        this.playlistSvc.editPlaylistName(this.playlist)
          .subscribe()
      }
    }
  }

  cancelChange() {
    if (this.playlist) {
      this.changeName = false
      this.editPlaylistForm.patchValue({ title: this.playlist.name })
    }
  }

  deleteContent(identifier: string, name: string) {

    if (this.playlist && this.playlist.contents.length === 1) {
      this.dialog.open(PlaylistContentDeleteErrorDialogComponent)
      return
    }

    const dialogRef = this.dialog.open(PlaylistContentDeleteDialogComponent, {
      data: name,
    })

    dialogRef.afterClosed().subscribe(shouldDelete => {
      if (shouldDelete && this.playlist) {
        this.playlist.contents = this.playlist.contents.filter(item => item.identifier !== identifier)
        this.playlistSvc
          .deletePlaylistContent(this.playlist, [identifier])
          .subscribe()
      }
    })
  }

  sharePlaylist() {
    this.dialog.open(PlaylistShareDialogComponent, {
      data: this.playlist,
      width: '600px',
    })
  }

  drop(event: CdkDragDrop<string[]>) {
    if (this.playlist) {
      moveItemInArray(this.playlist.contents, event.previousIndex, event.currentIndex)
    }
  }

  contentChanged(content: Partial<NsContent.IContent>, checked: boolean) {
    const id = content.identifier || ''
    checked ? this.selectedContentIds.add(id) : this.selectedContentIds.delete(id)
  }

  editPlaylist() {
    this.addContentStatus = 'fetching'
    if (this.playlist) {
      this.playlistSvc.addPlaylistContent(this.playlist, Array.from(this.selectedContentIds)).subscribe(
        () => {
          this.addContentStatus = 'done'
        },
        () => {
          this.addContentStatus = 'error'
        },
      )
    }
  }

  getPlayUrl() {
    if (this.playlist && this.playlist.contents && this.playlist.contents.length) {
      const playlist = this.playlist
      this.contentSvc.fetchContent(this.playlist.contents[0].identifier).subscribe(response => {
        if (response) {
          const firstPlayableContent = this.contentSvc.getFirstChildInHierarchy(response)
          this.playlistPlayLink = viewerRouteGenerator(
            firstPlayableContent.identifier,
            firstPlayableContent.mimeType,
            playlist.id,
            'Playlist',
          )
        }
      },
      )
    }
  }

  greyOut(content: NsContent.IContent) {
    if (content.status && (content.status === 'Live' || content.status === 'MarkedForDeletion')) {
      return false
    }
    if (content.isInIntranet && this.utilitySvc.isMobile) {
      return !this.isIntranetAllowedSettings
    }
    return true
  }
}
