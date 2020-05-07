/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResolveResponse } from '../../../../models/routeResolver.model';
import { ITnc, ITncFetch } from '../../../../models/user.model';
import { AuthService } from '../../../../services/auth.service';
import { RoutingService } from '../../../../services/routing.service';
import { TelemetryService } from '../../../../services/telemetry.service';
import { TncService } from '../../../../services/tnc.service';
import logger from '../../../../utils/logger';

@Component({
  selector: 'app-tnc',
  templateUrl: './tnc.component.html',
  styleUrls: ['./tnc.component.scss']
})
export class TncComponent implements OnInit {
  isLoggedIn = this.authSvc.isLoggedIn$;
  hasAcceptedTnc = this.tncSvc.userHasAcceptedTnc;

  generalTnc: ITnc = null;
  dpTnc: ITnc = null;

  // UI Vars
  currentPanel: 'tnc' | 'dp' = 'tnc';

  isAcceptInProgress = false;
  errorInFetching = false;
  errorInAccepting = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authSvc: AuthService,
    private tncSvc: TncService,
    public routingSvc: RoutingService,
    public telemetrySvc: TelemetryService
  ) {}

  ngOnInit() {
    const tncResponse: ResolveResponse<ITncFetch> = this.route.snapshot.data.tnc;
    if (!tncResponse.error) {
      tncResponse.data.termsAndConditions.forEach(tnc => {
        if (tnc.name === 'Generic T&C') {
          this.generalTnc = tnc;
        } else {
          this.dpTnc = tnc;
        }
      });
      if (!tncResponse.data.isAccepted) {
        if (!this.generalTnc.isAccepted) {
          this.currentPanel = 'tnc';
        } else if (this.generalTnc.isAccepted && !this.dpTnc.isAccepted) {
          this.currentPanel = 'dp';
        }
      }
    } else {
      logger.error('ERROR FETCHING TNC >', tncResponse.error);
      this.errorInFetching = true;
    }
  }

  acceptTnc() {
    this.isAcceptInProgress = true;
    this.tncSvc
      .acceptTnc({
        termsAccepted: [
          { docName: this.generalTnc.name, version: this.generalTnc.version },
          {
            docName: this.dpTnc.name,
            version: this.dpTnc.version
          }
        ]
      })
      .subscribe(
        result => {
          if (result && result.response !== 'FAILED') {
            this.telemetrySvc.tncTelemetryEvent(true);
            this.router.navigate(['interest'], {
              queryParams: { mode: 'setup' }
            });
          } else {
            this.errorInAccepting = true;
            this.telemetrySvc.tncTelemetryEvent(false);
          }
          this.isAcceptInProgress = false;
        },
        err => {
          this.errorInAccepting = true;
          this.telemetrySvc.tncTelemetryEvent(false);
          this.isAcceptInProgress = false;
        }
      );
  }

  logout() {
    this.authSvc.logout();
  }
}
