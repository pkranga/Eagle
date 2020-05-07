/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';

import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigatorService } from '../../../../services/navigator.service';
import { ContentService } from '../../../../services/content.service';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {
  tabs: string[] = [];
  fetchingContentData: boolean;
  contentStripsHash = {};
  accountsData: any;
  contentStrips = [
    {
      id: 'overview',
      title: 'Overview'
    },
    {
      id: 'gtm',
      title: 'Case Study'
    },
    {
      id: 'tech',
      title: 'Technology'
    }
  ];
  selectedTab: string;
  selectedAccount: string;
  selectedPortfolio: string;
  selectedPillar = 'Experience';
  selectedTheme: string;

  private scrollObserver: Subscription;
  private routeSubcription: Subscription;

  constructor(
    private changeDetectRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private navSvc: NavigatorService,
    private contentSvc: ContentService
  ) { }

  ngOnInit() {
    this.navSvc.ac.subscribe(data => {
      this.accountsData = data;
      this.tabs = Object.keys(data).sort();
      this.routeSubcription = this.route.params.subscribe(params => {
        this.selectedTab = params.tab.toLocaleLowerCase() || 'communications';
        this.updateData();
      });
    });
  }

  updateData() {
    this.fetchingContentData = true;
    this.selectedAccount = this.fetchAccounts()[0];
    this.selectedPortfolio = this.fetchPortfolios()[0];
    this.selectedTheme = this.fetchThemes()[0];
    this.contentStrips.forEach(strip => {
      this.updateContentStrip(strip.id);
    });
  }

  getStripMeta(stripName: string) {
    return {
      ctitle: stripName
    };
  }

  updateContentStrip(stripId) {
    this.contentStripsHash[stripId] = [];
    try {
      const contentIds = (
        this.accountsData[this.selectedTab][this.selectedAccount][this.selectedPortfolio][this.selectedPillar][
          this.selectedTheme
        ][stripId].slice(0, 20) || []
      ).map(item => item.identifier);
      this.contentSvc.fetchMultipleContent(contentIds).subscribe(data => {
        this.fetchingContentData = false;
        this.contentStripsHash[stripId] = data.filter(item => Boolean(item));
      });
    } catch (e) {
      return [];
    }
  }

  knowMoreClicked(lpItem) {
    this.router.navigateByUrl(lpItem.url);
  }

  tabClicked(tab) {
    this.selectedTab = tab;
  }

  fetchAccounts() {
    try {
      return Object.keys(this.accountsData[this.selectedTab]);
    } catch (e) {
      return [];
    }
  }

  fetchPortfolios() {
    try {
      return Object.keys(this.accountsData[this.selectedTab][this.selectedAccount]);
    } catch (e) {
      return [];
    }
  }

  fetchThemes() {
    try {
      return Object.keys(
        this.accountsData[this.selectedTab][this.selectedAccount][this.selectedPortfolio][this.selectedPillar]
      );
    } catch (e) {
      return [];
    }
  }

  accountClicked(account) {
    this.selectedAccount = account;
    this.selectedPortfolio = this.fetchPortfolios()[0];
    this.selectedTheme = this.fetchThemes()[0];
    this.contentStrips.forEach(strip => {
      this.updateContentStrip(strip.id);
    });
  }

  portfolioClicked(portfolio) {
    this.selectedPortfolio = portfolio;
    this.selectedTheme = this.fetchThemes()[0];
    this.contentStrips.forEach(strip => {
      this.updateContentStrip(strip.id);
    });
  }

  pillarClicked(pillar) {
    this.selectedPillar = pillar;
    this.selectedTheme = this.fetchThemes()[0];
    this.contentStrips.forEach(strip => {
      this.updateContentStrip(strip.id);
    });
  }

  themeClicked(theme) {
    this.selectedTheme = theme;
    this.contentStrips.forEach(strip => {
      this.updateContentStrip(strip.id);
    });
  }

  isObjectEmpty(obj) {
    if (!obj) {
      return true;
    }

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  }

  getSelectedIndex() {
    return this.tabs.indexOf(this.selectedTab);
  }

  navigate(event) {
    this.router.navigateByUrl('/navigator/accounts/' + event.tab.textLabel.toLocaleLowerCase());
  }

  caps(str: string) {
    return str.toLocaleUpperCase();
  }
}
