/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, Input } from '@angular/core'
import { IWsProgramsConfig, IWsPrograms } from '../../models/ocm.model'

import { NsWidgetResolver } from '@ws-widget/resolver'

import { NSSearch } from '@ws-widget/collection'

@Component({
  selector: 'ws-app-sentient-programs',
  templateUrl: './sentient-programs.component.html',
  styleUrls: ['./sentient-programs.component.scss'],
})
export class SentientProgramsComponent implements OnInit {
  @Input() config: IWsProgramsConfig = {
    title: '',
    programsList: [],
  }
  widgetSearchRequest: NsWidgetResolver.IRenderConfigWithTypedData<
    NSSearch.ISearchRequest
  > | null = null
  heading = ''
  selected = false
  errorMessageCode: 'API_FAILURE' | 'NO_DATA' | 'NONE' = 'NONE'
  constructor() {}

  ngOnInit() {
    if (this.config && this.config.programsList && this.config.programsList.length) {
      this.trackClicked(this.config.programsList[0])
    }
  }
  handleNoContent(event: any) {
    if (event === 'none') {
      this.errorMessageCode = 'NO_DATA'
    } else if (event === 'error') {
      this.errorMessageCode = 'API_FAILURE'
    }
  }

  trackClicked(program: IWsPrograms) {
    this.errorMessageCode = 'NONE'
    this.widgetSearchRequest = program.widgetSearchQuery
    this.heading = program.title
  }
}
