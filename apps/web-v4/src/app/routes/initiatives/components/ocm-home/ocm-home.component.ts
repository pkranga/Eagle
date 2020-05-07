/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IContent } from '../../../../models/content.model';
import { RoutingService } from '../../../../services/routing.service';
import { ContentService } from '../../../../services/content.service';
import { ConfigService } from '../../../../services/config.service';
import { UtilityService } from '../../../../services/utility.service';
import { ValuesService } from '../../../../services/values.service';
@Component({
  selector: 'app-ocm-home',
  templateUrl: './ocm-home.component.html',
  styleUrls: ['./ocm-home.component.scss']
})
export class OcmHomeComponent implements OnInit, OnDestroy {
  pageTitle = this.configSvc.instanceConfig.features.navigateChange.config.pageTitle;
  banners = this.configSvc.instanceConfig.features.navigateChange.config.banner.bannersList;
  infyTvLatestRequest = {
    ...this.configSvc.instanceConfig.features.infyTv.config.strips[1]
  };
  ocmRequestData: any;
  ocmSubFeaturesStatus = this.configSvc.instanceConfig.features.navigateChange.subFeatures;
  // visionContentsIds = [
  //   'lex_auth_012602584559599616485',
  //   'lex_auth_01254872455026278488',
  //   'lex_auth_01254874564973363299'
  // ];
  // visionContents: IContent[];
  // changeContentIds = [
  //   'lex_auth_01254874363006976095',
  //   'lex_auth_01254873806547353693',
  //   'lex_auth_01272703521542963272'
  // ];
  // changeContents: IContent[];
  constructor(
    public routingSvc: RoutingService,
    private contentSvc: ContentService,
    private configSvc: ConfigService,
    private valueSvc: ValuesService,
    private utilitySvc: UtilityService
  ) { }

  ngOnInit() {
    if (!this.configSvc.instanceConfig.features.siemens.enabled) {
      this.valueSvc.setPageTheme('purple-theme');
    }
    this.utilitySvc
      .getDataFromUrl(this.configSvc.instanceConfig.features.navigateChange.config.jsonPaths.ocmJsonPath)
      .subscribe(data => {
        this.ocmRequestData = data;
      });

    // this.contentSvc.fetchMultipleContent(this.visionContentsIds).subscribe((content: IContent[]) => {
    //   const contentHash = {};
    //   content.forEach(element => (contentHash[element.identifier] = element));
    //   this.visionContents = this.visionContentsIds.map(identifier => contentHash[identifier]);
    // });
    // this.contentSvc.fetchMultipleContent(this.changeContentIds).subscribe((content: IContent[]) => {
    //   const contentHash = {};
    //   content.forEach(element => (contentHash[element.identifier] = element));
    //   this.changeContents = this.changeContentIds.map(identifier => contentHash[identifier]);
    // });
  }

  ngOnDestroy() {
    this.valueSvc.resetPageTheme();
  }
}
