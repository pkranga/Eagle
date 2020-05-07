/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, Inject } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material'
import { NsContent } from '../../_services/widget-content.model'
import { ENTER, COMMA, SEMICOLON } from '@angular/cdk/keycodes'
import { WidgetContentShareService } from '../../_services/widget-content-share.service'
import { NsAutoComplete } from '../../_common/user-autocomplete/user-autocomplete.model'
import { NsShare } from '../../_services/widget-share.model'
import { ConfigurationsService, EventService, EInstance } from '@ws-widget/utils'

@Component({
  selector: 'ws-widget-btn-content-share-dialog',
  templateUrl: './btn-content-share-dialog.component.html',
  styleUrls: ['./btn-content-share-dialog.component.scss'],
})
export class BtnContentShareDialogComponent implements OnInit {

  readonly separatorKeysCodes: number[] = [ENTER, COMMA, SEMICOLON]
  users: NsAutoComplete.IUserAutoComplete[] = []
  errorType: 'NoDomain' | 'InvalidDomain' | 'None' = 'None'
  sendInProgress = false
  sendStatus:
    | 'INVALID_IDS_ALL'
    | 'SUCCESS'
    | 'INVALID_ID_SOME'
    | 'ANY'
    | 'NONE' = 'NONE'
  constructor(
    private events: EventService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<BtnContentShareDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { content: NsContent.IContent },
    private shareSvc: WidgetContentShareService,
    private configSvc: ConfigurationsService,
  ) { }

  ngOnInit() { }

  updateUsers(users: NsAutoComplete.IUserAutoComplete[]) {
    if (Array.isArray(users)) {
      this.users = users
    }
  }

  share(txtBody: string, successToast: string) {
    this.sendInProgress = true
    const emails = []
    for (let i = 0; i < this.users.length; i += 1) {
      emails.push({
        email: this.users[i].email,
      })
    }
    this.shareSvc.shareContent(this.data.content, emails, txtBody).subscribe(
      data => {
        this.sendInProgress = false
        if (!data.invalidIds || data.invalidIds.length === 0) {
          this.snackBar.open(successToast)
          this.dialogRef.close()
        }
        if (Array.isArray(data.invalidIds) && data.invalidIds.length > 0) {
          const invalidMailSet = new Set(data.invalidIds)
          if (data.response.toLowerCase() !== 'success') {
            this.sendStatus = 'ANY'
          }
          if (this.users.length === invalidMailSet.size) {
            this.sendStatus = 'INVALID_IDS_ALL'
          } else {
            this.sendStatus = 'INVALID_ID_SOME'
            this.snackBar.open(successToast)
          }
        }
      },
      () => {
        this.sendStatus = 'ANY'
        this.sendInProgress = false
      },
    )
  }

  contentShare(txtBody: string, successToast: string) {
    this.sendInProgress = true
    this.raiseTelemetry()
    const req: NsShare.IShareRequest = {
      'event-id': 'share_content',
      'tag-value-pair': {
        '#contentTitle': this.data.content.name,
        '#contentType': this.data.content.contentType,
        '#message': txtBody,
        '#targetUrl': this.detailUrl,
      },
      'target-data': {
        identifier: this.data.content.identifier,
      },
      recipients: {
        sharedBy: [(this.configSvc.userProfile && this.configSvc.userProfile.userId) || ''],
        sharedWith: this.users.map(user => user.wid),
      },
    }
    this.shareSvc.contentShareNew(req).subscribe(
      _ => {
        this.snackBar.open(successToast)
        this.sendInProgress = false
        this.dialogRef.close()
      },
      _ => {
        this.sendStatus = 'ANY'
        this.sendInProgress = false
      },
    )
  }

  get detailUrl() {
    let locationOrigin = location.origin
    if (this.configSvc.activeLocale && this.configSvc.activeLocale.path) {
      locationOrigin += `/${this.configSvc.activeLocale.path}`
    }
    switch (this.data.content.contentType) {
      case NsContent.EContentTypes.CHANNEL:
        return `${locationOrigin}${this.data.content.artifactUrl}`
      case NsContent.EContentTypes.KNOWLEDGE_BOARD:
        return `${locationOrigin}/app/knowledge-board/${this.data.content.identifier}`
      case NsContent.EContentTypes.KNOWLEDGE_ARTIFACT:
path
          return `${locationOrigin}/app/toc/knowledge-artifact/${this.data.content.identifier}`
        }
        return `${locationOrigin}/app/toc/${this.data.content.identifier}/overview`
      default:
        return `${locationOrigin}/app/toc/${this.data.content.identifier}/overview`
    }
  }

  raiseTelemetry() {
    this.events.raiseInteractTelemetry(
      'share',
      'content',
      {
        contentId: this.data.content.identifier,
        contentType: this.data.content.contentType,
      },
    )
  }
}
