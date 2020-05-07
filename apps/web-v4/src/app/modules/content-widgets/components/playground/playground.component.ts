/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input } from '@angular/core';
import { ConfigService } from '../../../../services/config.service';

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss']
})
export class PlaygroundComponent implements OnInit {
  @Input() cardType: 'basic' | 'advanced' = 'advanced';
  playgroundSearchRequest = {
    ...this.configSvc.instanceConfig.features.home.config.homePlayground
  };
  constructor(private configSvc: ConfigService) { }

  ngOnInit() { }
}
