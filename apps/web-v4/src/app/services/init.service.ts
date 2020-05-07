/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { ConfigService } from './config.service';
import { TncService } from './tnc.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class InitService {
  constructor(
    private authSvc: AuthService,
    private configSvc: ConfigService,
    private tncSvc: TncService,
    private userSvc: UserService
  ) { }
  async init() {
    const preLoginConfig = await this.configSvc.updatePreLoginConfig();
    const instanceConfigPromise = this.configSvc.updateInstanceConfig();
    const authenticated = await this.authSvc.initAuth(preLoginConfig);
    if (!authenticated) {
      await instanceConfigPromise;
      return;
    }
    const tncPromise = this.tncSvc.fetchMyTnc();
    const otherRequestBeforeAppInitialization = [this.userSvc.updateUserRoles(), this.userSvc.updateUserPref()];
    const tnc = await tncPromise;
    if (tnc && tnc.isAccepted) {
      await Promise.all(otherRequestBeforeAppInitialization);
    }
    await instanceConfigPromise;
    return true;
  }
}
