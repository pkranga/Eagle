/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RoutingService } from '../../../../services/routing.service';
import { ConfigService } from '../../../../services/config.service';
import { MatTabChangeEvent } from '@angular/material';

@Component({
  selector: 'app-marketing',
  templateUrl: './marketing.component.html',
  styleUrls: ['./marketing.component.scss']
})
export class MarketingComponent implements OnInit {
  public marketingFeature = this.configSvc.instanceConfig.features.marketing;
  clientStoriesDataHash = {
    agileDigital: true,
    aiCore: true,
    onLearning: true
  };
  brandAssetsDataHash = {
    corporate: true,
    insights: true,
    employer: true
  };
  stripsHash = [
    {
      accelerate: true,
      assure: true,
      experience: true,
      innovate: true,
      insight: true
    },
    {
      corporate: true,
      employer: true
    },
    {
      agileDigital: true,
      aiCore: true,
      onLearning: true
    }
  ];
  tabKeys = [
    'brandAssets',
    'experience',
    'hubs',
    'clientStories',
    'services',
    'industries',
    'productSubsidiary'
  ].filter(u => this.marketingFeature.subFeatures[u]);
  selectedIndex: number;
  featureStatus = this.marketingFeature.subFeatures;
  brandSearchRequests = this.marketingFeature.config.brandAssets;
  clientStoriesRequests = this.marketingFeature.config.clientStories;
  currentTab: string;

  constructor(
    private route: ActivatedRoute,
    public routingSvc: RoutingService,
    private router: Router,
    private configSvc: ConfigService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.currentTab = params.type;
      this.selectedIndex = this.tabKeys.indexOf(this.currentTab);
      if (this.selectedIndex === -1) {
        this.selectedIndex = 0;
        this.currentTab = this.tabKeys[0];
      }
    });
  }

  navigate(event: MatTabChangeEvent) {
    this.currentTab = this.tabKeys[event.index];
    this.router.navigateByUrl('/marketing/' + this.currentTab);
  }

  handleNoContent(event: string, stripName: string) {
    if (event === 'none') {
      if (this.currentTab === 'brandAssets') {
        this.brandAssetsDataHash[stripName] = false;
      }
      if (this.currentTab === 'clientStories') {
        this.clientStoriesDataHash[stripName] = false;
      }
    }
  }
}
