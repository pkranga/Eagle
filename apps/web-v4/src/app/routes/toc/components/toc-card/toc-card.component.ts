/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { UserService } from '../../../../services/user.service';
import { IContent } from '../../../../models/content.model';
import { ConfigService } from '../../../../services/config.service';

@Component({
  selector: 'app-toc-card',
  templateUrl: './toc-card.component.html',
  styleUrls: ['./toc-card.component.scss']
})
export class TocCardComponent implements OnInit, OnChanges {
  @Input() tocId: string;
  @Input() content: IContent;
  isExpanded = false;
  contentProgress: number;
  missingThumbnail = this.configSvc.instanceConfig.platform.thumbnailMissingLogo;
  constructor(private userSvc: UserService, private configSvc: ConfigService) {}

  ngOnInit() {}

  ngOnChanges() {
    if (this.content) {
      this.userSvc.getProgressFor(this.content.identifier).subscribe(progress => {
        this.contentProgress = progress;
      });
    }
  }

  get cardRoute() {
    return (
      // '/viewer/' + (this.tocId === this.content.identifier ? this.content.identifier : this.tocId + '/' + this.content.identifier)
      '/toc/' + this.content.identifier
    );
  }

  cardTrackBy(index: number, item: IContent) {
    return item.identifier;
  }
}
