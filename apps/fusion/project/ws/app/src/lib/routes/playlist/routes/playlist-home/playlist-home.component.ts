/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

import { NsPlaylist, BtnPlaylistService, NsError, ROOT_WIDGET_CONFIG, CustomTourService } from '@ws-widget/collection'
import { Subscription } from 'rxjs'
import { NsWidgetResolver } from '@ws-widget/resolver'
import { NsPage, ConfigurationsService } from '@ws-widget/utils'

@Component({
  selector: 'ws-app-playlist-home',
  templateUrl: './playlist-home.component.html',
  styleUrls: ['./playlist-home.component.scss'],
})
export class PlaylistHomeComponent implements OnInit, OnDestroy, AfterViewInit {

  EPlaylistTypes = NsPlaylist.EPlaylistTypes
  playlists: NsPlaylist.IPlaylist[] = this.route.snapshot.data.playlists.data
  type: NsPlaylist.EPlaylistTypes = this.route.snapshot.data.type
  error = this.route.snapshot.data.playlists.error

  numNotifications = 0

  playlistsSubscription: Subscription | null = null
  notificationsSubscription: Subscription | null = null

  searchPlaylistQuery = ''

  pageNavbar: Partial<NsPage.INavBackground> = this.configurationSvc.pageNavBar
  errorWidget: NsWidgetResolver.IRenderConfigWithTypedData<NsError.IWidgetErrorResolver> = {
    widgetType: ROOT_WIDGET_CONFIG.errorResolver._type,
    widgetSubType: ROOT_WIDGET_CONFIG.errorResolver.errorResolver,
    widgetData: {
      errorType: 'internalServer',
    },
  }
  @ViewChild('playliststart', { static: true }) playliststartRef!: ElementRef<any>
  @ViewChild('playlistwelcome', { static: true }) playlistwelcomeRef!: ElementRef<any>
  @ViewChild('playlistserach', { static: true }) playlistserachRef!: ElementRef<any>
  @ViewChild('playlistsearchTitle', { static: true }) playlistsearchTitleRef!: ElementRef<any>
  @ViewChild('playlisttab1', { static: true }) playlisttab1Ref!: ElementRef<any>
  @ViewChild('playlisttab1Title', { static: true }) playlisttab1TitleRef!: ElementRef<any>
  @ViewChild('playlistcreateNew', { static: true }) playlistcreateNewRef!: ElementRef<any>
  @ViewChild('playlistcreateNewTitle', { static: true }) playlistcreateNewTitleRef!: ElementRef<any>

  constructor(
    private route: ActivatedRoute,
    private playlistSvc: BtnPlaylistService,
    private configurationSvc: ConfigurationsService,
    private tour: CustomTourService,
  ) { }

  ngOnInit() {
    this.playlistsSubscription = this.playlistSvc
      .getPlaylists(this.type)
      .subscribe(
        playlists => {
          this.playlists = playlists
        })
    this.notificationsSubscription = this.playlistSvc
      .getPlaylists(NsPlaylist.EPlaylistTypes.PENDING)
      .subscribe(pending => this.numNotifications = pending.length)
  }
  ngAfterViewInit() {
    this.configurationSvc.tourGuideNotifier.next(true)
    this.tour.data = [{
      anchorId: 'playlist_start',
      content: this.playliststartRef.nativeElement.value,
      placement: 'auto',
      title: this.playlistwelcomeRef.nativeElement.value,
      enableBackdrop: true,
    }, {
      anchorId: 'playlist_search',
      content: this.playlistserachRef.nativeElement.value,
      title: this.playlistsearchTitleRef.nativeElement.value,
      enableBackdrop: true,
    }, {
      anchorId: 'playlist_tab1',
      content: this.playlisttab1Ref.nativeElement.value,
      title: this.playlisttab1TitleRef.nativeElement.value,
      enableBackdrop: true,
    }, {
      anchorId: 'playlist_createNew',
      content: this.playlistcreateNewRef.nativeElement.value,
      title: this.playlistcreateNewTitleRef.nativeElement.value,
      enableBackdrop: true,
    }]
  }

  ngOnDestroy() {
    if (this.playlistsSubscription) {
      this.playlistsSubscription.unsubscribe()
    }
    if (this.notificationsSubscription) {
      this.notificationsSubscription.unsubscribe()
    }
    this.configurationSvc.tourGuideNotifier.next(false)
  }
}
