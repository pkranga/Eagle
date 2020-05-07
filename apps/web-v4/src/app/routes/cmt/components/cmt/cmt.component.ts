/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTabChangeEvent } from '@angular/material';

import { IInstanceConfigBannerUnit } from '../../../../models/instanceConfig.model';
import { RoutingService } from '../../../../services/routing.service';
import { ConfigService } from '../../../../services/config.service';
import { ISearchRequest } from '../../../../models/searchResponse.model';

@Component({
  selector: 'ws-cmt',
  templateUrl: './cmt.component.html',
  styleUrls: ['./cmt.component.scss']
})
export class CmtComponent implements OnInit {
  breakpoint: number;
  dataUnavailableCountHash: { [key: string]: number } = {};
  banners = this.configSvc.instanceConfig.features.cmt.config.banner.bannersList;
  cmtTabs = this.configSvc.instanceConfig.features.cmt.config.tabs;
  selectedIndex = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public routingSvc: RoutingService,
    private configSvc: ConfigService
  ) {
    this.cmtTabs.forEach(tab => {
      this.dataUnavailableCountHash[tab.urlKey] = 0;
    });
  }

  ngOnInit() {
    // this.breakpoint = (window.innerWidth <= 425) ? 1 : 5;
    this.route.params.subscribe(params => {
      const selectedType = params.type;
      let flagFound = false;
      this.cmtTabs.forEach((tab, index) => {
        if (tab.urlKey === selectedType) {
          // adding 1 here because 'table  of content' tab is absent in received tabs data
          this.selectedIndex = index + 1;;
          flagFound = true;
          return;
        }
      });
      if (!flagFound) {
        this.selectedIndex = 0;
      }
    });
  }
  navigate(event: MatTabChangeEvent) {
    if (event.index !== 0) {
      this.dataUnavailableCountHash[this.cmtTabs[event.index - 1].urlKey] = 0;
      this.router.navigateByUrl('/cmt/' + this.cmtTabs[event.index - 1].urlKey);
    } else {
      this.router.navigateByUrl('/cmt/about');
    }
  }
  handleNoContent(event: string, tabUrlKey: string) {
    if (event === 'none' || event === 'error') {
      this.dataUnavailableCountHash[tabUrlKey] += 1;
    }
  }
  navigateBanner(banner: IInstanceConfigBannerUnit) {
    if (banner.openInNewTab) {
      window.open(banner.url);
    } else {
      this.router.navigateByUrl(banner.url);
    }
  }
  // onResize(event) {
  //   if (event.target.innerWidth <= 800 && event.target.innerWidth > 750) {
  //     this.breakpoint = 4;
  //     console.log("below 800", this.breakpoint)
  //   }
  //   else if (event.target.innerWidth <= 750 && event.target.innerWidth > 400) {
  //     this.breakpoint = 3;
  //     console.log("below 600", this.breakpoint)
  //   }
  //   else if (event.target.innerWidth <= 425) {
  //     this.breakpoint = 1;
  //     console.log("below 400", this.breakpoint)
  //   }
  // }
}
