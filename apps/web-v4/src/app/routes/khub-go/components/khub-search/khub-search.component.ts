/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, Input, OnDestroy, OnInit, OnChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { IErrorObj, IKhubViewResult } from '../../../../models/khub.model';
import { KhubService } from '../../../../services/khub.service';
import { SocialService } from '../../../../services/social.service';
import { ISearchApiResult, ISearchRequest } from '../../../../models/searchResponse.model';
import { ValuesService } from '../../../../services/values.service';
import { ConfigService } from '../../../../services/config.service';
@Component({
  selector: 'app-khub-search',
  templateUrl: './khub-search.component.html',
  styleUrls: ['./khub-search.component.scss']
})
export class KhubSearchComponent implements OnInit, OnDestroy, OnChanges {
  @Input() version = 3;
  private defaultSideNavBarOpenedSubscription;
  searchDirector = this.configSvc.instanceConfig.externalLinks.searchValue || 'search';
  isLtMedium$ = this.valueSvc.isLtMedium$;
  screenSizeIsLtMedium: boolean;
  mode$ = this.isLtMedium$.pipe(map(isMedium => (isMedium ? 'over' : 'side')));
  sideNavBarOpened = true;
  currentTab = 'myanalytics';
  selectedIndex = 0;
  searchObj = {
    searchQuery: '',
    from: 0,
    size: 18,
    category: '',
    filter: ''
  };
  @Input() query: string;
  @Input() tab: string;
  @Input() filters: any;
  KhubResult: IKhubViewResult;
  dataShown = [
    {
      data: [],
      from: 0,
      count: 0,
      refiners: [],
      fetchStatus: false,
      appliedRefiners: [],
      filter: ''
    },
    {
      data: [],
      from: 0,
      count: 0,
      refiners: [],
      fetchStatus: false,
      appliedRefiners: [],
      filter: ''
    }
  ];
  appliedRefiners: Array<any> = [];
  fetchStatus: boolean;
  fetchmore: boolean;
  message: string;
  error: boolean;
  myControl = new FormControl();
  options: string[] = [];
  filteredOptions: Observable<string[]>;
  searchRequestObject: ISearchRequest;
  searchResults: ISearchApiResult;
  public errObj: IErrorObj = {
    show: false,
    title: 'Check your Internet connection',
    body: 'Some Error Occured While Fetching the Results for query',
    cancelText: 'Back',
    modelType: 'danger',
    btnType: 'primary',
    okText: 'ok'
  };
  constructor(
    private valueSvc: ValuesService,
    private khubServ: KhubService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private socialSvc: SocialService,
    private configSvc: ConfigService
  ) {}

  ngOnInit() {
    if (this.searchDirector === 'search') {
      this.activatedRoute.queryParamMap.subscribe(queryParams => {
        // this.selectedIndex = queryParams.get('tab') === 'kArtifacts' ? 0 : 1;
        this.selectedIndex = parseInt(queryParams.get('tab'), 10);
        if (queryParams.has('query')) {
          this.searchObj.searchQuery = queryParams.get('query');
          this.myControl.setValue(queryParams.get('query'));
          this.tab = queryParams.get('tab');
          this.searchObj.filter = '';
          this.fetchPerData();
        }
      });
    }
    this.defaultSideNavBarOpenedSubscription = this.isLtMedium$.subscribe(isLtMedium => {
      this.screenSizeIsLtMedium = isLtMedium;
      this.sideNavBarOpened = !isLtMedium;
    });
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );
  }
  ngOnChanges() {
    if (this.query && this.tab && this.searchDirector === 'searchv2') {
      this.searchObj.filter = '';
      this.selectedIndex = this.tab === 'kArtifacts' ? 0 : 1;
      this.dataShown[this.selectedIndex].appliedRefiners = [];
      this.searchObj.searchQuery = this.query;
      this.myControl.setValue(this.query);
      if (this.filters) {
        this.dataShown[this.selectedIndex].appliedRefiners = this.filters;
        this.searchObj.filter = this.getRefinerString();
      } else {
        this.searchObj.filter = '';
      }
      this.fetchPerData();
    }
  }

  // const refiner = queryParams.has('r') && this.tab === queryParams.get('tab') ? queryParams.get('r') : '';
  // if (refiner) {
  //   this.dataShown[this.selectedIndex].appliedRefiners = JSON.parse(refiner);
  //   this.searchObj.filter = this.getRefinerString();
  // } else {
  // this.searchObj.filter = '';
  // }
  // this.query = queryParams.get('q');
  displayFn(user?: string): string | undefined {
    return user ? user : undefined;
  }
  private _filter(name: string): any {
    const filterValue = name.toLowerCase();
    if (filterValue && filterValue.length) {
      this.socialSvc.fetchAutoComplete(filterValue).subscribe(
        tags => {
          tags.map(cur => {
            this.options.push(cur.name);
          });
        },
        err => {
          throw err;
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

  onTabChange(selectedIndex: number) {
    this.selectedIndex = selectedIndex;
    this.error = false;
    if (this.selectedIndex > 1) {
      this.router.navigate(['/search'], {
        queryParams: { q: this.searchObj.searchQuery }
      });
    } else {
      this.router.navigate(['/khub/search'], {
        queryParams: { query: this.searchObj.searchQuery, tab: selectedIndex },
        queryParamsHandling: 'merge'
      });
    }
  }
  fetchPerData() {
    try {
      // if (this.dataShown[this.selectedIndex].fetchStatus && type !== undefined) {
      //   return;
      // }
      this.fetchStatus = false;
      this.searchObj.category = this.selectedIndex === 0 ? 'document' : 'project';
      this.dataShown[this.selectedIndex].refiners = [];
      this.khubServ.fetchSearchData(this.searchObj).subscribe(
        data => {
          this.KhubResult = data;
          this.dataShown[this.selectedIndex].data = this.khubServ.setTiles(data.hits);
          for (const val in data.filters) {
            if (data.filters[val].length > 0) {
              const obj = {
                key: val,
                name: val.slice(0, 1).toUpperCase() + val.slice(1),
                value: this.formatRefiners(data.filters[val], val),
                button: true
              };
              this.dataShown[this.selectedIndex].refiners.push(obj);
            }
          }
          this.fetchStatus = true;
          this.dataShown[this.selectedIndex].count = data.count;
          this.dataShown[this.selectedIndex].fetchStatus = true;
        },
        error => {
          // throw error;
          this.fetchStatus = true;
          // this.message = 'Some error Occured Please try Later';
          this.error = true;
        }
      );
    } catch (e) {
      throw e;
    }
  }
  getRefinerString() {
    try {
      let tempRefiner = '';
      const strArr = [];
      this.dataShown[this.selectedIndex].appliedRefiners.map(cur => {
        let str = '';
        const count = cur.arr.length;
        cur.arr.map((cur1, i) => {
          if (i !== count - 1) {
            str += '"' + cur1 + '",';
          } else {
            str += '"' + cur1 + '"]';
          }
        });
        if (cur.arr.length > 0) {
          strArr.push('"' + cur.type + '":[' + str);
        }
      });
      tempRefiner = strArr.join('$');
      return tempRefiner;
    } catch (e) {
      throw e;
    }
  }
  refinerForSearch() {
    try {
      if (this.screenSizeIsLtMedium) {
        this.sideNavBarOpened = !this.sideNavBarOpened;
      }
      this.dataShown[this.selectedIndex].filter = this.getRefinerString();
      this.searchObj.filter = this.dataShown[this.selectedIndex].filter;
      if (this.searchDirector === 'searchv2') {
        this.router.navigate(['/searchv2'], {
          queryParams: {
            q: this.myControl.value,
            tab: this.tab,
            f: JSON.stringify(this.dataShown[this.selectedIndex].appliedRefiners)
          }
        });
      } else {
        this.fetchPerData();
      }
    } catch (e) {
      throw e;
    }
  }
  clickCheckBox(event: any) {
    try {
      if (event.checked) {
        this.applyRefiner(event.source.id, 'add');
        this.refinerForSearch();
      } else if (!event.checked) {
        this.applyRefiner(event.source.id, 'remove');
        this.refinerForSearch();
      }
    } catch (e) {
      throw e;
    }
  }
  goToSearch() {
    if (this.myControl.value.length > 0) {
      this.router.navigate(['/khub/search'], {
        queryParams: {
          query: this.myControl.value,
          tab: this.selectedIndex
        },
        queryParamsHandling: 'merge'
      });
    }
  }
  onPress(event: any) {
    if (event.keyCode === 13) {
      this.goToSearch();
    }
  }
  fetchMore() {
    try {
      if (this.dataShown[this.selectedIndex].count < this.dataShown[this.selectedIndex].from) {
        return;
      }
      this.fetchmore = true;
      this.dataShown[this.selectedIndex].from += this.searchObj.size;
      this.searchObj.category = this.selectedIndex === 0 ? 'document' : 'project';
      this.searchObj.from = this.dataShown[this.selectedIndex].from;
      this.khubServ.fetchSearchData(this.searchObj).subscribe(
        data => {
          this.dataShown[this.selectedIndex].data = [
            ...this.dataShown[this.selectedIndex].data,
            ...this.khubServ.setTiles(data.hits)
          ];
          this.fetchmore = false;
        },
        error => {
          // throw error;
          this.fetchmore = false;
          // this.message = 'Some error Occured Please try Later';
          this.error = true;
        }
      );
    } catch (e) {
      throw e;
    }
  }
  applyRefiner(refine: string, type?: string) {
    try {
      if (type === 'add') {
        if (this.dataShown[this.selectedIndex].appliedRefiners.length > 0) {
          let count = 0;
          this.dataShown[this.selectedIndex].appliedRefiners.map(cur => {
            if (cur.type === refine.split('*#*')[0]) {
              count += 1;
              if (cur.arr.indexOf(refine.split('*#*')[1]) === -1) {
                cur.arr.push(refine.split('*#*')[1]);
              }
            }
          });
          if (count === 0) {
            const ref1 = {
              type: refine.split('*#*')[0],
              arr: [refine.split('*#*')[1]]
            };
            this.dataShown[this.selectedIndex].appliedRefiners.push(ref1);
          }
        } else {
          const ref = {
            type: refine.split('*#*')[0],
            arr: [refine.split('*#*')[1]]
          };
          this.dataShown[this.selectedIndex].appliedRefiners.push(ref);
        }
        // sessionStorage.setItem(
        //   'search-refiners',
        //   JSON.stringify(this.dataShown[this.selectedIndex].appliedRefiners)
        // );
      } else if (type === 'remove') {
        this.dataShown[this.selectedIndex].appliedRefiners.map(cur => {
          if (cur.type === refine.split('*#*')[0]) {
            const index = cur.arr.indexOf(refine.split('*#*')[1]);
            if (index > -1) {
              cur.arr.splice(index, 1);
            }
          }
        });
        // sessionStorage.setItem(
        //   'search-refiners',
        //   JSON.stringify(this.dataShown[this.selectedIndex].appliedRefiners)
        // );
      }
    } catch (e) {
      throw e;
    }
  }
  formatRefiners(filter: any, type: string) {
    try {
      filter.map(cur => {
        if (this.dataShown[this.selectedIndex].appliedRefiners.length > 0) {
          this.dataShown[this.selectedIndex].appliedRefiners.map(cur1 => {
            if (cur1.arr.indexOf(cur.key) > -1) {
              cur.checked = true;
            } else if (cur.checked === undefined) {
              cur.checked = false;
            }
          });
        } else {
          cur.checked = false;
        }
      });
      return filter;
    } catch (e) {
      throw e;
    }
  }
  removeRefiners() {
    try {
      this.dataShown[this.selectedIndex].appliedRefiners = [];
      this.searchObj.filter = '';
      // if (this.searchDirector === 'searchv2') {
      //   this.router.navigate(['/searchv2'], {
      //     queryParams: {
      //       q: this.myControl.value,
      //       tab: this.tab
      //     }
      //   });
      // } else {
      this.refinerForSearch();
      // }
    } catch (e) {
      throw e;
    }
  }
}
