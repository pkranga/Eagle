/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Injectable } from '@angular/core'
import { Observable, noop } from 'rxjs'
import { map, catchError } from 'rxjs/operators'

import { WidgetContentService, NsContent, NSSearch } from '@ws-widget/collection'
import { ConfigurationsService } from '@ws-widget/utils'

import { TrainingApiService } from '../apis/training-api.service'

@Injectable()
export class TrainingService {
  constructor(
    private contentSvc: WidgetContentService,
    private trainingApi: TrainingApiService,
    private configSvc: ConfigurationsService,
  ) { }

  getTrainingCountsForSearchResults(searchResults: NSSearch.ISearchApiResult) {
    const identifiers: string[] = searchResults.result
      .filter(content => this.isValidTrainingContent(content))
      .map<string>(course => course.identifier)

    if (!identifiers.length) {
      return
    }

    this.trainingApi
      .getTrainingCountsMultiple(identifiers)
      .subscribe((trainingCounts: { [type: string]: number }) => {
        searchResults.result.forEach(content => {
          if (trainingCounts[content.identifier]) {
            content.trainingLHubCount = trainingCounts[content.identifier]
          }
        })
      },         noop)
  }

  getJITEligibleContent(query: string): Observable<NsContent.IContent[]> {
    const locale = (this.configSvc.activeLocale && this.configSvc.activeLocale.locals[0]) || 'en'

    return this.contentSvc
      .search({
        query,
        filters: {
          contentType: [NsContent.EContentTypes.COURSE],
        },
        pageNo: 0,
        pageSize: 5,
        instanceCatalog: true,
        locale: [locale],
      })
      .pipe(
        catchError(() => []),
        map((searchResult: NSSearch.ISearchApiResult) =>
          searchResult.result.filter(content => this.isValidTrainingContent(content)),
        ),
      )
  }

  isValidTrainingContent(content: NsContent.IContent): boolean {
    try {
      if (content.contentType === NsContent.EContentTypes.COURSE && !content.isExternal) {
        return true
      }

      return false
    } catch (e) {
      return false
    }
  }
}
