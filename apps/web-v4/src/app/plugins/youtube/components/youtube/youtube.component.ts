/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
/// <reference types="youtube" />
import { Component, ElementRef, EventEmitter, OnChanges, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PluginYoutubeService, YTPlayerObject } from '../../../../services/plugin-youtube.service';
import { IProcessedViewerContent, ViewerService } from '../../../../services/viewer.service';
@Component({
  selector: 'ws-youtube',
  templateUrl: './youtube.component.html',
  styleUrls: ['./youtube.component.scss']
})
export class YoutubeComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('youtubeContainer', { static: true }) youtubeContainer: ElementRef<HTMLDivElement>;
  processedContent: IProcessedViewerContent;
  collectionId: string;

  @Output() resourceEnded = new EventEmitter();
  playerObj: YTPlayerObject;

  constructor(private route: ActivatedRoute, private ytSvc: PluginYoutubeService, private viewerSvc: ViewerService) {}
  paramSubscription;

  ngOnInit() {
    this.paramSubscription = this.route.data.subscribe(data => {
      this.processedContent = data.playerDetails.processedResource;
      this.collectionId = data.playerDetails.toc.identifier;
      this.onChangeFunction();
    });
  }

  async onChangeFunction() {
    if (this.processedContent && this.processedContent.content && this.processedContent.content.artifactUrl) {
      const ytDivId = 'yt_plugin_' + Date.now() + '_' + this.processedContent.content.identifier;
      this.youtubeContainer.nativeElement.innerHTML = `<div id="${ytDivId}"></div>`;
      this.dispose();
      this.playerObj = await this.ytSvc.init(
        ytDivId,
        this.processedContent.content.artifactUrl,
        this.processedContent.content.identifier,
        this.processedContent.content.contentType,
        this.collectionId,
        this.viewerSvc.resumePointStringToProgressNumber(this.processedContent.resumeData)
      );
      this.playerObj.stateChangeSubject.subscribe(eventData => {
        if (eventData === YT.PlayerState.ENDED) {
          this.resourceEnded.emit();
          this.playerObj.stateChangeSubject.unsubscribe();
        }
      });
    }
  }

  async ngOnChanges() {
    this.onChangeFunction();
  }
  ngOnDestroy() {
    this.dispose();
  }

  dispose() {
    if (this.playerObj && typeof this.playerObj.dispose === 'function') {
      this.playerObj.dispose();
    }
    if (this.playerObj && this.playerObj.stateChangeSubject) {
      this.playerObj.stateChangeSubject.unsubscribe();
    }
  }
}
