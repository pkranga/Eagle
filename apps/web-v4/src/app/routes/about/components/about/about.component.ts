/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { RoutingService } from '../../../../services/routing.service';
import {
  DomSanitizer,
  SafeResourceUrl,
  SafeStyle
} from '@angular/platform-browser';
import { ConfigService } from '../../../../services/config.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {
  isClient = this.configSvc.instanceConfig.features.client.enabled;
  platformBanner: SafeStyle = this.domSanitizer.bypassSecurityTrustStyle(
    `url('${this.configSvc.instanceConfig.platform.platformBanner}')`
  );
  isSmallScreen$ = this.breakpointObserver
    .observe(Breakpoints.XSmall)
    .pipe(map(breakPointState => breakPointState.matches));

  videoLink: SafeResourceUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(
    'https://www.youtube.com/embed/fsK0WSDqWqY?rel=0&showinfo=0&enablejsapi=1&modestbranding=1&color=0&autohide=1&controls=2&playsinline=1'
  );
  constructor(
    private breakpointObserver: BreakpointObserver,
    private domSanitizer: DomSanitizer,
    public routingSvc: RoutingService,
    private configSvc: ConfigService
  ) {}
}
