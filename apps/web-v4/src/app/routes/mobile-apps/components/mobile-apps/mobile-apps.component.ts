/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';

import { RoutingService } from '../../../../services/routing.service';
import { ValuesService } from '../../../../services/values.service';
import { ConfigService } from '../../../../services/config.service';
import { ActivatedRoute } from '@angular/router';
import { MiscService } from '../../../../services/misc.service';

interface IMobileAppLink {
  android: string;
  androidMirror?: string;
  ios: string;
  iosSanitized: SafeUrl;
}

@Component({
  selector: 'app-mobile-apps',
  templateUrl: './mobile-apps.component.html',
  styleUrls: ['./mobile-apps.component.scss']
})
export class MobileAppsComponent implements OnInit {
  selectedTabIndex = this.valuesSvc.isIos ? 1 : 0;
  mobileLinks: IMobileAppLink;
  isAndroidPlayStoreLink = false;
  isClient = this.configSvc.instanceConfig.features.client.available;
  mobilePlatformCode = this.configSvc.instanceConfig.platform.mobilePlatformCode;
  isAppOutdated = false;
  constructor(
    private sanitizer: DomSanitizer,
    public routingSvc: RoutingService,
    public valuesSvc: ValuesService,
    private configSvc: ConfigService,
    private route: ActivatedRoute,
    private miscSvc: MiscService
  ) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe(qParamMap => {
      const outdated = qParamMap.get('outdated');
      if (outdated === 'android') {
        this.selectedTabIndex = 0;
        this.isAppOutdated = true;
        this.miscSvc.navBarDisplaySubject.next(false);
      } else if (outdated === 'ios') {
        this.selectedTabIndex = 1;
        this.isAppOutdated = true;
        this.miscSvc.navBarDisplaySubject.next(false);
      }
    });
    this.mobileLinks = {
      android: this.configSvc.instanceConfig.externalLinks.appsAndroid,
      androidMirror: this.configSvc.instanceConfig.externalLinks.appsAndroidMirror,
      ios: this.configSvc.instanceConfig.externalLinks.appsIos,
      iosSanitized: this.sanitizer.bypassSecurityTrustUrl(this.configSvc.instanceConfig.externalLinks.appsIos)
    };
    if (this.mobileLinks && this.mobileLinks.android && this.mobileLinks.android.includes('google')) {
      this.isAndroidPlayStoreLink = true;
    }
  }
}
