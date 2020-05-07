/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { IContent } from '../../../../models/content.model';
import { UserService } from '../../../../services/user.service';
import { ConfigService } from '../../../../services/config.service';

@Component({
  selector: 'app-search-card',
  templateUrl: './search-card.component.html',
  styleUrls: ['./search-card.component.scss']
})
export class SearchCardComponent implements OnInit, OnChanges {
  @Input()
  displayType: 'basic' | 'advanced' = 'basic';
  @Input()
  content: IContent;
  contentProgress: number;
  isExpanded = false;
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
}
