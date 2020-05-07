/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, ViewEncapsulation } from '@angular/core'
import { FormControl } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { ConfigurationsService, NsPage } from '@ws-widget/utils'
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'
import { ISearchAutoComplete, ISearchQuery, ISuggestedFilters } from '../../models/search.model'
import { SearchServService } from '../../services/search-serv.service'
@Component({
  selector: 'ws-app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  // tslint:disable-next-line
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit {

  query: FormControl = new FormControl('')
  pageNavbar: Partial<NsPage.INavBackground> = this.configSvc.pageNavBar
  autoCompleteResults: ISearchAutoComplete[] = []
  searchQuery: ISearchQuery = {
    l: this.getActivateLocale(),
    q: '',
  }
  languageSearch: string[] = []
  suggestedFilters: ISuggestedFilters[] = []
  constructor(
    private configSvc: ConfigurationsService,
    private router: Router,
    private route: ActivatedRoute,
    private searchSvc: SearchServService,
  ) {
    const isAutoCompleteAllowed = this.route.snapshot.data.pageData.data.search.isAutoCompleteAllowed
    if (typeof isAutoCompleteAllowed === 'undefined' ||
      (typeof isAutoCompleteAllowed === 'boolean' && isAutoCompleteAllowed)) {
      this.query.valueChanges.pipe(
        debounceTime(200),
        distinctUntilChanged(),
      ).subscribe(q => {
        this.searchQuery.q = q
        this.getAutoCompleteResults()
      })
    }
  }

  search(query?: string) {
    this.router.navigate(['/app/search/home'], {
      queryParams: { lang: this.searchQuery.l, q: query || this.searchQuery.q },
    }).then(() => {
      this.router.navigate(['/app/search/learning'], {
        queryParams: {
          q: query || this.searchQuery.q,
          lang: this.searchQuery.l,
        },
      })
    })
  }

  searchWithFilter(filter: any): void {
    const objType = filter.contentType ? { contentType: [filter.contentType] } :
      filter.resourceType ? { resourceType: [filter.resourceType] } : filter.combinedType === 'learningContent' ?
        { contentType: ['Collection', 'Learning Path', 'Course'] } : ''
    this.router.navigate(['/app/search/home'], {
      queryParams: { lang: this.searchQuery.l, q: this.searchQuery.q },
    }).then(() => {
      this.router.navigate(['/app/search/learning'], {
        queryParams: {
          q: this.searchQuery.q,
          lang: this.searchQuery.l,
          f: JSON.stringify(objType),
        },
      })
    })
  }

  getActivateLocale(): string {
    const locale = (this.configSvc.activeLocale && this.configSvc.activeLocale.locals[0]) || 'en'
    return this.searchSvc.getLanguageSearchIndex(locale)
  }

  getAutoCompleteResults(): void {
    this.searchSvc.searchAutoComplete(this.searchQuery).then((results: ISearchAutoComplete[]) => {
      this.autoCompleteResults = results
    }).catch(() => {

    })
  }

  searchLanguage(lang: string): void {
    this.router.navigate([], {
      queryParams: { lang, q: this.searchQuery.q },
      queryParamsHandling: 'merge',
      relativeTo: this.route.parent,
    })
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe(queryParam => {
      if (queryParam.has('q')) {
        this.searchQuery.q = queryParam.get('q') || ''
      } else {
        this.searchQuery.q = ''
      }
      this.query.setValue(this.searchQuery.q)
      if (queryParam.has('lang')) {
        this.searchQuery.l = queryParam.get('lang') || this.getActivateLocale()
      } else {
        this.searchQuery.l = this.getActivateLocale()
      }
      this.languageSearch = this.route.snapshot.data.pageData.data.search.languageSearch.map(
        (u: string) => u.toLowerCase(),
      )
    })
    this.searchSvc.getSearchConfig().then(res => {
      this.suggestedFilters = res.search && res.search.suggestedFilters

    })
  }

}
