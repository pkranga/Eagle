/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavigatorService } from '../../../../services/navigator.service';
import { RoutingService } from '../../../../services/routing.service';
import { ConfigService } from '../../../../services/config.service';
import { ContentService } from '../../../../services/content.service';

type dpnViewMode = 'level1' | 'level2';
@Component({
  selector: 'app-delivery-partner',
  templateUrl: './delivery-partner.component.html',
  styleUrls: ['./delivery-partner.component.scss']
})
export class DeliveryPartnerComponent implements OnInit {
  level2Id: string;
  level2Strips: any;
  viewMode: dpnViewMode;
  banner = this.configSvc.instanceConfig.features.navigator.config.deliveryPartnerNavigatorBanner.bannersList[0].img;
  bannerText: string;
  bannerDescription: string;
  dpnData: any;
  contentStripHash = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private navSvc: NavigatorService,
    public routingSvc: RoutingService,
    private configSvc: ConfigService,
    private contentSvc: ContentService
  ) { }

  ngOnInit() {
    this.level2Id = this.route.snapshot.params.id;
    if (this.level2Id) {
      this.viewMode = 'level2';
    } else {
      this.viewMode = 'level1';
      this.bannerText = 'Delivery Partner Navigator';
      this.bannerDescription = 'Be an effective Delivery Partner';
    }
    this.navSvc.dpn.subscribe(data => {
      this.dpnData = data;
      if (this.viewMode === 'level2') {
        const level1Item = this.dpnData.dpn.level1.find(item => item.id === this.level2Id);
        this.bannerText = level1Item.title;
        this.bannerDescription = level1Item.description;
        this.dpnData.dpn.contentStrips
          .filter(strip => strip.linked_id === this.level2Id)
          .forEach(strip => {
            this.contentSvc
              .fetchMultipleContent(strip.programs)
              .subscribe(content => (this.contentStripHash[strip.title] = content.filter(item => Boolean(item))));
          });
      }
    });
  }

  cardClicked(card) {
    this.router.navigateByUrl('/navigator/dpn/' + card);
  }
}
