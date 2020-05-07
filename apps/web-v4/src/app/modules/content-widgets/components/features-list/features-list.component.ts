/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { AccessControlService } from '../../../../services/access-control.service';
import { ConfigService } from '../../../../services/config.service';
import { EUserRoles } from '../../../../constants/enums.constant';

@Component({
  selector: 'app-features-list',
  templateUrl: './features-list.component.html',
  styleUrls: ['./features-list.component.scss']
})
export class FeaturesListComponent implements OnInit {
  showFeatures = true;
  appName = this.configSvc.instanceConfig.platform.appName;
  userRoles = new Set<string>();
  ROLES = EUserRoles;

  constructor(
    private accessControlSvc: AccessControlService,
    private configSvc: ConfigService
  ) {}

  ngOnInit() {
    if (
      sessionStorage.getItem('showFeatures') &&
      sessionStorage.getItem('showFeatures') === 'no'
    ) {
      this.showFeatures = false;
    }

    this.getUserRoles();
  }

  hideFeatures() {
    this.showFeatures = false;
    sessionStorage.setItem('showFeatures', 'no');
  }

  private getUserRoles() {
    this.accessControlSvc.getUserRoles().subscribe(data => {
      this.userRoles = data;
    });
  }
}
