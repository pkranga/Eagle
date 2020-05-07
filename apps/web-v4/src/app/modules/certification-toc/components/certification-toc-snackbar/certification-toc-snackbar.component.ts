/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material';

@Component({
  selector: 'ws-certification-toc-snackbar',
  templateUrl: './certification-toc-snackbar.component.html',
  styleUrls: ['./certification-toc-snackbar.component.scss']
})
export class CertificationTocSnackbarComponent implements OnInit {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA)
    public snackbarData: {
      action: string;
      code: string;
    }
  ) {}

  ngOnInit() {}
}
