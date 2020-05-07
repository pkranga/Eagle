/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ContentFeedbackDialogComponent } from '../content-feedback-dialog/content-feedback-dialog.component';
import { UtilityService } from '../../../../services/utility.service';
import { ConfigService } from '../../../../services/config.service';
@Component({
  selector: 'app-btn-content-feedback',
  templateUrl: './btn-content-feedback.component.html',
  styleUrls: ['./btn-content-feedback.component.scss']
})
export class BtnContentFeedbackComponent implements OnInit {
  @Input() contentId: string;
  @Input() contentName: string;

  constructor(
    private dialog: MatDialog,
    private utilSvc: UtilityService,
    private configSvc: ConfigService
  ) {}

  ngOnInit() {}

  openFeedbackDialog(event: Event) {
    if (event && event.stopPropagation) {
      event.stopPropagation();
    }
    if (!this.configSvc.instanceConfig.features.btnContentFeedback.available) {
      this.utilSvc.featureUnavailable();
      return;
    }
    this.dialog.open(ContentFeedbackDialogComponent, {
      data: {
        id: this.contentId,
        name: this.contentName
      }
    });
  }
}
