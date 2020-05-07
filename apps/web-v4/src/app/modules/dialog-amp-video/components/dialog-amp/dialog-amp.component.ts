/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, OnDestroy, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { IContent } from '../../../../models/content.model';
import { PluginVideoService } from '../../../../services/plugin-video.service';

@Component({
  selector: 'ws-dialog-amp',
  templateUrl: './dialog-amp.component.html',
  styleUrls: ['./dialog-amp.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DialogAmpComponent implements OnInit, OnDestroy {
  player: amp.Player;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IContent,
    private videoSvc: PluginVideoService,
    public dialogRef: MatDialogRef<DialogAmpComponent>
  ) {}

  ngOnInit() {
    if (this.data && this.data.identifier) {
      this.loadPlayer();
    }
  }

  ngOnDestroy() {
    this.disposePlayer();
  }

  async loadPlayer() {
    this.disposePlayer();
    const videoHtmlId = 'amp_plugin_' + Date.now() + '_' + this.data.identifier;
    const videoContainer = document.getElementById('video-container');
    videoContainer.innerHTML = `<video id="${videoHtmlId}" class="azuremediaplayer amp-flush-skin amp-big-play-centered"></video>`;
    this.player = await this.videoSvc.init(
      videoHtmlId,
      this.data.introductoryVideo,
      null,
      null,
      this.data.introductoryVideoIcon,
      this.data.identifier,
      this.data.contentType,
      this.data.mimeType,
      null,
      0,
      [],
      {},
      {
        autoplay: false,
        enableContinueLearning: false
      }
    );
    this.player.addEventListener('error', err => {
      console.log('AMP err >', err);
    });
  }

  private disposePlayer() {
    if (this.player && typeof this.player.dispose === 'function') {
      this.player.dispose();
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
