/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
/// <reference types="youtube" />

import {
  Component,
  OnInit,
  Input,
  ElementRef,
  ViewChild,
  OnChanges,
  OnDestroy,
  Output,
  EventEmitter
} from '@angular/core';
import { IProcessedViewerContent, ViewerService } from '../../../../services/viewer.service';
import { PluginYoutubeService, YTPlayerObject } from '../../../../services/plugin-youtube.service';

@Component({
  selector: 'app-youtube',
  templateUrl: './youtube.component.html',
  styleUrls: ['./youtube.component.scss']
})
export class YoutubeComponent implements OnChanges, OnDestroy {
  @ViewChild('youtubeContainer', { static: true }) youtubeContainer: ElementRef<HTMLDivElement>;
  @Input() processedContent: IProcessedViewerContent;
  @Input() collectionId: string;

  @Output() resourceEnded = new EventEmitter();
  playerObj: YTPlayerObject;

  constructor(private ytSvc: PluginYoutubeService, private viewerSvc: ViewerService) {}

  async ngOnChanges() {
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
