/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, Input, OnInit } from '@angular/core'
import { NsWidgetResolver, WidgetBaseComponent } from '@ws-widget/resolver'
import { MatDialog } from '@angular/material'
import {
  BtnCallDialogComponent,
  IWidgetBtnCallDialogData,
} from './btn-call-dialog/btn-call-dialog.component'
import { EventService } from '@ws-widget/utils'

export interface IWidgetBtnCall {
  userName: string
  userPhone: string
  replaceIconWithLabel?: boolean
}
@Component({
  selector: 'ws-widget-btn-call',
  templateUrl: './btn-call.component.html',
  styleUrls: ['./btn-call.component.scss'],
})
export class BtnCallComponent extends WidgetBaseComponent
  implements OnInit, NsWidgetResolver.IWidgetData<IWidgetBtnCall> {
  @Input() widgetData!: IWidgetBtnCall

  constructor(private events: EventService, private dialog: MatDialog) {
    super()
  }

  ngOnInit() { }

  showCallDialog() {
    this.raiseTelemetry()
    this.dialog.open<BtnCallDialogComponent, IWidgetBtnCallDialogData>(BtnCallDialogComponent, {
      data: {
        name: this.widgetData.userName,
        phone: this.widgetData.userPhone,
      },
    })
  }

  raiseTelemetry() {
    this.events.raiseInteractTelemetry(
      'call',
      'openDialog',
      {
        name: this.widgetData.userName,
        phone: this.widgetData.userPhone,
      },
    )
  }
}
