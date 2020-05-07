/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { ICertification } from '../../../../models/certification.model';

import { CertificationService } from '../../../../services/certification.service';
import { RoutingService } from '../../../../services/routing.service';
import { ConfigService } from '../../../../services/config.service';

@Component({
  selector: 'app-certification',
  templateUrl: './certification.component.html',
  styleUrls: ['./certification.component.scss']
})
export class CertificationComponent implements OnInit {
  banner = this.configSvc.instanceConfig.features.certifications.config.banner
    .bannersList[0].img;
  showLoader = false;
  errorOccurred = false;
  certificationResults: ICertification;
  constructor(
    private certificationSvc: CertificationService,
    public routingSvc: RoutingService,
    private configSvc: ConfigService
  ) {}

  ngOnInit() {
    this.showLoader = true;
    this.certificationSvc.fetchCertifications().subscribe(
      data => {
        this.certificationResults = data;
        this.showLoader = false;
      },
      err => {
        this.errorOccurred = true;
        this.showLoader = false;
      }
    );
  }
}
