/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, Input, OnInit } from '@angular/core'
import { NsWidgetResolver, WidgetBaseComponent } from '@ws-widget/resolver'
import { NsGoal } from './btn-goals.model'
import { NsContent } from '../_services/widget-content.model'
import { MatDialog } from '@angular/material'
import { BtnGoalsDialogComponent } from './btn-goals-dialog/btn-goals-dialog.component'

const VALID_CONTENT_TYPES: NsContent.EContentTypes[] = [
  NsContent.EContentTypes.MODULE,
  NsContent.EContentTypes.KNOWLEDGE_ARTIFACT,
  NsContent.EContentTypes.COURSE,
  NsContent.EContentTypes.PROGRAM,
  NsContent.EContentTypes.RESOURCE,
]

@Component({
  selector: 'ws-widget-btn-goals',
  templateUrl: './btn-goals.component.html',
  styleUrls: ['./btn-goals.component.scss'],
})
export class BtnGoalsComponent extends WidgetBaseComponent
  implements OnInit, NsWidgetResolver.IWidgetData<NsGoal.IBtnGoal> {
  @Input() widgetData!: NsGoal.IBtnGoal

  isValidContent = false

  constructor(private dialog: MatDialog) {
    super()
  }

  ngOnInit() {
    if (
      this.widgetData &&
      this.widgetData.contentType &&
      VALID_CONTENT_TYPES.includes(this.widgetData.contentType)
    ) {
      this.isValidContent = true
    }
  }

  openDialog() {
    this.dialog.open(BtnGoalsDialogComponent, {
      width: '600px',
      data: {
        contentId: this.widgetData.contentId,
        contentName: this.widgetData.contentName,
      },
    })
  }
}
