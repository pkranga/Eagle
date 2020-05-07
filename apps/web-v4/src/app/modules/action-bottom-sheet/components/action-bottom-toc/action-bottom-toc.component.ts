/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input } from '@angular/core';
import { MatBottomSheet } from '@angular/material';
import { TocSheetComponent } from '../toc-sheet/toc-sheet.component';
import { ValuesService } from '../../../../services/values.service';
import { ConfigService } from '../../../../services/config.service';
@Component({
  selector: 'app-action-bottom-toc',
  templateUrl: './action-bottom-toc.component.html',
  styleUrls: ['./action-bottom-toc.component.scss']
})
export class ActionBottomTocComponent implements OnInit {
  @Input() contentId: string;
  @Input() contentName: string;
  tocSubFeatures = this.confgiSvc.instanceConfig.features.toc.subFeatures;
  constructor(
    private bottomSheet: MatBottomSheet,
    private valueSvc: ValuesService,
    private confgiSvc: ConfigService
  ) { }

  isLtMedium$ = this.valueSvc.isLtMedium$;
  ngOnInit() { }

  openBottomSheet() {
    this.bottomSheet.open(TocSheetComponent, {
      data: {
        id: this.contentId,
        name: this.contentName
      }
    });
  }
}
