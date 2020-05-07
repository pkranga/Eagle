/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { ICatalog } from '../../../../models/catalog.model';
import { MatTreeNestedDataSource } from '@angular/material';
import { CatalogService } from '../../../../services/catalog.service';
import { Router } from '@angular/router';
import { FetchStatus } from '../../../../models/status.model';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  nestedTreeControl: NestedTreeControl<ICatalog>;
  nestedDataSource: MatTreeNestedDataSource<ICatalog>;

  fetchProductsStatus: FetchStatus;

  nameIdMapping: { [id: string]: string } = {};

  hasNestedChild = (_: number, nodeData: ICatalog) =>
    nodeData && nodeData.children && nodeData.children.length

  private _getChildren = (node: ICatalog) => {
    return node && node.children ? node.children : [];
  }

  constructor(private catalogSvc: CatalogService, private router: Router) {
    this.nestedTreeControl = new NestedTreeControl<ICatalog>(this._getChildren);
    this.nestedDataSource = new MatTreeNestedDataSource();
  }
  ngOnInit() {
    this.fetchProductsStatus = 'fetching';
    this.catalogSvc
      .fetchProducts()
      .subscribe(
        data => {
          if (!data || !data.children || !data.children.length) {
            this.fetchProductsStatus = 'none';
            return;
          }
          this.fetchProductsStatus = 'done';
          // this.getIdNameMapping(data);
          this.nestedDataSource.data = data.children;
        },
        err => {
          console.log(err);
          this.fetchProductsStatus = 'error';
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

  getIdNameMapping(catalog: ICatalog) {
    this.nameIdMapping[catalog.identifier] = catalog.value;

    if (!catalog.children || !catalog.children.length) {
      return;
    }

    catalog.children.forEach(child => {
      this.getIdNameMapping(child);
    });
  }
}
