/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, Input, OnInit } from '@angular/core'
import { NsWidgetResolver, WidgetBaseComponent } from '@ws-widget/resolver'
import { NsContent } from '../_services/widget-content.model'
import { MatDialog } from '@angular/material'
import { BtnMailUserDialogComponent } from './btn-mail-user-dialog/btn-mail-user-dialog.component'
import { EventService } from '@ws-widget/utils'

export interface IBtnMailUser {
  content: NsContent.IContent
  emails: string[]
  labelled?: boolean
}

@Component({
  selector: 'ws-widget-btn-mail-user',
  templateUrl: './btn-mail-user.component.html',
  styleUrls: ['./btn-mail-user.component.scss'],
})
export class BtnMailUserComponent extends WidgetBaseComponent
  implements OnInit, NsWidgetResolver.IWidgetData<IBtnMailUser> {
  @Input() widgetData!: IBtnMailUser

  constructor(
    private events: EventService,
    private dialog: MatDialog,
  ) {
    super()
  }

  ngOnInit() { }

  openQueryMailDialog(event: Event) {
    event.stopPropagation()
    this.raiseTelemetry()
    this.dialog.open<BtnMailUserDialogComponent, IBtnMailUser>(
      BtnMailUserDialogComponent,
      {
        data: this.widgetData,
      },
    )
  }

  raiseTelemetry() {
    this.events.raiseInteractTelemetry(
      'email',
      'openDialog',
      {
        contentId: this.widgetData.content.identifier,
        emails: this.widgetData.emails,
      },
    )
  }

}
