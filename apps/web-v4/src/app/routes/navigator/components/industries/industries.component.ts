/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { NavigatorService } from '../../../../services/navigator.service';
import { RoutingService } from '../../../../services/routing.service';
import { ContentService } from '../../../../services/content.service';
import { AccessControlService } from '../../../../services/access-control.service';
import { EUserRoles } from '../../../../constants/enums.constant';

@Component({
  selector: 'app-industries',
  templateUrl: './industries.component.html',
  styleUrls: ['./industries.component.scss']
})
export class IndustriesComponent implements OnInit {
  ROLES = EUserRoles;
  tabs: string[] = [];
  selectedType: string;
  displayTypes: string[] = ['Mega Trends', 'Digital Pentagon'];
  selectedTrend: string;
  dummyTrends: string[] = ['Trend 1', 'Trend 2', 'Trend 3'];
  enablePrev = false;
  enableNext = false;
  industriesData: any;
  subDomains = {};

  contentStripsHash = {
    narratives: [],
    clientStories: [],
    techSkills: [],
    reference: [],
    megatrends: []
  };

  subDomainMapping: any;

  selectedTab = 'CME';
  selectedTabRoute = 'CME';
  selectedPillar = 'Accelerate';
  selectedTheme: string;
  selectedSubDomain = 'Banking';
  fetchingData: boolean;
  fetchingContentData: boolean;

  private scrollObserver: Subscription;

  constructor(
    private navSvc: NavigatorService,
    private changeDetectRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    public routingSvc: RoutingService,
    private router: Router,
    private contentSvc: ContentService
  ) { }

  ngOnInit() {
    this.fetchingData = true;
    this.selectedType = this.displayTypes[1];
    this.selectedTrend = this.dummyTrends[0];
    this.navSvc.ind.subscribe(indData => {
      this.fetchingData = false;
      this.industriesData = indData;
      // console.log('inddata ', this.industriesData);
      this.tabs = Object.keys(this.industriesData);
      // this.selectedTheme = this.industriesData[this.selectedTab][
      //   this.selectedPillar
      // ][0]["themeName"];
      // console.log("industry data ", indData);
      this.route.params.subscribe(params => {
        this.selectedTabRoute = params.tab ? params.tab : 'CME';
        this.selectedTab = params.tab ? params.tab.split('-').join(' ') : 'CME';
        this.selectedSubDomain = Object.keys(this.industriesData[this.selectedTab])[0];
        if (
          this.industriesData[this.selectedTab] &&
          this.industriesData[this.selectedTab][this.selectedSubDomain] &&
          this.industriesData[this.selectedTab][this.selectedSubDomain][this.selectedPillar] &&
          this.industriesData[this.selectedTab][this.selectedSubDomain][this.selectedPillar].length
        ) {
          this.selectedTheme = this.industriesData[this.selectedTab][this.selectedSubDomain][
            this.selectedPillar
          ][0].themeName;
        }
        this.selectedType = this.displayTypes[1];
        this.selectedTrend = this.dummyTrends[0];
        // this.selectFirstTheme();
        this.selectMegaTrend();
        this.updateContent();
      });
    });
  }

  fetchSubDomains() {
    if (this.industriesData) {
      const subDomains = Object.keys(this.industriesData[this.selectedTab]);
      const idx = Object.keys(this.industriesData[this.selectedTab]).indexOf('hasData');
      if (idx > -1) {
        subDomains.splice(idx, 1);
      }

      return subDomains;
    }
    return [];
  }

  subDomainClicked(subDomain) {
    this.selectedSubDomain = subDomain;
    if (
      this.industriesData[this.selectedTab][this.selectedSubDomain][this.selectedPillar] &&
      this.industriesData[this.selectedTab][this.selectedSubDomain][this.selectedPillar].length
    ) {
      this.selectedTheme = this.industriesData[this.selectedTab][this.selectedSubDomain][
        this.selectedPillar
      ][0].themeName;
    }
    this.selectMegaTrend();
    this.updateContent();
  }

  trackClicked(track) {
    this.selectedPillar = track;
    if (
      this.industriesData[this.selectedTab][this.selectedSubDomain][this.selectedPillar] &&
      this.industriesData[this.selectedTab][this.selectedSubDomain][this.selectedPillar].length
    ) {
      this.selectedTheme = this.industriesData[this.selectedTab][this.selectedSubDomain][
        this.selectedPillar
      ][0].themeName;
    }
    this.updateContent();
    // this.selectedTheme = dummyData[this.selectedTab][track][0]["themeName"];
  }

  getStrip(stripName: string) {
    if (!this.selectedTheme) {
      return [];
    }

    let result = [];
    try {
      result = this.industriesData[this.selectedTab][this.selectedSubDomain][this.selectedPillar].filter(
        u => u.themeName === this.selectedTheme
      )[0][stripName];
    } catch (e) { }
    return result;
  }

  updateContent() {
    this.fetchingContentData = true;
    this.contentStripsHash = {
      narratives: [],
      clientStories: [],
      techSkills: [],
      reference: [],
      megatrends: []
    };
    this.updateContentStrip('narratives');
    this.updateContentStrip('clientStories');
    this.updateContentStrip('techSkills');
    this.updateContentStrip('reference');
  }

  megaTrendModeClicked() {
    this.selectedType = this.displayTypes[0];
    this.selectMegaTrend();
  }

  selectMegaTrend() {
    try {
      this.updateMegaTrends(this.industriesData[this.selectedTab][this.selectedSubDomain].megatrends[0]);
    } catch (e) {
      // console.log(e);
    }
  }

  updateMegaTrends(trend) {
    this.selectedTrend = trend.trendName;
    this.contentSvc.fetchMultipleContent(trend.content).subscribe(data => {
      this.fetchingContentData = false;
      this.contentStripsHash.megatrends = data.filter(item => Boolean(item));
    });
  }

  updateContentStrip(stripName: string) {
    this.contentSvc
      .fetchMultipleContent((this.getStrip(stripName).slice(0, 20) || []).map(item => item.identifier))
      .subscribe(data => {
        this.fetchingContentData = false;
        this.contentStripsHash[stripName] = data.filter(item => Boolean(item));
      });
  }

  getStripMeta(stripName: string) {
    return {
      ctitle: stripName
    };
  }

  knowMoreClicked(lpItem) {
    this.router.navigateByUrl(lpItem.url);
  }

  roleClicked(role: string) {
    this.selectedTheme = role;
    this.updateContent();
  }

  getSelectedIndex() {
    return this.tabs.indexOf(this.selectedTab);
  }

  navigate(event) {
    this.router.navigateByUrl('/navigator/industries/' + event.tab.textLabel.split(' ').join('-'));
  }
}
