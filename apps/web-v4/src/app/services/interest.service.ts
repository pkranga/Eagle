/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { InterestApiService } from '../apis/interest-api.service';
import { CatalogService } from './catalog.service';
import { UtilityService } from './utility.service';

@Injectable({
  providedIn: 'root'
})
export class InterestService {
  constructor(private interestApi: InterestApiService, private catalogSvc: CatalogService, private utilitySvc: UtilityService) {}

  fetchUserInterests(): Observable<string[]> {
    return this.interestApi.fetchUserTopics();
  }

  fetchSuggestedInterests(): Observable<string[]> {
    return this.interestApi.fetchSuggestedTopics();
  }

  modifyUserInterests(topics: string[]) {
    return this.interestApi.modifyUserTopics(topics);
  }

  fetchAutocompleteInterests(): Observable<string[]> {
    return this.catalogSvc.fetchCatalog().pipe(
      map(catalogdataTree => {
        return this.utilitySvc.getLeafNodes(catalogdataTree, []).map(catalog => catalog.value) || [];
      })
    );
  }
}
