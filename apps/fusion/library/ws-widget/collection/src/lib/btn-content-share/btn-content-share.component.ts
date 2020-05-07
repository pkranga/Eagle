/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, Input, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material'
import { NsWidgetResolver, WidgetBaseComponent } from '@ws-widget/resolver'
import { NsContent } from '../_services/widget-content.model'
import { BtnContentShareDialogComponent } from './btn-content-share-dialog/btn-content-share-dialog.component'

@Component({
  selector: 'ws-widget-btn-content-share',
  templateUrl: './btn-content-share.component.html',
  styleUrls: ['./btn-content-share.component.scss'],
})
export class BtnContentShareComponent extends WidgetBaseComponent
  implements OnInit, NsWidgetResolver.IWidgetData<NsContent.IContent> {
  @Input() widgetData!: NsContent.IContent
  @Input() isDisabled = false
  @Input() showText = false

  constructor(
    private dialog: MatDialog,
  ) {
    super()
  }

  ngOnInit() { }

  shareContent() {
    this.dialog.open<BtnContentShareDialogComponent, { content: NsContent.IContent }>(
      BtnContentShareDialogComponent,
      {
        data: { content: this.widgetData },
      },
    )
  }
}
