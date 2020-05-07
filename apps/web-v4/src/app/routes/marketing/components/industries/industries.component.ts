/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material';
import { ICatalog } from '../../../../models/catalog.model';
import { Router } from '@angular/router';
import { FetchStatus } from '../../../../models/status.model';

import { CatalogService } from '../../../../services/catalog.service';
import { ConfigService } from '../../../../services/config.service';

@Component({
  selector: 'app-industries',
  templateUrl: './industries.component.html',
  styleUrls: ['./industries.component.scss']
})
export class IndustriesComponent implements OnInit {
  catalog: ICatalog;
  narrativeSearchRequest = this.configSvc.instanceConfig.features.marketing.config.industries;

  // nameIdMapping: { [id: string]: string } = {};

  nestedTreeControl: NestedTreeControl<ICatalog>;
  nestedDataSource: MatTreeNestedDataSource<ICatalog>;

  fetchingIndustriesStatus: FetchStatus = 'none';

  hasNestedChild = (_: number, nodeData: ICatalog) => nodeData && nodeData.children && nodeData.children.length;

  private getChildren = (node: ICatalog) => {
    return node && node.children ? node.children : [];
  }

  constructor(private catalogSvc: CatalogService, private router: Router, private configSvc: ConfigService) {
    this.nestedTreeControl = new NestedTreeControl<ICatalog>(this.getChildren);
    this.nestedDataSource = new MatTreeNestedDataSource();
  }

  ngOnInit() {
    this.fetchingIndustriesStatus = 'fetching';
    this.catalogSvc.fetchIndustries().subscribe(
      data => {
        if (!data || !data.children || !data.children.length) {
          this.fetchingIndustriesStatus = 'none';
          return;
        }

        this.fetchingIndustriesStatus = 'done';
        this.catalog = data;
        // this.getIdNameMapping(this.catalog);
        this.nestedDataSource.data = data.children;
      },
      error => {
        this.fetchingIndustriesStatus = 'error';
      }
    );
  }

  navigateToSubTrack(node) {
    this.router.navigate(['/marketing/offering'], {
      queryParams: {
        tags: node.type
      }
    });
  }

  navigateToSubSubTrack(node) {
    this.router.navigate(['/marketing/offering'], {
      queryParams: {
        tags: node.type
      }
    });
  }

  // getIdNameMapping(catalog: ICatalog) {
  //   // this.nameIdMapping[catalog.identifier] = catalog.value;

  //   if (!catalog.children || !catalog.children.length) {
  //     return;
  //   }

  //   catalog.children.forEach(child => {
  //     this.getIdNameMapping(child);
  //   });
  // }
}
