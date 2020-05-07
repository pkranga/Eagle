/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material';
import { ConfigService } from '../../../../services/config.service';
@Component({
  selector: 'app-toc-sheet',
  templateUrl: './toc-sheet.component.html',
  styleUrls: ['./toc-sheet.component.scss']
})
export class TocSheetComponent implements OnInit {
  tocSubFeatures = this.configSvc.instanceConfig.features.toc.subFeatures;
  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private bottomSheetRef: MatBottomSheetRef<TocSheetComponent>,
    private configSvc: ConfigService
  ) { }

  ngOnInit() { }

  closeBottomSheet(): void {
    this.bottomSheetRef.dismiss();
  }
}
