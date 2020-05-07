/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IInstanceConfigBannerUnit } from '../../../../models/instanceConfig.model';
import { FetchStatus } from '../../../../models/status.model';
import { MiscService } from '../../../../services/misc.service';
import { UtilityService } from '../../../../services/utility.service';
import { ConfigService } from '../../../../services/config.service';
import { EUserRoles } from '../../../../constants/enums.constant';
import { Subscription } from 'rxjs';
import { ValuesService } from '../../../../services/values.service';
import { AuthService } from '../../../../services/auth.service';



@Component({
  selector: 'ws-s-home',
  templateUrl: './s-home.component.html',
  styleUrls: ['./s-home.component.scss']
})
export class SHomeComponent implements OnInit {

  homeSubFeatures = this.configSvc.instanceConfig.features.home.subFeatures;
  siemensHomeBanners: IInstanceConfigBannerUnit[];
  bannersFetchStatus: FetchStatus;
  ROLES = EUserRoles;
  isSmall = false;
  userName: string;
  userEmail: string;
  private screenSizeSubscription: Subscription;

  constructor(
    private miscSvc: MiscService,
    private configSvc: ConfigService,
    private valuesSvc: ValuesService,
    private router: Router,
    private util: UtilityService,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.userEmail = this.auth.userEmail;
    this.userName = this.auth.userName;
    this.fetchSiemensHomeBanners();
    this.monitorScreenSize();
  }

  ngOnDestroy() {
    if (this.screenSizeSubscription) {
      this.screenSizeSubscription.unsubscribe();
    }
  }


  private fetchSiemensHomeBanners() {
    this.bannersFetchStatus = 'fetching';
    this.miscSvc.fetchSiemensHomeBanners().subscribe(
      banners => {
        if (banners && Array.isArray(banners) && banners.length) {
          this.siemensHomeBanners = banners;
        } else {
          this.siemensHomeBanners = [
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
        this.siemensHomeBanners = [
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
    this.screenSizeSubscription = this.valuesSvc.isXSmall$.subscribe(
      isXSmall => {
        if (isXSmall) {
          this.isSmall = true;
        } else {
          this.isSmall = false;
        }
      }
    );
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
