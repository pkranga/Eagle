/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { RoutingService } from '../../../../services/routing.service';

@Component({
  selector: 'app-success-stories',
  templateUrl: './success-stories.component.html',
  styleUrls: ['./success-stories.component.scss']
})
export class SuccessStoriesComponent implements OnInit {
  successStoriesSearchRequest = {
    sortBy: 'lastUpdatedOn',
    sortOrder: 'DESC',
    filters: {
      tags: ['Sales/Sales Navigator/Success Stories']
    },
    pageNo: 0,
    query: ''
  };

  constructor(public routingSvc: RoutingService) {}

  ngOnInit() {}
}
