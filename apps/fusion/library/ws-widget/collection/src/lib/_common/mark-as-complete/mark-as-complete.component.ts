/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, Input } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component'
import { NsContent } from '../../_services/widget-content.model'
import { IReqMarkAsComplete } from './mark-as-complete.model'
import { AppTocService } from '@ws/app/src/lib/routes/app-toc/services/app-toc.service'

@Component({
  selector: 'ws-widget-mark-as-complete',
  templateUrl: './mark-as-complete.component.html',
  styleUrls: ['./mark-as-complete.component.scss'],
})
export class MarkAsCompleteComponent implements OnInit {

  @Input()
  content!: NsContent.IContent
  reqBody!: IReqMarkAsComplete

  constructor(
    public dialog: MatDialog,
    private appTocSvc: AppTocService,
  ) {

  }

  confirm(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        body: this.reqBody,
        contentId: this.content.identifier,
      },
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'Marked' && this.content.progress) {
        this.content.progress.progressStatus = 'completed'
        this.content.progress.showMarkAsComplete = false
        this.content.progress.markAsCompleteReason = 'already.completed'
      }
    })
  }

  get showStart() {
    return this.appTocSvc.showStartButton(this.content)
  }

  ngOnInit() {
    this.reqBody = {
      content_type: this.content.contentType,
      current: ['1'],
      max_size: 1,
      mime_type: this.content.mimeType,
      user_id_type: 'uuid',
    }
  }

}
