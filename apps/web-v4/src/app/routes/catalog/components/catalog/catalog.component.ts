/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material';

import { ICatalog } from '../../../../models/catalog.model';
import { RoutingService } from '../../../../services/routing.service';
import { ConfigService } from '../../../../services/config.service';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {
  catalog: ICatalog[] = this.route.snapshot.data.catalog.children[0]
    .children;
  config = this.configSvc.instanceConfig.features.catalog.config;

  nestedTreeControl: NestedTreeControl<ICatalog>;
  nestedDataSource: MatTreeNestedDataSource<ICatalog>;

  hasNestedChild = (_: number, nodeData: ICatalog) =>
    (nodeData &&
    nodeData.children &&
    nodeData.children.length &&
    this.config.ignoreChildren.indexOf(nodeData.identifier) < 0)

  private getChildren = (node: ICatalog) => {
    return node && node.children ? node.children : [];
  }

  shouldDisplayNode(identifier) {
    return this.config.ignoreNodes.indexOf(identifier) < 0;
  }

  constructor(
    private route: ActivatedRoute,
    public routingSvc: RoutingService,
    private configSvc: ConfigService
  ) {
    this.nestedTreeControl = new NestedTreeControl<ICatalog>(this.getChildren);
    this.nestedDataSource = new MatTreeNestedDataSource();
  }

  ngOnInit() {
    if (
      this.route.snapshot.data.catalog &&
      this.route.snapshot.data.catalog.children &&
      this.route.snapshot.data.catalog.children.length &&
      this.route.snapshot.data.catalog.children[0].children
    ) {
        this.catalog = this.route.snapshot.data.catalog.children[0].children;
        this.nestedDataSource.data = this.catalog;
    }
  }
}
