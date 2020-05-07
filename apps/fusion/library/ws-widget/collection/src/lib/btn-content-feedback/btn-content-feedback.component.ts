/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, Input, OnInit } from '@angular/core'
import { NsWidgetResolver, WidgetBaseComponent } from '@ws-widget/resolver'
import { MatDialog } from '@angular/material'
import { BtnContentFeedbackDialogComponent } from './btn-content-feedback-dialog/btn-content-feedback-dialog.component'

interface IWidgetBtnContentFeedback {
  identifier: string
  name: string
}

@Component({
  selector: 'ws-widget-btn-content-feedback',
  templateUrl: './btn-content-feedback.component.html',
  styleUrls: ['./btn-content-feedback.component.scss'],
})
export class BtnContentFeedbackComponent extends WidgetBaseComponent
  implements OnInit, NsWidgetResolver.IWidgetData<IWidgetBtnContentFeedback> {
  @Input() widgetData!: IWidgetBtnContentFeedback
  constructor(private dialog: MatDialog) {
    super()
  }

  ngOnInit() {}

  openFeedbackDialog() {
    this.dialog.open(BtnContentFeedbackDialogComponent, {
      data: {
        id: this.widgetData.identifier,
        name: this.widgetData.name,
      },
    })
  }
}
