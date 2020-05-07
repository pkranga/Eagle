/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { RoutingService } from '../../../../services/routing.service';
import { ActivatedRoute } from '@angular/router';
import { ISearchRequest } from '../../../../models/searchResponse.model';

@Component({
  selector: 'app-offering',
  templateUrl: './offering.component.html',
  styleUrls: ['./offering.component.scss']
})
export class OfferingComponent implements OnInit {

  pageTitle: string;
  filters: any;
  tags: string;
  searchRequests: ISearchRequest[];

  PENTAGON = ['Accelerate', 'Assure', 'Insight', 'Innovate', 'Experience'];
  RESOURCE_CATEGORY = ['Prepare', 'Engage', 'Leave Behind'];

  constructor(
    public routingSvc: RoutingService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params.f) {
        this.filters = JSON.parse(params.f);
      }
      this.tags = params.tags;

      if (this.filters) {
        this.pageTitle =
          (this.filters.subSubTracks && this.filters.subSubTracks[0] !== '')
            ? this.filters.subSubTracks[0] : this.filters.subTracks[0];
      }

      if (this.tags) {
        this.pageTitle = this.tags.split('/')[this.tags.split('/').length - 1];
      }
      this.createSearchRequests();
    });
  }

  createSearchRequests() {
    this.searchRequests = this.RESOURCE_CATEGORY.map(category => ({
      sortBy: 'lastUpdatedOn',
      pageNo: 0,
      filters: {
        tags: this.filters ? this.createPentagonTags(this.filters.subSubTracks) : [this.tags],
        resourceCategory: [category],
        contentType: ['Resource']
      }
    }));
  }

  createPentagonTags(subSubTrack) {
    return this.PENTAGON.map(track => `Pentagon/${track}/${subSubTrack}`);
  }

}
