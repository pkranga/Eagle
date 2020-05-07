/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { IContent } from '../../../../models/content.model';
import { ConfigService } from '../../../../services/config.service';

@Component({
  selector: 'app-recommendations',
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.scss']
})
export class RecommendationsComponent implements OnInit, OnChanges, OnDestroy {
  @Input() toc: IContent;
  @Input() nextResource: IContent;
  @Input() recommendations: IContent[];

  @Output() closeRecommendations = new EventEmitter();

  nextItemPlaybackProgress = 0;
  playbackInterval: Subscription;
  missingThumbnail = this.configSvc.instanceConfig.platform.thumbnailMissingLogo;
  constructor(private router: Router, private configSvc: ConfigService) {}

  ngOnInit() {}

  ngOnChanges() {
    if (this.nextResource) {
      this.playbackInterval = interval(5).subscribe(_ => {
        this.nextItemPlaybackProgress += 0.1;
        if (this.nextItemPlaybackProgress >= 100) {
          this.playNextResource();
        }
      });
    }
  }

  ngOnDestroy() {
    if (this.playbackInterval) {
      this.playbackInterval.unsubscribe();
    }
  }

  playNextResource() {
    this.ngOnDestroy();
    this.router.navigateByUrl(this.nextResourceUrl);
  }

  cancelPlay(event: Event) {
    event.preventDefault();
    this.closeRecommendations.emit();
  }

  get nextResourceUrl() {
    return (
      '/viewer/' +
      (this.toc && this.toc.identifier !== this.nextResource.identifier ? this.toc.identifier + '/' : '') +
      this.nextResource.identifier
    );
  }
}
