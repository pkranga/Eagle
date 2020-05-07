/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavigatorService } from '../../../../services/navigator.service';
import { RoutingService } from '../../../../services/routing.service';
import { FormControl } from '@angular/forms';
import { ContentService } from '../../../../services/content.service';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.scss']
})
export class ExploreComponent implements OnInit {
  lpdata: any;
  learningPaths: any[] = [];
  searchedLearningPaths: any[];
  loadInProgress: boolean;
  searchInProgress: boolean;
  thumbnailFetchStatus = 'hasMore';
  pageNumber = 0;
  pageSize = 10;
  thumbnailsHash: { [lpId: string]: string } = {};
  queryControl = new FormControl('');

  constructor(
    public routingSvc: RoutingService,
    private router: Router,
    private contentSvc: ContentService,
    private navSvc: NavigatorService
  ) {}

  ngOnInit() {
    this.loadInProgress = true;
    this.navSvc.lp.subscribe(lpdata => {
      // console.log(lpdata);
      this.loadInProgress = false;
      this.lpdata = lpdata;
      // console.log(Object.keys(lpdata).length);
      // console.log(this.learningPaths);
    });

    this.queryControl.valueChanges.subscribe(query => {
      if (!query) {
        this.searchedLearningPaths = [];
      } else {
        this.searchLearningPath(query);
      }
    });
  }

  loadNext() {
    if (this.lpdata) {
      const currentBatch = Object.keys(this.lpdata).slice(
        this.pageNumber * this.pageSize,
        (this.pageNumber + 1) * this.pageSize
      );
      this.pageNumber += 1;
      if (this.pageNumber * this.pageNumber >= Object.keys(this.lpdata).length) {
        this.thumbnailFetchStatus = 'done';
      }
      this.contentSvc
        .fetchMultipleContent(currentBatch.map(data => this.lpdata[data].linked_program))
        .subscribe(metas => {
          metas
            .filter(item => item !== null)
            .forEach(item => {
              this.thumbnailsHash[item.identifier] = item.appIcon;
            });
        });
      this.learningPaths = this.learningPaths.concat(
        currentBatch.map(lpId => {
          return {
            lpId: this.lpdata[lpId].lp_id,
            title: this.lpdata[lpId].lp_name,
            description: this.lpdata[lpId].lp_description
          };
        })
      );
      console.log(this.learningPaths);
    }
  }

  knowMoreClicked(event) {
    // console.log(event);
    this.router.navigateByUrl('/navigator/lp/' + event + '?showProfile=true');
  }

  searchLearningPath(event) {
    this.searchInProgress = true;
    this.navSvc.lp.subscribe(lpdata => {
      this.searchInProgress = false;
      this.lpdata = lpdata;
      this.searchedLearningPaths = Object.keys(lpdata)
        .map(lpId => {
          return {
            lpId: this.lpdata[lpId].lp_id,
            title: this.lpdata[lpId].lp_name,
            description: this.lpdata[lpId].lp_description
          };
        })
        .filter(item => item.title.toLowerCase().includes(event.toLowerCase()));
    });
  }
}
