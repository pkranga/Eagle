/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTabChangeEvent } from '@angular/material';

import { IInstanceConfigBannerUnit } from '../../../../models/instanceConfig.model';
import { RoutingService } from '../../../../services/routing.service';
import { ConfigService } from '../../../../services/config.service';

@Component({
  selector: 'app-iki-home',
  templateUrl: './iki-home.component.html',
  styleUrls: ['./iki-home.component.scss']
})
export class IkiHomeComponent implements OnInit {
  dataUnavailableCountHash: { [key: string]: number } = {};
  banners = this.configSvc.instanceConfig.features.iki.config.banner.bannersList;
  ikiTabs = this.configSvc.instanceConfig.features.iki.config.tabs;
  selectedIndex = 0;

  constructor(private route: ActivatedRoute, private router: Router, public routingSvc: RoutingService, private configSvc: ConfigService) {
    this.ikiTabs.forEach(tab => {
      this.dataUnavailableCountHash[tab.urlKey] = 0;
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const selectedType = params.type;
      let flagFound = false;
      this.ikiTabs.forEach((tab, index) => {
        if (tab.urlKey === selectedType) {
          // adding 1 here because 'about us' tab is absent in received tabs data
          this.selectedIndex = index + 1;
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
      this.dataUnavailableCountHash[this.ikiTabs[event.index - 1].urlKey] = 0;
      this.router.navigateByUrl('/iki/' + this.ikiTabs[event.index - 1].urlKey);
    } else {
      this.router.navigateByUrl('/iki/about-us');
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
}
