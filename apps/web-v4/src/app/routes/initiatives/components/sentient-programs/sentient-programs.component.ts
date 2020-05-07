/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input } from '@angular/core';
import { ISearchRequest } from '../../../../models/searchResponse.model';
import { ISentientProgram } from '../../../../models/initiatives';
import { IProgramsConfig } from '../../../../models/wingspan-pages.model';

@Component({
  selector: 'app-sentient-programs',
  templateUrl: './sentient-programs.component.html',
  styleUrls: ['./sentient-programs.component.scss']
})
export class SentientProgramsComponent implements OnInit {
  @Input() config: IProgramsConfig;
  searchRequest: ISearchRequest;
  heading: string;
  selected: boolean;
  errorMessageCode: 'API_FAILURE' | 'NO_DATA';

  constructor() { }

  ngOnInit() {
    if (this.config && this.config.programsList && this.config.programsList.length) {
      this.trackClicked(this.config.programsList[0]);
    }
  }

  handleNoContent(event: any) {
    if (event === 'none') {
      this.errorMessageCode = 'NO_DATA';
    } else if (event === 'error') {
      this.errorMessageCode = 'API_FAILURE';
    }
  }

  trackClicked(program) {
    this.errorMessageCode = null;
    this.searchRequest = program.searchQuery;
    this.heading = program.title;
  }
}
