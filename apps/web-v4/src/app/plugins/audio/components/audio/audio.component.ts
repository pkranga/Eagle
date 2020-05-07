/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
/// <reference types="azuremediaplayer" />

import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlayerDataService } from '../../../../services/player-data.service';
import { PluginVideoService } from '../../../../services/plugin-video.service';
// service imports
import { IProcessedViewerContent, ViewerService } from '../../../../services/viewer.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ws-audio',
  templateUrl: './audio.component.html',
  styleUrls: ['./audio.component.scss']
})
export class AudioComponent implements OnInit, OnDestroy {
  constructor(
    private route: ActivatedRoute,
    private playerDataSvc: PlayerDataService,
    private audioSvc: PluginVideoService,
    private viewerSvc: ViewerService
  ) {}

  @ViewChild('audioContainer', { static: true }) audioContainer: ElementRef<HTMLDivElement>;
  processedContent: IProcessedViewerContent;
  collectionId: string;

  @Output() resourceEnded = new EventEmitter();

  private player: amp.Player;
  paramSubscription: Subscription;
  async ngOnInit() {
    this.paramSubscription = this.route.data.subscribe(data => {
      this.processedContent = data.playerDetails.processedResource;
      this.collectionId = data.playerDetails.toc.identifier;
      this.onInItFunction();
    });
  }
  ngOnDestroy() {
    this.disposePlayer();
  }

  async onInItFunction() {
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
}
