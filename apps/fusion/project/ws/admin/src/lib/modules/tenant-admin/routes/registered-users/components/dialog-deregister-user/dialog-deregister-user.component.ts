/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit } from '@angular/core'
import { MatDialogRef } from '@angular/material/dialog'

@Component({
  selector: 'ws-admin-dialog-deregister-user',
  templateUrl: './dialog-deregister-user.component.html',
  styleUrls: ['./dialog-deregister-user.component.scss'],
})
export class DialogDeregisterUserComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogDeregisterUserComponent>,
  ) { }

  close(sure = false): void {
    this.dialogRef.close(sure)
  }

  ngOnInit() {
  }

}
