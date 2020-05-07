/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute, UrlTree, UrlSegmentGroup, UrlSegment } from '@angular/router'
import { IFeatureSearchConfig } from '../../models/search.model'
import { ConfigurationsService, NsPage } from '@ws-widget/utils'

@Component({
  selector: 'ws-app-search-root',
  templateUrl: './search-root.component.html',
  styleUrls: ['./search-root.component.scss'],
})
export class SearchRootComponent implements OnInit {
  searchTabs: IFeatureSearchConfig = {
    tabs: [],
    routeValue: [],
    placeHolder: {},
    social: {},
  }
  route = 'learning'
  searchRequest: {
    query: string;
    filters: { [type: string]: string[] };
    social?: string;
    sort?: string;
  } = {
    query: '',
    filters: {},
    social: '',
    sort: '',
  }
  selectedIndex = 0
  pageNavbar: Partial<NsPage.INavBackground> = this.configSvc.pageNavBar
  constructor(
    private router: Router,
    private activated: ActivatedRoute,
    private configSvc: ConfigurationsService,
  ) {}

  ngOnInit() {
    if (this.activated.snapshot.data.searchPageData.data.search) {
      this.searchTabs = this.activated.snapshot.data.searchPageData.data.search
    }
    this.activated.queryParamMap.subscribe(queryParam => {
      if (queryParam.has('q')) {
        this.searchRequest.query = queryParam.get('q') || ''
      }
      const tree: UrlTree = this.router.parseUrl(this.router.url)
      const g: UrlSegmentGroup = tree.root.children['primary']
      const s: UrlSegment[] = g.segments
      this.route = s[s.length - 1].path
      this.selectedIndex = this.searchTabs.routeValue.indexOf(this.route)
    })
  }
  routeTabs(tab: number) {
    this.router.navigate([this.searchTabs.routeValue[tab]], {
      queryParams: { q: this.searchRequest.query },
      relativeTo: this.activated.parent,
    })
  }
  hasKeys(object: Object): boolean {
    if (object && Object.keys(object) && Object.keys(object).length) {
      return true
    }
    return false
  }
}
