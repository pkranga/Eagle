/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { finalize, switchMap, takeWhile, tap } from 'rxjs/operators';

import { IContent } from '../../../../models/content.model';
import { FetchStatus, SendStatus } from '../../../../models/status.model';
import {
  ICertificationMeta,
  TCertificationView,
  TCertificationRequestType
} from '../../../../models/certification.model';
import { CertificationService } from '../../../../services/certification.service';
import { CertificationApiService } from '../../../../apis/certification-api.service';
import { FileDownloadService } from '../../../../services/file-download.service';
import { MatDialog } from '../../../../../../node_modules/@angular/material';
import { RequestCancelDialogComponent } from '../request-cancel-dialog/request-cancel-dialog.component';

@Component({
  selector: 'ws-certification-toc',
  templateUrl: './certification-toc.component.html',
  styleUrls: ['./certification-toc.component.scss']
})
export class CertificationTocComponent implements OnInit {
  @Input() content: IContent;
  certification: ICertificationMeta;
  fetchStatus: FetchStatus;
  downloadStatus: FetchStatus;
  budgetCancelStatus: SendStatus;
  resultWithdrawStatus: SendStatus;
  currentView: TCertificationView = 'default';
  fetchSubject: BehaviorSubject<boolean>;

  constructor(
    private certificationSvc: CertificationService,
    private certificationApi: CertificationApiService,
    private fileDownloadSvc: FileDownloadService,
    private dialog: MatDialog
  ) {
    this.fetchSubject = new BehaviorSubject(true);
  }

  ngOnInit() {
    this.fetchSubject
      .pipe(
        takeWhile(value => value),
        tap(() => {
          this.fetchStatus = 'fetching';
        }),
        switchMap(() => this.certificationSvc.getCertificationInfo(this.content.identifier))
      )
      .subscribe(
        certificationData => {
          this.certification = certificationData;
          this.fetchStatus = 'done';
        },
        () => {
          this.fetchStatus = 'error';
        }
      );
  }

  changeView(view: TCertificationView) {
    this.currentView = view;
  }

  downloadProof() {
    this.downloadStatus = 'fetching';

    this.certificationApi
      .getUploadedDocument(this.certification.verification_request.document[0].document_url)
      .pipe(
        switchMap((documentData: any) =>
          this.fileDownloadSvc.saveFile(documentData.documentString, documentData.documentName)
        )
      )
      .subscribe(
        () => {
          this.downloadStatus = 'done';
        },
        () => {
          this.downloadStatus = 'error';
        }
      );
  }

  cancelBudgetApproval() {
    this.dialog
      .open<RequestCancelDialogComponent, TCertificationRequestType, { confirmCancel: boolean }>(
        RequestCancelDialogComponent,
        {
          data: 'budget_approval'
        }
      )
      .afterClosed()
      .pipe(
        takeWhile(dialogResult => dialogResult && dialogResult.confirmCancel),
        tap(() => {
          this.budgetCancelStatus = 'sending'
        }),
        switchMap(() => this.certificationSvc.cancelBudgetApprovalRequest(this.content.identifier))
      )
      .subscribe(
        res => {
          this.budgetCancelStatus = 'done';
          this.fetchSubject.next(true);
        },
        () => {
          this.budgetCancelStatus = 'error';
        }
      );
  }

  withdrawResult() {
    this.dialog
      .open<RequestCancelDialogComponent, TCertificationRequestType, { confirmCancel: true }>(
        RequestCancelDialogComponent,
        {
          data: 'result_verification'
        }
      )
      .afterClosed()
      .pipe(
        takeWhile(dialogResult => dialogResult && dialogResult.confirmCancel),
        tap(() => {
          this.resultWithdrawStatus = 'sending';
        }),
        switchMap(() =>
          this.certificationSvc.withdrawVerificationRequest(
            this.content.identifier,
            this.certification.verification_request.result_type,
            this.certification.verification_request.result,
            this.certification.verification_request.document[0].document_name,
            this.certification.verification_request.verifierEmail,
            this.certification.verification_request.exam_date
          )
        )
      )
      .subscribe(
        res => {
          this.resultWithdrawStatus = 'done';
          this.fetchSubject.next(true);
        },
        () => {
          this.resultWithdrawStatus = 'error';
        }
      );
  }
}
