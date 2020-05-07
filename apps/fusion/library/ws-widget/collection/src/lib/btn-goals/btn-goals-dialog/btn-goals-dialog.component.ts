/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, Inject } from '@angular/core'
import { TFetchStatus } from '../../../../../utils/src/public-api'
import { NsGoal } from '../btn-goals.model'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'

@Component({
  selector: 'ws-widget-btn-goals-dialog',
  templateUrl: './btn-goals-dialog.component.html',
  styleUrls: ['./btn-goals-dialog.component.scss'],
})
export class BtnGoalsDialogComponent implements OnInit {
  fetchGoals: TFetchStatus = 'none'
  goals: NsGoal.IUserGoals | null = null

  constructor(
    public dialogRef: MatDialogRef<BtnGoalsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit() {}
}
