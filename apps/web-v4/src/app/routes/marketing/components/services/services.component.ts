/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { ISearchRequest, IFilterUnitItem } from '../../../../models/searchResponse.model';
import { ICatalog } from '../../../../models/catalog.model';
import { CatalogService } from '../../../../services/catalog.service';
import { Router } from '@angular/router';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material';

type TDisplayType = 'pentagon' | 'a2z';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {
  digitalServicesRequest: ISearchRequest;
  displayType: TDisplayType = 'pentagon';
  selectedPillar: string;
  pentagon: { [pillar: string]: IFilterUnitItem };
  azOfferings: IFilterUnitItem[] = [];

  pentagonFetchInProgress = true;

  nestedTreeControl: NestedTreeControl<IFilterUnitItem>;
  nestedDataSource: MatTreeNestedDataSource<IFilterUnitItem>;

  hasNestedChild = (_: number, nodeData: ICatalog) => nodeData && nodeData.children && nodeData.children.length;

  private getChildren = (node: IFilterUnitItem) => {
    return node && node.children ? node.children : [];
  }

  constructor(private catalogSvc: CatalogService, private router: Router) {
    this.nestedTreeControl = new NestedTreeControl<IFilterUnitItem>(this.getChildren);
    this.nestedDataSource = new MatTreeNestedDataSource();
  }

  ngOnInit() {
    this.catalogSvc.fetchPentagon().subscribe(data => {
      this.pentagon = data.children.reduce((obj, item) => {
        obj[item.displayName] = item;
        this.azOfferings = this.azOfferings.concat(item.children);
        return obj;
      }, {});
      this.azOfferings = this.azOfferings.sort((a, b) =>
        a.displayName.localeCompare(b.displayName)
      );
      this.pentagonFetchInProgress = false;
    });
  }

  pillarClicked(pillar: string) {
    this.selectedPillar = pillar;
    this.nestedDataSource.data = this.pentagon[this.selectedPillar].children;
    // this.digitalServicesRequest = {
    //   sortBy: 'lastUpdatedOn',
    //   sortOrder: 'DESC',
    //   filters: {
    //     categories: ['and(Marketing)', 'and(Pentagon)'],
    //     tracks: ['and(Services)', 'and(' + pillar + ')'],
    //     subTracks: ['and(Narrative)'],
    //     resourceCategory: ['Prepare'],
    //     contentType: ['Resource']
    //   },
    //   pageNo: 0,
    //   userAgent:
    //     'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36',
    //   query: ''
    // };
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
}
