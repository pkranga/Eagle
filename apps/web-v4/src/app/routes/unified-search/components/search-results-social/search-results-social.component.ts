/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, Input, Output, EventEmitter, OnChanges, OnInit, OnDestroy, SimpleChanges } from '@angular/core';
import { FetchStatus } from '../../../../models/status.model';
import { IContent } from '../../../../models/content.model';
import { ValuesService } from '../../../../services/values.service';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SocialService } from '../../../../services/social.service';
import { ISocialSearchPartialRequest, ISocialSearchResult, TPostKind } from '../../../../models/social.model';
import { IFilterUnitItem, IFilterUnitResponse, ISearchRequest } from '../../../../models/searchResponse.model';
import { AuthService } from '../../../../services/auth.service';

export interface SearchResultsComponentOptions {
  filters?: { [type: string]: string[] };
  isStandAlone?: boolean;
  siemensCatalog: boolean;
  sortBy?: string;
  sortOrder?: string;
}
@Component({
  selector: 'ws-search-results-social',
  templateUrl: './search-results-social.component.html',
  styleUrls: ['./search-results-social.component.scss']
})
export class SearchResultsSocialComponent implements OnInit, OnChanges, OnDestroy {
  @Input()
  searchRequest: { query: string; filters: { [type: string]: string[] }; social?: string; sort?: string };

  @Input()
  options?: SearchResultsComponentOptions;
  @Input() isSiemensCatalogFilterRemoved = false;
  @Input() ref: string;
  @Output() filterAdd = new EventEmitter<{ key: string; value: string }>();
  @Output() filterRemove = new EventEmitter<{ key: string; value: string }>();
  @Output() siemensCatalogRemoved = new EventEmitter<boolean>();

  searchRequestStatus: FetchStatus = 'none';
  searchResults: ISocialSearchResult;
  searchResultsSubscription: Subscription;
  searchResponseFilters: { [filter: string]: string[] };

  sideNavBarOpened = true;
  sideNavBarOpenedUser = null;
  isMedium$ = this.valueSvc.isLtMedium$;
  private defaultSideNavBarOpenedSubscription: Subscription;
  mode$ = this.isMedium$.pipe(map(isMedium => (isMedium ? 'over' : 'side')));
  noContent = false;
  searchRequestObject: ISearchRequest = null;
  filtersResponse: IFilterUnitResponse[] = [];
  sObject: ISocialSearchPartialRequest = {
    userId: this.authSvc.userId,
    query: '',
    pageNo: 0,
    pageSize: 10,
    sessionId: Date.now(),
    postKind: 'Query',
    filters: {},
    locale: 'EN',
    sort: []
  };
  query = true;
  resultsDisplayType: 'basic' | 'advanced' = 'advanced';
  filtersResetAble = false;
  private selectedFilterSet = new Set();

  constructor(
    private valueSvc: ValuesService,
    private router: Router,
    private socialSvc: SocialService,
    private authSvc: AuthService
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
      if (property === 'searchRequest') {
        this.reset();
        if (this.searchRequest === null) {
          return;
        }
        if (this.searchRequest.social) {
          this.query = this.searchRequest.social === 'Query' ? true : false;
          this.sObject.postKind = this.searchRequest.social as TPostKind;
        }
        if (this.searchRequest.sort) {
          if (this.searchRequest.sort === 'Latest') {
            this.sObject.sort = [{ dtLastModified: 'desc' }];
          } else if (this.searchRequest.sort === 'Trending') {
            this.sObject.sort = this.query ? [{ upVote: 'desc' }] : [{ likes: 'desc' }];
          } else {
            this.sObject.sort = [];
          }
        } else {
          this.searchRequest.sort = 'Relevance';
        }
        this.searchRequestObject = this.getSearchObj();
        this.updateSelectedFiltersSet();
        // Modify filters
        if (this.searchRequestObject.filters) {
          this.sObject.filters = this.searchRequestObject.filters;
        }
        this.sObject.query = this.searchRequestObject.query;
        this.getResults();
      }
    }
  }

  reset() {
    this.noContent = false;
    this.searchResults = {
      filters: [],
      result: [],
      total: 0
    };
    this.sObject.filters = {};
    this.sObject.pageNo = 0;
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
        this.filtersResetAble = true;
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
    this.searchResultsSubscription = this.socialSvc.fetchSocialSearchUsers(this.sObject).subscribe(
      data => {
        this.searchResults.total = data.total;
        this.searchResults.filters = data.filters;
        this.searchResults.result = [...this.searchResults.result, ...data.result];
        this.handleFilters(this.searchResults.filters);

        if (this.searchResults.result.length < this.searchResults.total) {
          this.searchRequestStatus = 'hasMore';
        } else {
          this.searchRequestStatus = 'done';
        }
        if(this.searchResults.total === 0){
          this.noContent = true;
        }
        this.sObject.pageNo += 1;
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
          return false;
        } else if (unitFilter.type === 'dtLastModified') {
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
              checked:
                typeof unitFilterContent.type === 'string'
                  ? this.selectedFilterSet.has(unitFilterContent.type)
                  : this.selectedFilterSet.has({
                      from: unitFilterContent.from,
                      to: unitFilterContent.to
                    }),
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
        ? unitFilterObject.unitFilter.type
        : unitFilterObject.unitFilter.displayName
      // unitFilterObject.filterType === 'dtLastModified'
      //   ? {
      //       from: unitFilterObject.unitFilter.from,
      //       to: unitFilterObject.unitFilter.to
      //     }
      //   :
      // unitFilterObject.unitFilter.type
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
      this.query = !this.query;
      this.sObject.postKind = this.query ? 'Query' : 'Blog';
      this.sObject.pageNo = 0;
      this.router.navigate(['/searchv2'], {
        queryParams: { social: this.sObject.postKind },
        queryParamsHandling: 'merge'
      });
    } catch (e) {
      throw e;
    }
  }

  sortOrder(type: string) {
    try {
      this.router.navigate(['/searchv2'], {
        queryParams: { sort: type },
        queryParamsHandling: 'merge'
      });
    } catch (e) {
      throw e;
    }
  }
}
