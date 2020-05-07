/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { UserApiService } from '../../../../apis/user-api.service';
import { IErrorObj, IKhubResult } from '../../../../models/khub.model';
import { ISearchApiResult, ISearchRequest } from '../../../../models/searchResponse.model';
import { IPostTag } from '../../../../models/social.model';
import { FetchStatus } from '../../../../models/status.model';
import { ContentService } from '../../../../services/content.service';
import { KhubService } from '../../../../services/khub.service';
import { SocialService } from '../../../../services/social.service';
import { ValuesService } from '../../../../services/values.service';
import { ConfigService } from '../../../../services/config.service';

@Component({
  selector: 'app-khub-home',
  templateUrl: './khub-home.component.html',
  styleUrls: ['./khub-home.component.scss']
})
export class KhubHomeComponent implements OnInit, OnDestroy {
  private defaultSideNavBarOpenedSubscription;
  isLtMedium$ = this.valueSvc.isLtMedium$;
  searchDirector = this.configSvc.instanceConfig.externalLinks.searchValue || 'search';
  screenSizeIsLtMedium: boolean;
  KhubResult: IKhubResult;
  khubResult2 = {
    kshop: [],
    automationcentral: [],
    project: [],
    marketing: []
  };
  fetchStatus: boolean;
  searchObj = {
    searchQuery: '',
    from: 0,
    size: 25
  };
  query = '';
  public errObj: IErrorObj = {
    show: false,
    title: 'Check your Internet connection',
    body: 'Some Error Occured While fetching the details',
    cancelText: 'Back',
    modelType: 'danger',
    btnType: 'primary',
    okText: 'ok'
  };
  isIntranet: boolean;
  myControl = new FormControl();
  options: string[] = [];
  filteredOptions: Observable<string[]>;
  autocompleteAllTags: IPostTag[];
  @Input() version = 3;
  searchRequestObject: ISearchRequest = {
    userAgent: '',
    query: '',
    pageNo: 0,
    pageSize: 25,
    filters: {
      // tags: ['Marketing/Brand/Corporate']
      tags: ['Marketing']
    },
    sortBy: 'lastUpdatedOn',
    sortOrder: '"DESC"',
    isStandAlone: true
  };
  searchResults: ISearchApiResult = {
    totalHits: 0,
    result: [],
    filters: [],
    type: []
  };
  searchResultsStatus: FetchStatus;
  constructor(
    private khubServ: KhubService,
    private valueSvc: ValuesService,
    private socialSvc: SocialService,
    private router: Router,
    private contentSvc: ContentService,
    private userApi: UserApiService,
    private configSvc: ConfigService
  ) {}

  ngOnInit() {
    this.defaultSideNavBarOpenedSubscription = this.isLtMedium$.subscribe(isLtMedium => {
      this.screenSizeIsLtMedium = isLtMedium;
    });
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );
    this.fetchPerData();
    this.initiateSearch();
    this.userApi.checkIfIntranet().subscribe(data => {
      this.isIntranet = data;
    });
  }
  displayFn(user?: string): string | undefined {
    return user ? user : undefined;
  }
  private _filter(name: string): any {
    const filterValue = name.toLowerCase();
    if (filterValue && filterValue.length) {
      this.socialSvc.fetchAutoComplete(filterValue).subscribe(
        tags => {
          this.autocompleteAllTags = tags || [];
          this.autocompleteAllTags.map(cur => {
            this.options.push(cur.name);
          });
        },
        err => {
          // console.error(err);
          this.options = [];
        }
      );
      return this.options.filter(option => option.toLowerCase().includes(filterValue));
    }
  }
  ngOnDestroy() {
    if (this.defaultSideNavBarOpenedSubscription) {
      this.defaultSideNavBarOpenedSubscription.unsubscribe();
    }
  }

  fetchPerData() {
    try {
      this.khubServ.fetchTimelineData(this.searchObj).subscribe(
        data => {
          this.KhubResult = data;
          this.khubResult2.kshop = data.kshop;
          this.khubResult2.project = data.project;
          this.khubResult2.automationcentral = data.automationcentral;
          this.fetchStatus = true;
        },
        error => {
          // console.error(error);
          this.errObj.show = true;
        }
      );
    } catch (e) {
      // console.error(e);
      throw e;
    }
  }
  goToSearch() {
    this.query = this.myControl.value;
    if (this.query.length > 0) {
      this.router.navigate(['/khub/search'], {
        queryParams: { query: this.query, tab: 0 }
      });
    }
  }
  onPress(event: any) {
    if (event.keyCode === 13) {
      this.goToSearch();
    }
  }
  initiateSearch() {
    if (this.searchResultsStatus === 'fetching') {
      return;
    }
    this.searchResultsStatus = 'fetching';
    this.contentSvc.search(this.searchRequestObject, Number(this.version)).subscribe(
      data => {
        if (data) {
          this.searchResults.totalHits = data.totalHits;
          this.searchResults.filters = data.filters;
          this.searchResults.result = [...this.searchResults.result, ...data.result];
          this.khubResult2.marketing = data.result;
          if (this.searchResults.totalHits === 0) {
            this.searchResultsStatus = 'done';
            return;
          }
          if (this.searchResults.result.length === this.searchResults.totalHits || data.result.length === 0) {
            this.searchResultsStatus = 'done';
          } else {
            this.searchResultsStatus = 'hasMore';
          }
          this.searchRequestObject.pageNo += 1;
        } else {
          this.searchResultsStatus = 'done';
        }
      },
      err => {
        this.searchResultsStatus = 'error';
      }
    );
  }
}
