/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, Inject, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA } from '@angular/material'

@Component({
  selector: 'ws-app-no-access-dialog',
  templateUrl: './no-access-dialog.component.html',
  styleUrls: ['./no-access-dialog.component.scss'],
})
export class NoAccessDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      type: string,
    },
  ) { }

  ngOnInit() {
  }

}
