/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { IContent, IContentCardHash, IHistory } from '../../../../models/content.model';
import { ConfigService } from '../../../../services/config.service';
import {
  DomSanitizer,
  SafeStyle
} from '@angular/platform-browser';
@Component({
  selector: 'app-content-card',
  templateUrl: './content-card.component.html',
  styleUrls: ['./content-card.component.scss']
})
export class ContentCardComponent implements OnInit, OnChanges {
  @Input()
  content: IContent | IHistory;

  @Input()
  contentStripHash: { [identifier: string]: IContentCardHash };

  clientNames: string;
  missingThumbnail = this.configSvc.instanceConfig.platform.thumbnailMissingLogo;

  cardDetailMeta: {
    titleKey: string;
    msg: string;
  };
  detailedView = false;
  routeType: string;
  sourceUrl: SafeStyle;
  sourceIcon: any;
  isPathfindersAvailable = this.configSvc.instanceConfig.features.pathfinders.enabled;
  constructor(private configSvc: ConfigService, private domSanitizer: DomSanitizer) {
    this.sourceUrl = '/public-assets/common/misc/source_images/';
  }

  ngOnInit() {
    if (this.isPathfindersAvailable && this.content && this.content.sourceShortName) {
      this.sourceIcon = this.assignSourceIcon();
      this.sourceUrl = this.domSanitizer.bypassSecurityTrustStyle(
        `url('${this.sourceUrl + this.sourceIcon + '.png'}')`
      );
    }
  }

  assignSourceIcon() {
    switch (this.content.sourceShortName.toLowerCase().trim()) {
      case 'georgia tech':
        return 'georgia-tech';
      case 'tufts university':
        return 'tufts';
      case 'university of chicago':
        return 'university-of-chicago';
      case 'kiss institute for practical robotics':
        return 'kiss-institute';
      case 'maker educator collective':
        return 'maker-educator-collective';
      case 'microblocks':
        return 'microblocks';
      case 'mouse':
        return 'mouse';
      case 'tynker':
        return 'tynker';
      case 'chibitronics':
        return 'chibitronics';
      case 'nextech':
        return 'code';
      case 'firia labs':
        return 'firia-labs';
      case 'peblio and the processing foundation':
        return 'peblio';
      case 'project invent':
        return 'project-invent';
      case 'the beauty and joy of computing':
        return 'bjc';
      case 'national center for computer science education, college of st. scholastica':
        return 'mobile-csp';
      default:
        return null;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const property in changes) {
      if (property === 'content') {
        if (this.content && this.content.clients && this.content.clients.length) {
          this.clientNames = this.content.clients.map(client => client.displayName).join(',');
        }
        this.fetchCardDetailMetaMsg();
      } else if (property === 'contentStripHash') {
        this.fetchCardDetailMetaMsg();
      }
    }
  }

  fetchCardDetailMetaMsg() {
    if (!this.contentStripHash || !this.content) {
      return;
    }
    if (this.contentStripHash.hasOwnProperty(this.content.identifier)) {
      const cardHash = this.contentStripHash[this.content.identifier];
      for (const key in cardHash) {
        if (key === 'continueLearning') {
          this.routeType = 'continueLearning';
          this.cardDetailMeta = {
            titleKey: 'continueLearning',
            msg: cardHash.continueLearning
          };
        } else if (key === 'interestRecommendation') {
          this.cardDetailMeta = {
            titleKey: 'interestRecommendation',
            msg: cardHash.interestRecommendation.join(', ')
          };
        } else if (key === 'usageRecommendation') {
          this.cardDetailMeta = {
            titleKey: 'usageRecommendation',
            msg: cardHash.usageRecommendation.join(', ')
          };
        }
      }
    }
  }
}
