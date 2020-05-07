/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, Input, Output, EventEmitter, OnChanges, OnInit, OnDestroy, SimpleChanges } from '@angular/core';
import {
  ISearchRequest,
  ISearchApiResult,
  IFilterUnitItem,
  IFilterUnitResponse
} from '../../../../models/searchResponse.model';
import { ContentService } from '../../../../services/content.service';
import { FetchStatus } from '../../../../models/status.model';
import { IContent } from '../../../../models/content.model';
import { ValuesService } from '../../../../services/values.service';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TrainingsService } from '../../../../services/trainings.service';
import { ConfigService } from '../../../../services/config.service';

export interface SearchResultsComponentOptions {
  filters?: { [type: string]: string[] };
  isStandAlone?: boolean;
  siemensCatalog: boolean;
  sortBy?: string;
  sortOrder?: string;
}

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit, OnChanges, OnDestroy {
  @Input()
  searchRequest: { query: string; filters: { [type: string]: string[] }; social?: string; sort?: string };

  @Input()
  options?: SearchResultsComponentOptions;
  @Input() isSiemensCatalogFilterRemoved = false;
  @Input() ref: string;
  @Output() filterAdd = new EventEmitter<{ key: string; value: string }>();
  @Output() filterRemove = new EventEmitter<{ key: string; value: string }>();
  @Output() siemensCatalogRemoved = new EventEmitter<boolean>();

  searchRequestObject: ISearchRequest = null;
  searchRequestStatus: FetchStatus = 'none';
  searchResults: ISearchApiResult;
  searchResultsSubscription: Subscription;
  searchResponseFilters: { [filter: string]: string[] };

  sideNavBarOpened = true;
  sideNavBarOpenedUser = null;
  isMedium$ = this.valueSvc.isLtMedium$;
  private defaultSideNavBarOpenedSubscription: Subscription;
  mode$ = this.isMedium$.pipe(map(isMedium => (isMedium ? 'over' : 'side')));
  concepts: IFilterUnitItem[] = [];
  noContent = false;
  exactResult = {
    show: false,
    text: '',
    applied: false,
    old: ''
  };
  filtersResponse: IFilterUnitResponse[] = [];
  resultsDisplayType: 'basic' | 'advanced' = 'advanced';
  filtersResetAble = false;
  private selectedFilterSet = new Set();

  constructor(
    private trainingsSvc: TrainingsService,
    private contentSvc: ContentService,
    private valueSvc: ValuesService,
    private router: Router,
    private configSvc: ConfigService
  ) {}

  ngOnInit() {
    this.defaultSideNavBarOpenedSubscription = this.isMedium$.subscribe(isMedium => {
      if (this.sideNavBarOpenedUser === null) {
        this.sideNavBarOpened = !isMedium;
      } else {
        this.sideNavBarOpened = this.sideNavBarOpenedUser;
      }
    });
  }

  ngOnDestroy() {
    if (this.defaultSideNavBarOpenedSubscription) {
      this.defaultSideNavBarOpenedSubscription.unsubscribe();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const property in changes) {
      if (property === 'searchRequest' || property === 'options') {
        this.reset();
        if (this.searchRequest === null) {
          return;
        }
        this.searchRequestObject = this.getSearchObj();
        this.updateSelectedFiltersSet();
        // Modify filters
        this.getResults();
        // this.getSocialSearch();
      }
    }
  }

  reset() {
    this.noContent = false;
    this.concepts = [];
    if (this.searchRequestObject && this.searchRequestObject.pageNo) {
      this.searchRequestObject.pageNo = 0;
    }
    this.searchResults = {
      filters: [],
      result: [],
      totalHits: 0,
      type: []
    };
  }

  getSearchObj() {
    const newReq: ISearchRequest = {
      query: this.searchRequest.query,
      pageNo: 0,
      pageSize: 10,
      filters: { ...this.searchRequest.filters }
    };
    if (this.options) {
      if (newReq.query.toLowerCase() !== 'all' && newReq.query !== '*') {
        if (!this.searchRequest.filters.hasOwnProperty('contentType')) {
          newReq.isStandAlone = true;
        } else if (this.searchRequest.filters.contentType.length === 0) {
          newReq.isStandAlone = true;
        }
      }
      if (this.options.siemensCatalog && !this.isSiemensCatalogFilterRemoved) {
        newReq.siemensCatalog = true;
      }
      if (this.options.sortBy) {
        newReq.sortBy = this.options.sortBy;
      }
      if (this.options.sortOrder) {
        newReq.sortBy = this.options.sortOrder;
      }
      if (this.options.filters) {
        const filterKeys = Object.keys(this.options.filters);
        filterKeys.forEach(key => {
          if (key in newReq.filters) {
            newReq.filters[key] = [...newReq.filters[key], ...this.options.filters[key]];
          } else {
            newReq.filters[key] = [...this.options.filters[key]];
          }
        });
      }
    }
    // Remove filter key if no filters are applied
    if (newReq.filters && !Object.keys(newReq.filters).length) {
      delete newReq.filters;
    }
    return newReq;
  }

  updateSelectedFiltersSet() {
    const valuesForSet = [];
    this.filtersResetAble = false;
    Object.keys(this.searchRequestObject.filters || {}).forEach(key => {
      const unitFilters = this.searchRequestObject.filters[key];
      if (unitFilters.length > 0) {
        if (this.ref === 'certifications') {
          if (key !== 'contentType' && key !== 'resourceType') {
            this.filtersResetAble = true;
          }
        } else {
          this.filtersResetAble = true;
        }
      }
      if (key.toLowerCase() === 'tags') {
        unitFilters.forEach((filterName: string) => {
          const filterNameSubParts = filterName.split('/');
          let filterNameSubPartConcatStr = '';
          for (const filterNameSubPartStr of filterNameSubParts) {
            filterNameSubPartConcatStr =
              filterNameSubPartConcatStr + (filterNameSubPartConcatStr.length ? '/' : '') + filterNameSubPartStr;
            valuesForSet.push(filterNameSubPartConcatStr);
          }
        });
      } else {
        valuesForSet.push(...unitFilters);
      }
    });
    this.selectedFilterSet = new Set(valuesForSet);
  }

  getResults(withQuotes?: boolean) {
    if (this.searchResultsSubscription) {
      this.searchResultsSubscription.unsubscribe();
    }
    this.searchRequestStatus = 'fetching';
    this.exactResult.show = false;
    if (this.exactResult.old !== this.searchRequestObject.query) {
      this.exactResult.applied = false;
    }
    if (withQuotes === undefined && this.searchRequestObject.query.indexOf(' ') > -1 && !this.exactResult.applied) {
      this.searchRequestObject.query = `"${this.searchRequestObject.query}"`;
    } else if (withQuotes && this.searchRequestObject.query.indexOf(' ') > -1) {
      this.exactResult.applied = true;
      this.searchRequestObject.query = this.searchRequestObject.query.replace(/['"]+/g, '');
      this.searchResults.result = [];
      this.exactResult.show = false;
      this.searchRequestObject.pageNo = 0;
      this.exactResult.old = this.searchRequestObject.query;
    }
    this.searchResultsSubscription = this.contentSvc.search(this.searchRequestObject).subscribe(
      data => {
        this.searchResults.totalHits = data.totalHits;
        this.searchResults.filters = data.filters;
        this.searchResults.type = data.type;
        this.searchResults.result = [...this.searchResults.result, ...data.result];
        this.handleFilters(this.searchResults.filters);
        if (this.searchResults.totalHits === 0 && this.searchRequestObject.query.indexOf(' ') === -1) {
          this.noContent = true;
        } else if (
          this.searchResults.totalHits === 0 &&
          this.searchRequestObject.query.indexOf(' ') > -1 &&
          withQuotes
        ) {
          this.noContent = true;
        } else if (this.searchResults.totalHits === 0 && this.searchRequestObject.query.indexOf(' ') > -1) {
          this.searchRequestObject.pageNo = 0;
          this.getResults(true);
          return;
        } else if (
          this.searchResults.totalHits > 0 &&
          this.searchRequestObject.query.indexOf(' ') > -1 &&
          !this.exactResult.applied
        ) {
          this.exactResult.show = true;
          this.exactResult.text = this.searchRequestObject.query.replace(/['"]+/g, '');
        }
        if (this.searchResults.result.length < this.searchResults.totalHits) {
          this.searchRequestStatus = 'hasMore';
        } else {
          this.searchRequestStatus = 'done';
        }
        this.searchRequestObject.pageNo += 1;
        if (
          this.configSvc.instanceConfig.features.learningHub.enabled &&
          this.configSvc.instanceConfig.features.learningHub.available
        ) {
          this.trainingsSvc.getTrainingCountsForSearchResults(data);
        }
      },
      () => {
        this.searchRequestStatus = 'error';
      }
    );
  }

  handleFilters(filters: IFilterUnitResponse[]) {
    this.filtersResponse = filters
      .filter(unitFilter => {
        if (unitFilter.type === 'concepts') {
          this.concepts = unitFilter.content.slice(0, 10);
          return false;
        } else if (
          this.ref === 'certifications' &&
          (unitFilter.type === 'contentType' || unitFilter.type === 'resourceType')
        ) {
          return false;
        }
        return true;
      })
      .map(
        (unitFilter: IFilterUnitResponse): IFilterUnitResponse => ({
          ...unitFilter,
          checked:
            this.searchRequestObject.filters &&
            Array.isArray(this.searchRequestObject.filters[unitFilter.type]) &&
            Boolean(this.searchRequestObject.filters[unitFilter.type].length),
          content: unitFilter.content.map(
            (unitFilterContent: IFilterUnitItem): IFilterUnitItem => ({
              ...unitFilterContent,
              checked: this.selectedFilterSet.has(unitFilterContent.type),
              children: !Array.isArray(unitFilterContent.children)
                ? []
                : unitFilterContent.children.map(
                    (unitFilterSecondLevel: IFilterUnitItem): IFilterUnitItem => ({
                      ...unitFilterSecondLevel,
                      children: [],
                      checked: this.selectedFilterSet.has(unitFilterSecondLevel.type)
                    })
                  )
            })
          )
        })
      );

    // console.log('this.filters >', this.filtersResponse);
  }

  applyFilters(unitFilterObject: { unitFilter: IFilterUnitItem; filterType: string }) {
    this.filtersResponse = [];
    const filterItem = {
      key: unitFilterObject.filterType,
      value: unitFilterObject.unitFilter.type
    };
    const requestFilters = this.searchRequestObject.filters;
    let filterRemove = false;
    if (requestFilters) {
      if (requestFilters[filterItem.key] && requestFilters[filterItem.key].indexOf(filterItem.value) !== -1) {
        filterRemove = true;
      }
    }
    if (!filterRemove) {
      this.filterAdd.emit(filterItem);
    } else {
      this.filterRemove.emit(filterItem);
    }
  }

  showGenericResults() {
    this.reset();
    // this.searchRequestObject.siemensCatalog = false;
    if (this.searchRequestObject.siemensCatalog) {
      delete this.searchRequestObject.siemensCatalog;
      this.isSiemensCatalogFilterRemoved = true;
      this.siemensCatalogRemoved.emit(true);
    }
    this.updateSelectedFiltersSet();
    // Modify filters
    this.getResults();
  }

  showSiemensResults() {
    this.reset();
    this.searchRequestObject.siemensCatalog = true;
    this.siemensCatalogRemoved.emit(false);
    this.isSiemensCatalogFilterRemoved = true;
    this.updateSelectedFiltersSet();
    // Modify filters
    this.getResults();
  }

  removeFilters() {
    this.router.navigate(['/searchv2'], {
      queryParams: { f: null },
      queryParamsHandling: 'merge'
    });
  }

  // toggleSideBar() {
  //   if (this.sideNavBarOpenedUser === null) {
  //     this.sideNavBarOpenedUser = !this.sideNavBarOpened;
  //   } else {
  //     this.sideNavBarOpenedUser = !this.sideNavBarOpenedUser;
  //   }
  //   this.sideNavBarOpened = this.sideNavBarOpenedUser;
  // }

  toggleCardDisplay() {
    this.resultsDisplayType = this.resultsDisplayType === 'basic' ? 'advanced' : 'basic';
    localStorage.setItem('resultsDisplayType', this.resultsDisplayType);
  }

  contentTrackBy(index: number, item: IContent) {
    return item.identifier;
  }
  filterUnitResponseTrackBy(index: number, filter: IFilterUnitResponse) {
    return filter.id;
  }
  filterUnitTrackBy(index: number, filter: IFilterUnitItem) {
    return filter.id;
  }

  // function written to remove best results
  toggleBestResults() {
    try {
      this.searchResults.result = [];
      this.searchRequestObject = this.getSearchObj();
      this.updateSelectedFiltersSet();
      // Modify filters
      this.getResults();
    } catch (e) {
      throw e;
    }
  }
}
