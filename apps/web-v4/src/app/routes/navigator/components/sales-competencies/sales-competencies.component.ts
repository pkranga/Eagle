/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { CatalogService } from '../../../../services/catalog.service';
import { RoutingService } from '../../../../services/routing.service';
import { ConfigService } from '../../../../services/config.service';

@Component({
  selector: 'app-sales-competencies',
  templateUrl: './sales-competencies.component.html',
  styleUrls: ['./sales-competencies.component.scss']
})
export class SalesCompetenciesComponent implements OnInit {
  banners = this.configSvc.instanceConfig.features.navigator.config.salesCompetenciesBanner.bannersList;
  COMPETENCY_URL_MAPPING = {};
  constructor(public routingSvc: RoutingService, private catalog: CatalogService, private configSvc: ConfigService) {}

  ngOnInit() {
    this.catalog.fetchCatalog().subscribe(catalog => {
      catalog.children[0].children
        .filter(category => category.value === 'Sales')[0]
        .children.filter(salesItem => salesItem.value === 'Sales Competencies')[0]
        .children.forEach(element => {
          this.COMPETENCY_URL_MAPPING[element.value] = '/catalog/' + element.identifier;
        });

      this.banners = this.banners.map(banner => ({
        ...banner,
        url: banner.url || this.COMPETENCY_URL_MAPPING[banner.titleKey]
      }));
    });
  }
}
