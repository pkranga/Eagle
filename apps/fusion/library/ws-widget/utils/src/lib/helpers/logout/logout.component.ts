/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component } from '@angular/core'
import { MatDialogRef } from '@angular/material'
import { AuthKeycloakService } from '../../services/auth-keycloak.service'

@Component({
  selector: 'ws-utils-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
})
export class LogoutComponent {

  disabled = false
  constructor(
    public dialogRef: MatDialogRef<LogoutComponent>,
    private authSvc: AuthKeycloakService,
  ) { }

  confirmed() {
    this.disabled = true
    this.authSvc.logout()
  }

}
