/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import {
  Component,
  OnInit,
  Inject,
  TemplateRef,
  ViewChild,
  EmbeddedViewRef
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatSnackBar,
  MatSnackBarRef
} from '@angular/material';

import { TelemetryService } from '../../../../services/telemetry.service';

export interface ICallDialogComponentData {
  contentId: string;
  name: string;
  phone: string;
}

@Component({
  selector: 'app-call-dialog',
  templateUrl: './call-dialog.component.html',
  styleUrls: ['./call-dialog.component.scss']
})
export class CallDialogComponent implements OnInit {
  @ViewChild('toastSuccess', { static: true }) toastSuccess: TemplateRef<any>;

  constructor(
    public snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: ICallDialogComponentData,
    private telemetrySvc: TelemetryService
  ) {}

  ngOnInit() {}

  copyToClipboard(successMsg) {
    const textArea = document.createElement('textarea');
    textArea.value = this.data.phone;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    this.snackBar.open(`${this.data.phone} : ${successMsg}`);
  }

  fireCallTelemetry() {
    this.telemetrySvc.callTelemetryEvent(
      this.data.contentId,
      this.data.phone
    );
  }
}
