/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { ConfigService } from "../../../../services/config.service";
import { RoutingService } from "../../../../services/routing.service";
import { ActivatedRoute } from "@angular/router";
import { Input } from "@angular/core";
import { IInstanceConfigBanner, IInstanceConfigContentStrip, IBannerWithContentStripsData } from "../../../../models/instanceConfig.model";
import { deepCopy } from "../../../../utils/deepCopy";

@Component({
  selector: 'ws-banner-with-content-strip',
  templateUrl: './banner-with-content-strip.component.html',
  styleUrls: ['./banner-with-content-strip.component.scss']
})
export class BannerWithContentStripComponent implements OnInit {
  @Input() pageTitle: string;
  @Input() bannerConfig: IInstanceConfigBanner;
  @Input() strips: IInstanceConfigContentStrip[];
  constructor(private route: ActivatedRoute, public routingSvc: RoutingService, private configSvc: ConfigService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      let config: IBannerWithContentStripsData = null;
      if (data && data.bannerWithContentStripData) {
        config = data.bannerWithContentStripData as IBannerWithContentStripsData;
      } else if (data && data.configKey && this.configSvc.instanceConfig.features[data.configKey]) {
        config = this.configSvc.instanceConfig.features[data.configKey].config as IBannerWithContentStripsData;
      }
      if (config) {
        this.bannerConfig = null;
        this.strips = null;
        if (config.title) {
          this.pageTitle = config.title;
        }
        if (config.banner) {
          this.bannerConfig = deepCopy(config.banner);
        }
        if (config.strips) {
          this.strips = deepCopy(config.strips);
        }
      }
    });
  }
}

