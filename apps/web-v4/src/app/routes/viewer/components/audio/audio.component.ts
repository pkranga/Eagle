/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
/// <reference types="azuremediaplayer" />

import { Component, OnInit, Input, ElementRef, ViewChild, OnDestroy, Output, EventEmitter } from '@angular/core';
import { IProcessedViewerContent, ViewerService } from '../../../../services/viewer.service';
import { PluginVideoService } from '../../../../services/plugin-video.service';

@Component({
  selector: 'app-audio',
  templateUrl: './audio.component.html',
  styleUrls: ['./audio.component.scss']
})
export class AudioComponent implements OnInit, OnDestroy {
  constructor(private audioSvc: PluginVideoService, private viewerSvc: ViewerService) {}
  @ViewChild('audioContainer', { static: true }) audioContainer: ElementRef<HTMLDivElement>;

  @Input() processedContent: IProcessedViewerContent;
  @Input() collectionId: string;

  @Output() resourceEnded = new EventEmitter();
  private player: amp.Player;

  async ngOnInit() {
    if (this.processedContent && this.processedContent.content) {
      await this.loadPlayer();
    }
  }

  async loadPlayer() {
    this.disposePlayer();
    const audioHtmlId = 'amp_plugin_' + Date.now() + '_' + this.processedContent.content.identifier;
    const start = this.viewerSvc.resumePointStringToProgressNumber(this.processedContent.resumeData);
    // tslint:disable-next-line:max-line-length
    this.audioContainer.nativeElement.innerHTML = `<audio id="${audioHtmlId}" class="azuremediaplayer amp-flush-skin amp-big-play-centered"></audio>`;
    this.player = await this.audioSvc.init(
      audioHtmlId,
      this.processedContent.content.artifactUrl,
      null,
      null,
      this.processedContent.content.appIcon,
      this.processedContent.content.identifier,
      this.processedContent.content.contentType,
      this.processedContent.content.mimeType,
      this.collectionId,
      start,
      [],
      {},
      {
        autoplay: true,
        enableContinueLearning: true
      }
    );
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
