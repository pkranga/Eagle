/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { PluginVideojsService } from '../../../../services/plugin-videojs.service';
import { IProcessedViewerContent, ViewerService } from '../../../../services/viewer.service';
import videojs from 'video.js';
import 'videojs-vr';

@Component({
  selector: 'app-videojs',
  templateUrl: './videojs.component.html',
  styleUrls: ['./videojs.component.scss']
})
export class VideojsComponent implements OnInit, OnDestroy {
  @Input() processedContent: IProcessedViewerContent;
  @Input() collectionId: string;
  @Output() resourceEnded = new EventEmitter();
  @ViewChild('videoContainer', { static: true }) videoContainer: ElementRef<HTMLDivElement>;

  private player: videojs.Player;

  constructor(private videojsSvc: PluginVideojsService, private viewerSvc: ViewerService) { }

  async ngOnInit() {
    if (this.processedContent && this.processedContent.content) {
      await this.loadPlayer();
    }
  }

  ngOnDestroy() {
    this.disposePlayer();
  }

  async loadPlayer() {
    this.disposePlayer();
    let subtitles = {};
    if (this.processedContent.content.subTitles && this.processedContent.content.subTitles.length) {
      subtitles = this.processedContent.content.subTitles.reduce((agg, subtitle) => {
        agg[subtitle.srclang] = subtitle.url;
        return agg;
      }, {});
    }
    const videoHtmlId = 'videojs_plugin_' + Date.now() + '_' + this.processedContent.content.identifier;
    const start = this.viewerSvc.resumePointStringToProgressNumber(this.processedContent.resumeData);
    // tslint:disable-next-line:max-line-length
    this.videoContainer.nativeElement.innerHTML = `<video id="${videoHtmlId}" class="video-js vjs-big-play-centered"></video>`;
    this.player = await this.videojsSvc.init(
      videoHtmlId,
      this.processedContent.content.artifactUrl,
      this.processedContent.content.appIcon,
      this.processedContent.content.identifier,
      this.processedContent.content.mimeType,
      this.processedContent.content.contentType,
      this.collectionId,
      start,
      subtitles
    );

    this.player.on('ended', () => {
      this.resourceEnded.emit();
    });
  }

  private disposePlayer() {
    if (this.player && typeof this.player.dispose === 'function') {
      this.player.dispose();
    }
  }
}
