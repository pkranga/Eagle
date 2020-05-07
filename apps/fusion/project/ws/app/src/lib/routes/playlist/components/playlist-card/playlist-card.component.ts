/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, Input } from '@angular/core'
import { NsPlaylist } from '@ws-widget/collection'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'ws-app-playlist-card',
  templateUrl: './playlist-card.component.html',
  styleUrls: ['./playlist-card.component.scss'],
})
export class PlaylistCardComponent implements OnInit {

  @Input()
  playlist: NsPlaylist.IPlaylist | null = null

  defaultThumbnail = ''

  constructor(private route: ActivatedRoute) {
    if (this.route.snapshot.data.pageData.data) {
      this.defaultThumbnail = this.route.snapshot.data.pageData.data.defaultThumbnail
    }
  }

  ngOnInit() {
  }

}
