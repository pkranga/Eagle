/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, Input, OnInit } from '@angular/core'
import { NsContent } from '@ws-widget/collection'
import { NsCohorts } from '../../models/app-toc.model'
import { AppTocService } from '../../services/app-toc.service'

@Component({
  selector: 'ws-app-toc-cohorts',
  templateUrl: './app-toc-cohorts.component.html',
  styleUrls: ['./app-toc-cohorts.component.scss'],
})
export class AppTocCohortsComponent implements OnInit {
  constructor(
    private tocSvc: AppTocService,
  ) { }

  @Input() content!: NsContent.IContent
  cohortResults: { [key: string]: { hasError: boolean, contents: NsCohorts.ICohortsContent[] } } = {}
  cohortTypesEnum = NsCohorts.ECohortTypes

  ngOnInit() { }
  fetchCohorts(cohortType: NsCohorts.ECohortTypes) {
    if (!this.cohortResults[cohortType]) {
      this.tocSvc.fetchContentCohorts(cohortType, this.content.identifier)
        .subscribe(
          data => {
            this.cohortResults[cohortType] = {
              contents: data || [],
              hasError: false,
            }
          },
          () => {
            this.cohortResults[cohortType] = {
              contents: [],
              hasError: true,
            }
          },
      )
    }
  }

}
