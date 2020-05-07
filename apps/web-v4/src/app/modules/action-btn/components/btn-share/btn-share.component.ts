/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input } from '@angular/core';
import { IContent } from '../../../../models/content.model';
import { MatDialog } from '@angular/material';
import { ShareDialogComponent } from '../share-dialog/share-dialog.component';
import { UtilityService } from '../../../../services/utility.service';
import { ConfigService } from '../../../../services/config.service';

@Component({
  selector: 'app-btn-share',
  templateUrl: './btn-share.component.html',
  styleUrls: ['./btn-share.component.scss']
})
export class BtnShareComponent implements OnInit {
  @Input()
  content: IContent;

  constructor(
    private dialog: MatDialog,
    private utilSvc: UtilityService,
    private configSvc: ConfigService
  ) {}

  ngOnInit() {}
  openShareDialog(event: Event) {
    if (event && event.stopPropagation) {
      event.stopPropagation();
    }
    if (!this.configSvc.instanceConfig.features.btnShare.available) {
      this.utilSvc.featureUnavailable();
      return;
    }
    this.dialog.open<ShareDialogComponent, { content: IContent }>(
      ShareDialogComponent,
      {
        data: { content: this.content }
      }
    );
  }
}
