/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
/// <reference types="azuremediaplayer" />

import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PluginVideoService } from '../../../../services/plugin-video.service';
import { IProcessedViewerContent, ViewerService } from '../../../../services/viewer.service';

@Component({
  selector: 'ws-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit, OnDestroy {
  constructor(private videoSvc: PluginVideoService, private route: ActivatedRoute, private viewerSvc: ViewerService) {}

  @ViewChild('videoContainer', { static: true }) videoContainer: ElementRef<HTMLDivElement>;

  processedContent: IProcessedViewerContent;
  collectionId: string;

  @Output() resourceEnded = new EventEmitter();

  private player: amp.Player;
  hasErrorLoadingVideo = false;
  paramSubscription;
  async ngOnInit() {
    this.paramSubscription = this.route.data.subscribe(data => {
      this.processedContent = data.playerDetails.processedResource;
      this.collectionId = data.playerDetails.toc.identifier;
      this.onInItFunction();
    });
  }

  async onInItFunction() {
    if (this.processedContent && this.processedContent.content && this.processedContent.video) {
      await this.loadPlayer();
    }
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
    const videoHtmlId = 'amp_plugin_' + Date.now() + '_' + this.processedContent.content.identifier;
    const start = this.viewerSvc.resumePointStringToProgressNumber(this.processedContent.resumeData);
    // tslint:disable-next-line:max-line-length
    this.videoContainer.nativeElement.innerHTML = `<video id="${videoHtmlId}" class="azuremediaplayer amp-flush-skin amp-big-play-centered"></video>`;
    this.player = await this.videoSvc.init(
      videoHtmlId,
      this.processedContent.video.file,
      this.processedContent.video.streamingToken,
      this.processedContent.video.manifest,
      this.processedContent.content.appIcon,
      this.processedContent.content.identifier,
      this.processedContent.content.contentType,
      this.processedContent.content.mimeType,
      this.collectionId,
      start,
      [],
      subtitles,
      {
        autoplay: true,
        enableContinueLearning: true
      }
    );
    this.player.addEventListener('error', () => {
      console.warn('error occurred while playing video in AMP >', this.player.error());
      if (!this.hasErrorLoadingVideo) {
        console.warn('Failed loading video in AMP. Trying playback with file');
        this.hasErrorLoadingVideo = true;
        this.processedContent.video.streamingToken = undefined;
        this.processedContent.video.manifest = undefined;
        this.loadPlayer();
      }
    });
    this.player.addEventListener('ended', () => {
      this.resourceEnded.emit();
    });
  }

  private disposePlayer() {
    if (this.player && typeof this.player.dispose === 'function') {
      this.player.dispose();
    }
  }

  ngOnDestroy() {
    this.disposePlayer();
  }
}
