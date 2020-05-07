/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit } from '@angular/core'
import { MatDialogRef } from '@angular/material'
@Component({
  selector: 'ws-app-cohorts-miniprofile',
  templateUrl: './cohorts-miniprofile.component.html',
  styleUrls: ['./cohorts-miniprofile.component.scss'],
})
export class CohortsMiniprofileComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<CohortsMiniprofileComponent>,
  ) { }

  ngOnInit() {
  }
  onNoClick(): void {
    this.dialogRef.close()
  }
}
