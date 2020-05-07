/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { RoutingService } from '../../../../services/routing.service';
import { PluginVideoService } from '../../../../services/plugin-video.service';
import { TelemetryService } from '../../../../services/telemetry.service';
import { ConfigService } from '../../../../services/config.service';

@Component({
  selector: 'app-from-leaders',
  templateUrl: './from-leaders.component.html',
  styleUrls: ['./from-leaders.component.scss']
})
export class FromLeadersComponent implements OnInit, OnDestroy {
  @ViewChild('leaderElement', { static: true }) leaderElementRef: ElementRef<HTMLDivElement>;
  constructor(
    public routingSvc: RoutingService,
    private videoSvc: PluginVideoService,
    private telemetrySvc: TelemetryService,
    private configSvc: ConfigService
  ) {}

  leaderHtmlId = 'amp_plugin_leader';
  leaderConfig = this.configSvc.instanceConfig.features.fromLeaders.config;
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
      this.leaderHtmlId,
      this.leaderConfig.url,
      undefined,
      undefined,
      this.leaderConfig.posterImage,
      this.leaderConfig.identifier,
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
