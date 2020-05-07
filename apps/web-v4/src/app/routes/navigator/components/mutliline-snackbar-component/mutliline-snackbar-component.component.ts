/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material';

@Component({
  selector: 'app-mutliline-snackbar-component',
  templateUrl: './mutliline-snackbar-component.component.html',
  styleUrls: ['./mutliline-snackbar-component.component.scss']
})
export class MutlilineSnackbarComponentComponent implements OnInit {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public snackbarLines: any[]) {}

  ngOnInit() {}
}
