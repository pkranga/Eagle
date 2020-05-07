/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { IContent } from '../../../../models/content.model';

import { CommunicationsService } from '../../../../services/communications.service';
import { RoutingService } from '../../../../services/routing.service';
import { ConfigService } from '../../../../services/config.service';

@Component({
  selector: 'app-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss']
})
export class RadioComponent implements OnInit {
  showLoader = false;
  stripCount = 0;
  errorOccurred = false;
  infyRadioResults: { [title: string]: IContent[] } = {};
  infyRadioConfig = this.configSvc.instanceConfig.features.infyRadio.config;
  banner = this.infyRadioConfig.banner.bannersList[0].img;

  constructor(
    private communicationSvc: CommunicationsService,
    public routingSvc: RoutingService,
    private configSvc: ConfigService
  ) {}

  ngOnInit() {
    this.showLoader = true;
    for (let i = 0; i < this.infyRadioConfig.stripsName.length; i++) {
      this.communicationSvc
        .getInfyRadioContent(this.infyRadioConfig.stripsName[i])
        .subscribe(
          data => {
            this.infyRadioResults[this.infyRadioConfig.stripsName[i]] = data;
            this.checkLoader();
          },
          err => {
            this.checkLoader();
          }
        );
    }
  }

  checkLoader() {
    this.stripCount++;
    if (this.stripCount === this.infyRadioConfig.stripsName.length) {
      this.showLoader = false;
    }
  }
}
