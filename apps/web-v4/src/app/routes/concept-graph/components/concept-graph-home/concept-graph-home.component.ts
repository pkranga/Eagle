/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, startWith, switchMap } from 'rxjs/operators';
// import { ContentService } from '../../../../services/content.service';
import { RoutingService } from '../../../../services/routing.service';
import { SocialService } from '../../../../services/social.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'ws-concept-graph-home',
  templateUrl: './concept-graph-home.component.html',
  styleUrls: ['./concept-graph-home.component.scss']
})
export class ConceptGraphHomeComponent implements OnInit {
  queryControl = new FormControl('');

  filteredOptions$: Observable<
    { id: string; name: string; concept_id?: number }[]
  > = this.queryControl.valueChanges.pipe(
    startWith(this.queryControl.value),
    debounceTime(500),
    distinctUntilChanged(),
    switchMap(value => this.socialSvc.fetchAutoComplete(value ? value : ' '))
  );
  @ViewChild('searchInput', { static: true }) searchInputElem: ElementRef<any>;
  constructor(
    public routingSvc: RoutingService,
    private router: Router,
    private socialSvc: SocialService,
    public matSnackBar: MatSnackBar
  ) {}

  ngOnInit() {}

  updateQuery(query: number) {
    this.searchInputElem.nativeElement.blur();
    if (query && query !== undefined) {
      this.router.navigate(['/concept-graph/' + query]);
    } else {
      this.matSnackBar.open('The Selected topic doesn"t have any related items', 'close', {
        duration: 3000
      });
    }
  }
}
