/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input } from '@angular/core';
import { ConfigService } from '../../../../services/config.service';

@Component({
  selector: 'app-infy-foundation',
  templateUrl: './infy-foundation-pathfinders.component.html',
  styleUrls: ['./infy-foundation-pathfinders.component.scss']
})
export class InfyFoundationPathfindersComponent implements OnInit {

  @Input() cardType: 'basic' | 'advanced' = 'advanced';

  pathfinders = this.configSvc.instanceConfig.features.home.config.pathfinders || null;

  constructor(private configSvc: ConfigService) { }

  ngOnInit() { }

}
