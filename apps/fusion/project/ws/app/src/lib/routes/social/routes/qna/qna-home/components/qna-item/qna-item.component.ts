/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, Input } from '@angular/core'
import { NsDiscussionForum, DialogSocialDeletePostComponent } from '@ws-widget/collection'
import { ConfigurationsService } from '@ws-widget/utils'
import { MatSnackBar, MatDialog } from '@angular/material'

@Component({
  selector: 'ws-app-qna-item',
  templateUrl: './qna-item.component.html',
  styleUrls: ['./qna-item.component.scss'],
})
export class QnaItemComponent implements OnInit {

  @Input() item!: NsDiscussionForum.ITimelineResult
  userId = ''
  ePostStatus = NsDiscussionForum.EPostStatus
  constructor(
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private configSvc: ConfigurationsService,
  ) {
    if (this.configSvc.userProfile) {
      this.userId = this.configSvc.userProfile.userId || ''
    }
  }

  ngOnInit() {
  }

  deletePost(successMsg: string) {
    const dialogRef = this.dialog.open(DialogSocialDeletePostComponent, {
      data: { postId: this.item.id },
    })
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.snackBar.open(successMsg)
        this.item.status = NsDiscussionForum.EPostStatus.INACTIVE
      }
    })
  }
}
