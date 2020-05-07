/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  Input,
  OnChanges,
  SimpleChange,
  Output,
  EventEmitter,
  ViewEncapsulation,
} from '@angular/core'
import { FormControl } from '@angular/forms'
import { Observable } from 'rxjs'
import { debounceTime, switchMap, startWith, distinctUntilChanged } from 'rxjs/operators'
import { ActivatedRoute, Router } from '@angular/router'
import { ISearchAutoComplete } from '../../models/search.model'
import { SearchServService } from '../../services/search-serv.service'
import { ConfigurationsService } from '@ws-widget/utils/src/public-api'

@Component({
  selector: 'ws-app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss'],
  // tslint:disable-next-line
  encapsulation: ViewEncapsulation.None,
})
export class SearchInputComponent implements OnInit, OnChanges {
  @Input() placeHolder = ''
  @Input() ref = ''
  @Output() closed: EventEmitter<boolean> = new EventEmitter()
  queryControl = new FormControl(this.activated.snapshot.queryParams.q || 'all')
  languageSearch: string[] = []
  filteredOptions$: Observable<string[]> = this.queryControl.valueChanges.pipe(
    startWith(this.queryControl.value),
    debounceTime(500),
    distinctUntilChanged(),
    switchMap(() => []),
  )
  @ViewChild('searchInput', { static: false }) searchInputElem: ElementRef<any> = {} as ElementRef<
    any
  >
  autoCompleteResults: ISearchAutoComplete[] = []
  searchLocale = this.getActiveLocale()

  constructor(
    private activated: ActivatedRoute,
    private router: Router,
    private searchServSvc: SearchServService,
    private configSvc: ConfigurationsService,
    private route: ActivatedRoute,
  ) {
    const isAutoCompleteAllowed = this.route.snapshot.data.searchPageData.data.search.isAutoCompleteAllowed
    if (typeof isAutoCompleteAllowed === 'undefined' ||
      (typeof isAutoCompleteAllowed === 'boolean' && isAutoCompleteAllowed)) {
      this.queryControl.valueChanges.pipe(
        debounceTime(200),
        distinctUntilChanged(),
      ).subscribe(q => {
        this.getSearchAutoCompleteResults(q)
      })
    }
  }

  ngOnInit() {
    if (this.searchInputElem.nativeElement) {
      this.searchInputElem.nativeElement.activated()
    }
    this.activated.queryParamMap.subscribe(queryParam => {
      if (queryParam.has('q')) {
        this.queryControl.setValue(queryParam.get('q') || 'all')
      } else {
        this.updateQuery('all')
      }
      if (queryParam.has('lang')) {
        this.searchLocale = queryParam.get('lang') || this.getActiveLocale()
      } else {
        this.searchLocale = this.getActiveLocale()
      }
      const isAutoCompleteAllowed = this.route.snapshot.data.searchPageData.data.search.isAutoCompleteAllowed
      if (typeof isAutoCompleteAllowed === 'undefined' ||
        (typeof isAutoCompleteAllowed === 'boolean' && isAutoCompleteAllowed)) {
        this.getSearchAutoCompleteResults(this.queryControl.value)
      }
    })
    this.languageSearch = this.route.snapshot.data.searchPageData.data.search.languageSearch.map(
      (u: string) => u.toLowerCase(),
    )
  }
  ngOnChanges() {
    for (const change in SimpleChange) {
      if (change === 'placeHolder') {
        this.placeHolder = this.placeHolder
      }
    }
  }

  getActiveLocale(): string {
    const locale = (this.configSvc.activeLocale && this.configSvc.activeLocale.locals[0]) || 'en'
    return this.searchServSvc.getLanguageSearchIndex(locale)
  }

  updateQuery(query: string) {
    let q = query
    q = query.replace(/['"]+/g, '')
    if (this.searchInputElem && this.searchInputElem.nativeElement) {
      this.searchInputElem.nativeElement.blur()
    }
    if (this.ref === 'home') {
      this.closed.emit(false)
      this.router.navigate(['/app/search'], {
        queryParams: { q: q.trim() },
        queryParamsHandling: 'merge',
      })
    } else {
      this.router.navigate([], {
        relativeTo: this.activated.parent,
        queryParams: { q: q.trim() },
        queryParamsHandling: 'merge',
      })
    }
  }

  getSearchAutoCompleteResults(q: string) {
    if (this.searchLocale.split(',').length === 1) {
      this.searchServSvc.searchAutoComplete({
        q,
        l: this.searchLocale,
      }).then((result: ISearchAutoComplete[]) => {
        this.autoCompleteResults = result
      }).catch(() => { })
    }
  }

  searchLanguage(lang: string) {
    this.router.navigate([], {
      relativeTo: this.activated.parent,
      queryParams: { lang, q: this.queryControl.value },
      queryParamsHandling: 'merge',
    })
  }
}
