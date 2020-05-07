/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ISearchRequest, ISearchApiResult } from '../../../../models/searchResponse.model';
import { ContentService } from '../../../../services/content.service';
import { FetchStatus, SearchStripStatus } from '../../../../models/status.model';
import { IInstanceSearchRedirection } from '../../../../models/instanceConfig.model';
import { SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-search-strip',
  templateUrl: './search-strip.component.html',
  styleUrls: ['./search-strip.component.scss']
})
export class SearchStripComponent implements OnInit, OnChanges {
  @Input() cardType: 'basic' | 'advanced' = 'advanced';
  @Input() searchRequest: ISearchRequest;
  @Input() heading: string;
  @Input() version = 3;
  @Output() contentStatus = new EventEmitter<SearchStripStatus>();
  @Input() searchRedirection: IInstanceSearchRedirection;

  searchRequestObject: ISearchRequest;
  searchResults: ISearchApiResult;
  searchResultsStatus: FetchStatus;
  queryParams: { [key: string]: string } = {};
  constructor(private contentSvc: ContentService) {}

  ngOnInit() {
    // this.initiateSearch();
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const property in changes) {
      if (property === 'searchRequest' && this.searchRequest) {
        this.searchRequestObject = {
          ...this.searchRequest,
          filters: {
            ...this.searchRequest.filters,
            learningMode: ['Self-Paced']
          }
        };
        this.initiateSearch();
      } else if (property === 'searchRedirection' && this.searchRedirection) {
        this.queryParams = {};
        if (this.searchRedirection.q) {
          this.queryParams.q = this.searchRedirection.q;
        }
        if (this.searchRedirection.tab) {
          this.queryParams.tab = this.searchRedirection.tab;
        }
        if (this.searchRedirection.f) {
          this.queryParams.f = JSON.stringify(this.searchRedirection.f);
        }
        // console.log('this.queryParams', this.queryParams);
      }
    }
  }

  initiateSearch() {
    if (this.searchResultsStatus === 'fetching') {
      return;
    }

    if (this.searchRequestObject.pageNo === 0) {
      this.searchResults = {
        filters: [],
        result: [],
        totalHits: 0,
        type: []
      };
    }

    this.searchResultsStatus = 'fetching';
    this.contentSvc.search(this.searchRequestObject, Number(this.version)).subscribe(
      data => {
        if (data) {
          this.searchResults.totalHits = data.totalHits;
          this.searchResults.filters = data.filters;
          this.searchResults.result = [...this.searchResults.result, ...data.result];
          if (this.searchResults.totalHits === 0) {
            this.searchResultsStatus = 'done';
            this.contentStatus.emit('none');
            return;
          }
          if (this.searchResults.result.length === this.searchResults.totalHits || data.result.length === 0) {
            this.contentStatus.emit('done');
            this.searchResultsStatus = 'done';
          } else {
            this.searchResultsStatus = 'hasMore';
          }
          this.searchRequestObject.pageNo += 1;
        } else {
          this.searchResultsStatus = 'done';
          this.contentStatus.emit('none');
        }
      },
      err => {
        console.log('search strip error >', err);
        this.searchResultsStatus = 'error';
        this.contentStatus.emit('error');
      }
    );
  }
}
