/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, Input } from '@angular/core'
import { throwError, Subject } from 'rxjs'
import { takeWhile, tap, switchMap } from 'rxjs/operators'

import { NsContent } from '@ws-widget/collection'
import { TSendStatus } from '@ws-widget/utils'

import { ICertificationMeta, TCertificationRequestType } from '../../models/certification.model'
import { RequestCancelDialogComponent } from '../request-cancel-dialog/request-cancel-dialog.component'
import { MatDialog, MatSnackBar } from '@angular/material'
import { CertificationApiService } from '../../apis/certification-api.service'
import { SnackbarComponent } from '../snackbar/snackbar.component'

@Component({
  selector: 'ws-app-toc-certification-budget-card',
  templateUrl: './budget-card.component.html',
  styleUrls: ['./budget-card.component.scss'],
})
export class BudgetCardComponent {
  @Input() certification!: ICertificationMeta
  @Input() content!: NsContent.IContent
  @Input() certificationFetchSubject!: Subject<any>
  budgetCancelStatus: TSendStatus

  constructor(
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private certificationApi: CertificationApiService,
  ) {
    this.budgetCancelStatus = 'none'
  }

  cancelBudgetApproval() {
    this.dialog
      .open<RequestCancelDialogComponent, TCertificationRequestType, { confirmCancel: boolean }>(
        RequestCancelDialogComponent,
        { data: 'budget_approval' },
      )
      .afterClosed()
      .pipe(
        takeWhile(dialogResult => {
          if (dialogResult && dialogResult.confirmCancel) {
            return true
          }
          return false
        }),
        tap(() => {
          this.budgetCancelStatus = 'sending'
        }),
        switchMap(() => {
          if (this.content) {
            return this.certificationApi.cancelBudgetApprovalRequest(this.content.identifier)
          }
          return throwError('No content.')
        }),
      )
      .subscribe(
        res => {
          this.snackbar.openFromComponent(SnackbarComponent, {
            data: {
              action: 'cert_budget_cancel',
              code: res.res_code,
            },
          })

          this.budgetCancelStatus = 'done'

          if (res.res_code === 1) {
            this.certificationFetchSubject.next()
          }
        },
        () => {
          this.snackbar.openFromComponent(SnackbarComponent)
          this.budgetCancelStatus = 'error'
        },
      )
  }
}
