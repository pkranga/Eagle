/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';

export class UtilMethods {
  emailId: string;

  constructor(private authSvc: AuthService, private userSvc: UserService) {}

  public getAuthHeaders() {
    if (this.authSvc.userEmail.endsWith('EMAIL')) {
      this.userSvc.fetchUserGraphProfile().subscribe(data => {
        this.emailId = data.onPremisesUserPrincipalName.split('@')[0];
      });
    }
    return {
      headers: {
        email_id: localStorage.getItem(this.emailId)
      }
    };
  }
}
