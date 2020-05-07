/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input } from '@angular/core';
import { RoutingService } from '../../../../services/routing.service';
import { ContentService } from '../../../../services/content.service';
import { IContent } from '../../../../models/content.model';
import { ConfigService } from '../../../../services/config.service';

@Component({
  selector: 'app-living-labs',
  templateUrl: './living-labs.component.html',
  styleUrls: ['./living-labs.component.scss']
})
export class LivingLabsComponent implements OnInit {
  // Temp for demo
  @Input() hideToolbar: boolean;
  banner = this.configSvc.instanceConfig.features.livingLabs.config.banner.bannersList[0].img;

  // TODO: using dummy tag for now. Replace with actual tag
  searchRequest = {
    sortBy: 'lastUpdatedOn',
    sortOrder: 'DESC',
    isStandAlone: true,
    filters: {
      tags: ['']
    },
    pageNo: 0,
    query: ''
  };

  hardcodedContentIds = [
    'lex_auth_01272719803758182410',
    'lex_auth_01276736414606131230'
    // 'lex_auth_01272341889557299252',
    // 'lex_auth_01272706606243840094'
  ];
  hardcodedContent: IContent[];

  constructor(
    public routingSvc: RoutingService,
    private contentSvc: ContentService,
    private configSvc: ConfigService
  ) { }

  ngOnInit() {
    this.contentSvc.fetchMultipleContent(this.hardcodedContentIds).subscribe(response => {
      this.hardcodedContent = response;
    });
  }
}
