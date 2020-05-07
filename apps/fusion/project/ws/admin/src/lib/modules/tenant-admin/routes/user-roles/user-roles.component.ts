/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { ModifyRolesDialogComponent } from './components/modify-roles-dialog/modify-roles-dialog.component'

@Component({
  selector: 'ws-admin-user-roles',
  templateUrl: './user-roles.component.html',
  styleUrls: ['./user-roles.component.scss'],
})
export class UserRolesComponent implements OnInit {

  userList: any[] = []
  constructor(
    public modifyRolesDialog: MatDialog,
  ) { }

  openDialog(user: any): void {
    const dialogRef = this.modifyRolesDialog.open(ModifyRolesDialogComponent, {
      height: '400px',
      width: '600px',
      data: { user },
    })

    dialogRef.afterClosed().subscribe((_result: any) => {
    })
  }

  getUserList(list: any[]) {
    this.userList = JSON.parse(JSON.stringify(list))
  }

  ngOnInit() {
  }

}
