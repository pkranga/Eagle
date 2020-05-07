/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import {
  CallDialogComponent,
  ICallDialogComponentData
} from '../call-dialog/call-dialog.component';
import { UtilityService } from '../../../../services/utility.service';
import { ConfigService } from '../../../../services/config.service';

@Component({
  selector: 'app-btn-call',
  templateUrl: './btn-call.component.html',
  styleUrls: ['./btn-call.component.scss']
})
export class BtnCallComponent implements OnInit {
  @Input()
  userName: string;
  @Input()
  userPhone: string;
  @Input()
  contentId: string;
  @Input()
  labelled?: boolean;

  constructor(
    private dialog: MatDialog,
    private utilSvc: UtilityService,
    private configSvc: ConfigService
  ) {}

  ngOnInit() {}

  showCallDialog(event: Event) {
    if (event && event.stopPropagation) {
      event.stopPropagation();
    }
    if (!this.configSvc.instanceConfig.features.btnCall.available) {
      this.utilSvc.featureUnavailable();
      return;
    }
    this.dialog.open<CallDialogComponent, ICallDialogComponentData>(
      CallDialogComponent,
      {
        data: {
          contentId: this.contentId,
          name: this.userName,
          phone: this.userPhone
        }
      }
    );
  }
}
