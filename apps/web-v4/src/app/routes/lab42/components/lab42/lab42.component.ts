/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { RoutingService } from '../../../../services/routing.service';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { ConfigService } from '../../../../services/config.service';

@Component({
  selector: 'ws-lab42',
  templateUrl: './lab42.component.html',
  styleUrls: ['./lab42.component.scss']
})
export class Lab42Component implements OnInit {
  lab42Url: SafeResourceUrl;
  constructor(public routingSvc: RoutingService, private sanitizer: DomSanitizer, private configSvc: ConfigService) { }

  ngOnInit() {
    this.lab42Url = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.configSvc.instanceConfig.features.lab42.config.url
    );
  }
}
