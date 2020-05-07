/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, Input } from '@angular/core'
import { IWsSearchConfig } from '../../models/ocm.model'

@Component({
  selector: 'ws-app-search-results-strip',
  templateUrl: './search-results-strip.component.html',
  styleUrls: ['./search-results-strip.component.scss'],
})
export class SearchResultsStripComponent implements OnInit {
  @Input() config: IWsSearchConfig | null = null
  errorMessageCode: 'API_FAILURE' | 'NO_DATA' | 'NONE' = 'NONE'

  constructor() {}

  ngOnInit() {}
  handleNoContent(event: any) {
    if (event === 'none') {
      this.errorMessageCode = 'NO_DATA'
    } else if (event === 'error') {
      this.errorMessageCode = 'API_FAILURE'
    } else {
      this.errorMessageCode = 'NONE'
    }
  }
}
