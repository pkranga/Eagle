/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, Input } from '@angular/core'
import { WidgetBaseComponent, NsWidgetResolver } from '@ws-widget/resolver'
import { MatDialog } from '@angular/material'
import { IWidgetBtnContentFeedbackV2 } from '@ws-widget/collection'
import { BtnContentFeedbackDialogV2Component } from '../btn-content-feedback-dialog-v2/btn-content-feedback-dialog-v2.component'

@Component({
  selector: 'ws-widget-btn-content-feedback-v2',
  templateUrl: './btn-content-feedback-v2.component.html',
  styleUrls: ['./btn-content-feedback-v2.component.scss'],
})
export class BtnContentFeedbackV2Component extends WidgetBaseComponent
  implements NsWidgetResolver.IWidgetData<IWidgetBtnContentFeedbackV2> {
  @Input() widgetData!: IWidgetBtnContentFeedbackV2

  constructor(private dialog: MatDialog) {
    super()
  }

  openFeedbackDialog() {
    this.dialog.open<BtnContentFeedbackDialogV2Component, IWidgetBtnContentFeedbackV2>(
      BtnContentFeedbackDialogV2Component,
      { data: this.widgetData, minWidth: '320px', width: '500px' },
    )
  }
}
