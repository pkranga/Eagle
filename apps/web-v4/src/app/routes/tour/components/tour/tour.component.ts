/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { RoutingService } from '../../../../services/routing.service';
import { PluginVideoService } from '../../../../services/plugin-video.service';
import { TelemetryService } from '../../../../services/telemetry.service';
import { ConfigService } from '../../../../services/config.service';

@Component({
  selector: 'app-tour',
  templateUrl: './tour.component.html',
  styleUrls: ['./tour.component.scss']
})
export class TourComponent implements OnInit, OnDestroy {
  @ViewChild('tourElement', { static: true }) tourElementRef: ElementRef<HTMLDivElement>;
  constructor(
    public routingSvc: RoutingService,
    private videoSvc: PluginVideoService,
    private telemetrySvc: TelemetryService,
    private configSvc: ConfigService
  ) {}

  tourHtmlId = 'amp_plugin_tour';
  tourConfig = this.configSvc.instanceConfig.features.quickTour.config;
  private player: amp.Player;

  ngOnInit() {
    this.loadPlayer();
  }

  ngOnDestroy() {
    this.telemetrySvc.lastEvent = null;
    this.disposePlayer();
  }

  async loadPlayer() {
    this.disposePlayer();
    const start = 0;
    this.player = await this.videoSvc.init(
      this.tourHtmlId,
      this.tourConfig.url,
      undefined,
      undefined,
      this.tourConfig.posterImage,
      this.tourConfig.identifier,
      null,
      undefined,
      undefined,
      start,
      [],
      {},
      {
        autoplay: true,
        enableContinueLearning: false
      }
    );
  }

  private disposePlayer() {
    if (this.player && typeof this.player.dispose === 'function') {
      this.player.dispose();
    }
  }
}
