/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'ws-go-back-dialog',
  templateUrl: './go-back-dialog.component.html',
  styleUrls: ['./go-back-dialog.component.scss']
})
export class GoBackDialogComponent implements OnInit {
  constructor(private dialogRef: MatDialogRef<GoBackDialogComponent>) {}

  ngOnInit() {}
}
