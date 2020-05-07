/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentService } from '../../../../services/content.service';
import { Observable } from 'rxjs';
import { debounceTime, switchMap, startWith, distinctUntilChanged } from 'rxjs/operators';
import { RoutingService } from '../../../../services/routing.service';
import { AccessControlService } from '../../../../services/access-control.service';
import { EUserRoles } from '../../../../constants/enums.constant';
import { ConfigService } from '../../../../services/config.service';
import logger from '../../../../utils/logger';
import { deepCopy } from '../../../../utils/deepCopy';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  tabs = deepCopy(this.configSvc.instanceConfig.features.search.config.tabs);
  isSiemensInstance = this.configSvc.instanceConfig.features.siemens.enabled;
  activeTabIndex = 0;
  platformName = this.configSvc.instanceConfig.platform.appName;
  queryControl = new FormControl(this.activatedRoute.snapshot.queryParams.q || '');
  filteredOptions$: Observable<string[]> = this.queryControl.valueChanges.pipe(
    startWith(this.queryControl.value),
    debounceTime(500),
    distinctUntilChanged(),
    switchMap(value => this.contentSvc.autocomplete(value))
  );

  searchRequest: { query: string; filters: { [type: string]: string[] } } = {
    query: '',
    filters: {}
  };

  userRoles = new Set<string>();
  ROLES = EUserRoles;
  isSiemensCatalogFilterRemoved = false;
  @ViewChild('searchInput', { static: false }) searchInputElem: ElementRef<any>;
  constructor(
    public routingSvc: RoutingService,
    private accessControlSvc: AccessControlService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private contentSvc: ContentService,
    private configSvc: ConfigService
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParamMap.subscribe(queryParams => {
      // Reset search request object
      this.searchRequest = {
        query: '',
        filters: {}
      };
      // query
      if (queryParams.has('q')) {
        this.queryControl.setValue(queryParams.get('q'));
        this.searchRequest.query = queryParams.get('q');
      }
      // filters
      if (queryParams.has('f')) {
        try {
          const filters = JSON.parse(queryParams.get('f'));
          this.searchRequest.filters = filters;
        } catch (err) {
          logger.error('Unable to read filter from query. Possibly cause is invalid filter object/JSON', err);
        }
      }
      // tab
      if (queryParams.has('tab')) {
        const tabName = queryParams.get('tab');
        this.activeTabIndex = this.tabs.findIndex(u => u.titleKey === tabName);
      }
      if (this.activeTabIndex === -1 || this.activeTabIndex >= this.tabs.length) {
        this.activeTabIndex = 0;
      }
    });

    // Fetch user roles
    this.getUserRoles();
  }

  // Methods to update query Params
  updateActiveTab(tabIndex: number) {
    this.router.navigate(['/search'], {
      queryParams: {
        tab: this.tabs[tabIndex].titleKey || this.tabs[0].titleKey
      },
      queryParamsHandling: 'merge'
    });
  }
  updateQuery(query: string) {
    this.searchInputElem.nativeElement.blur();
    // if (query.indexOf(' ') > -1) {
    //   query = `"${query}"`;
    // }
    this.router.navigate(['/search'], {
      queryParams: { q: query },
      queryParamsHandling: 'merge'
    });
  }
  addFilter({ key, value }: { key: string; value: string }) {
    const filters = { ...this.searchRequest.filters };
    if (key in filters) {
      filters[key] = [...filters[key], value];
    } else {
      filters[key] = [value];
    }
    this.router.navigate(['/search'], {
      queryParams: { f: JSON.stringify(filters) },
      queryParamsHandling: 'merge'
    });
  }
  removeFilter({ key, value }: { key: string; value: string }) {
    const filters = { ...this.searchRequest.filters };
    if (key in filters) {
      filters[key] = filters[key].filter(filter => filter !== value);

      this.router.navigate(['/search'], {
        queryParams: { f: JSON.stringify(filters) },
        queryParamsHandling: 'merge'
      });
    }
  }
  hasKeys(object: Object): boolean {
    if (object && Object.keys(object) && Object.keys(object).length) {
      return true;
    }
    return false;
  }

  private getUserRoles() {
    this.accessControlSvc.getUserRoles().subscribe(data => {
      this.userRoles = data;
    });
  }

  onSiemensCatalogFilterChange(value: boolean) {
    this.isSiemensCatalogFilterRemoved = value;
  }
}
