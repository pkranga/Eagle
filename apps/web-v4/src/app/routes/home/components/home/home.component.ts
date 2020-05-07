/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { FetchStatus } from '../../../../models/status.model';
import { EUserRoles } from '../../../../constants/enums.constant';
import { IInstanceConfigBannerUnit } from '../../../../models/instanceConfig.model';

import { RoutingService } from '../../../../services/routing.service';
import { ValuesService } from '../../../../services/values.service';
import { MiscService } from '../../../../services/misc.service';
import { UtilityService } from '../../../../services/utility.service';
import { ConfigService } from '../../../../services/config.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  showBannerNavigation = this.configSvc.instanceConfig.features.home.config.bannerConfig.showBannerNavigation;
  homeSubFeatures = this.configSvc.instanceConfig.features.home.subFeatures;
  homeBanners: IInstanceConfigBannerUnit[];
  bannersFetchStatus: FetchStatus;
  ROLES = EUserRoles;
  isSmall = false;
  showDownTimeMessage = false;
  downtimeConfig = this.configSvc.instanceConfig.features.downtime.config;
  private screenSizeSubscription: Subscription;
  constructor(
    private util: UtilityService,
    private router: Router,
    public routingSvc: RoutingService,
    private valuesSvc: ValuesService,
    private miscSvc: MiscService,
    private configSvc: ConfigService
  ) { }

  ngOnInit() {
    this.fetchHomeBanners();
    this.monitorScreenSize();
    this.checkDownTime();
  }

  ngOnDestroy() {
    if (this.screenSizeSubscription) {
      this.screenSizeSubscription.unsubscribe();
    }
  }

  private fetchHomeBanners() {
    this.bannersFetchStatus = 'fetching';
    this.miscSvc.fetchHomeBanners().subscribe(
      banners => {
        if (banners && Array.isArray(banners) && banners.length) {
          this.homeBanners = banners;
        } else {
          this.homeBanners = [
            {
              img: {
                xs: '/public-assets/common/misc/default-home-banner/375.jpg',
                s: '/public-assets/common/misc/default-home-banner/414.jpg',
                m: '/public-assets/common/misc/default-home-banner/768.jpg',
                l: '/public-assets/common/misc/default-home-banner/1024.jpg',
                xl: '/public-assets/common/misc/default-home-banner/retina.jpg'
              },
              title: '',
              url: '/'
            }
          ];
        }
        this.bannersFetchStatus = 'done';
      },
      err => {
        this.homeBanners = [
          {
            img: {
              xs: '/public-assets/common/misc/default-home-banner/375.jpg',
              s: '/public-assets/common/misc/default-home-banner/414.jpg',
              m: '/public-assets/common/misc/default-home-banner/768.jpg',
              l: '/public-assets/common/misc/default-home-banner/1024.jpg',
              xl: '/public-assets/common/misc/default-home-banner/retina.jpg'
            },
            title: '',
            url: '/'
          }
        ];
        this.bannersFetchStatus = 'done';
      }
    );
  }

  private monitorScreenSize() {
    this.screenSizeSubscription = this.valuesSvc.isXSmall$.subscribe(isXSmall => {
      if (isXSmall) {
        this.isSmall = true;
      } else {
        this.isSmall = false;
      }
    });
  }

  private checkDownTime() {
    const localStorageKey = this.downtimeConfig.localStorageKey;
    if (this.configSvc.instanceConfig.features.downtime.enabled) {
      if (this.downtimeConfig.enableLocalStorage && localStorage.getItem(localStorageKey) !== 'yes') {
        localStorage.setItem(localStorageKey, 'yes');
        this.showDownTimeMessage = true;
      } else if (!this.downtimeConfig.enableLocalStorage) {
        this.showDownTimeMessage = true;
      }
    }
  }

  navigate(banner: IInstanceConfigBannerUnit) {
    if (banner.openInNewTab) {
      window.open(banner.url);
    } else {
      this.router.navigateByUrl(banner.url);
    }
  }

  navigateTo(url: string) {
    this.router.navigateByUrl(url);
  }

  openFeatureUnavailableDialog() {
    this.util.featureUnavailable();
  }

  checkIfFeatureAvailable(feature: string, navigateUrl: string) {
    if (
      Object.keys(this.configSvc.instanceConfig.features).includes(feature) &&
      this.configSvc.instanceConfig.features[feature].available
    ) {
      this.navigateTo(navigateUrl);
    } else {
      this.openFeatureUnavailableDialog();
    }
  }
}
