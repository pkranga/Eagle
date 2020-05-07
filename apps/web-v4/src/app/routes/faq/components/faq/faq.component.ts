/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { RoutingService } from '../../../../services/routing.service';
import { ValuesService } from '../../../../services/values.service';
import { ConfigService } from '../../../../services/config.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit, OnDestroy {
  errorMessageCode: 'API_FAILURE' | 'NO_DATA' | 'INVALID_DATA';
  sideNavBarOpened = true;
  isLtMedium$ = this.valueSvc.isLtMedium$;
  private defaultSideNavBarOpenedSubscription;
  mode$ = this.isLtMedium$.pipe(map(isMedium => (isMedium ? 'over' : 'side')));
  screenSizeIsLtMedium: boolean;
  currentTab: string;
  faqFeature = this.configSvc.instanceConfig.features.faq.enabled;
  tabs = [
    'login',
    'odcAccess',
    'compatibility',
    'installation',
    'progressCompletion',
    'video',
    'post-learn',
    'authoring'
  ];
  paramSubscription: Subscription;
  constructor(
    private route: ActivatedRoute,
    public routingSvc: RoutingService,
    private valueSvc: ValuesService,
    private configSvc: ConfigService
  ) {}
  ngOnInit() {
    this.defaultSideNavBarOpenedSubscription = this.isLtMedium$.subscribe(
      isLtMedium => {
        this.sideNavBarOpened = !isLtMedium;
        this.screenSizeIsLtMedium = isLtMedium;
      }
    );
    this.paramSubscription = this.route.paramMap.subscribe(params => {
      let tab = params.get('tab');
      if (this.tabs.indexOf(tab) === -1) {
        tab = 'login';
      }
      this.currentTab = tab;
    });
  }

  ngOnDestroy() {
    if (this.defaultSideNavBarOpenedSubscription) {
      this.defaultSideNavBarOpenedSubscription.unsubscribe();
    }
  }

  sideNavOnClick() {
    if (this.screenSizeIsLtMedium) {
      this.sideNavBarOpened = !this.sideNavBarOpened;
    }
  }
}
