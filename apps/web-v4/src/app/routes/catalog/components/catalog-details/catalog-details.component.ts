/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICatalog } from '../../../../models/catalog.model';

import { ISearchRequest } from '../../../../models/searchResponse.model';
import { UtilityService } from '../../../../services/utility.service';
import { RoutingService } from '../../../../services/routing.service';
import { ConfigService } from '../../../../services/config.service';
import { TContentType } from '../../../../models/content.model';

@Component({
  selector: 'app-catalog-details',
  templateUrl: './catalog-details.component.html',
  styleUrls: ['./catalog-details.component.scss']
})
export class CatalogDetailsComponent implements OnInit {
  disableStrips = this.configSvc.instanceConfig.features.catalog.config
    .disableStrips;
  hasData = {
    overview: true,
    program: true,
    course: true,
    collection: true,
    resource: true
  };
  pageHasContent: boolean;
  showStrip = {
    overview: true,
    program: true,
    course: true,
    collection: true,
    resource: true
  };

  catalogId: string;
  catalog: ICatalog[];
  path: ICatalog[];
  tags: string;
  searchRequest: { [contentType: string]: ISearchRequest };

  constructor(
    private route: ActivatedRoute,
    private utilitySvc: UtilityService,
    public routingSvc: RoutingService,
    private configSvc: ConfigService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.pageHasContent = true;
      this.catalogId = params.id;
      this.showStrip.overview =
        this.disableStrips.overview.indexOf(this.catalogId) < 0;
      this.initializeData(params.id);
    });
  }

  initializeData(catalogId: string) {
    const routeData = this.route.snapshot.data.catalog.children[0];
    this.catalog = routeData.children;
    this.path = this.utilitySvc
      .getPath<ICatalog>(
        this.route.snapshot.data.catalog.children[0],
        catalogId
      )
      .slice(1);
    this.tags = this.path.map(edge => edge.value).join('/');
    this.searchRequest = {
      Concepts: this.createSearchRequestForCatalog('Resource', 'Concepts'),
      Programs: this.createSearchRequestForCatalog('Learning Path'),
      Course: this.createSearchRequestForCatalog('Course'),
      Collection: this.createSearchRequestForCatalog('Collection'),
      Resource: this.createSearchRequestForCatalog('Resource')
    };
  }
  createSearchRequestForCatalog(
    contentType: TContentType,
    resourceCategory?: string
  ) {
    const filters = {
      contentType: [contentType],
      tags: [this.tags],
      resourceCategory: []
    };
    if (resourceCategory) {
      filters.resourceCategory = [resourceCategory];
    }
    return {
      filters,
      pageNo: 0,
      pageSize: 20
    };
  }

  status(event: string, stripName) {
    if (event === 'none') {
      this.hasData[stripName] = false;
    }

    let flag = false;
    const hasDataArray = Object.values(this.hasData);
    const showStripArray = Object.values(this.showStrip);
    for (let i = 0; i < hasDataArray.length; i++) {
      if (hasDataArray[i] && showStripArray[i]) {
        flag = true;
      }
    }
    this.pageHasContent = flag;
  }
}
