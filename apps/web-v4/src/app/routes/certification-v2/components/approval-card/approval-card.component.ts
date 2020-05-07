/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { BehaviorSubject } from 'rxjs';
import { takeWhile, switchMap, tap } from 'rxjs/operators';
import {
  ICertificationRequestItem,
  ICertificationDialogData,
  ICertificationDialogResult,
  TCertificationActionType
} from '../../../../models/certification.model';
import { SendStatus, FetchStatus } from '../../../../models/status.model';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { CertificationService } from '../../../../services/certification.service';
import { CertificationApiService } from '../../../../apis/certification-api.service';
import { FileDownloadService } from '../../../../services/file-download.service';

@Component({
  selector: 'ws-approval-card',
  templateUrl: './approval-card.component.html',
  styleUrls: ['./approval-card.component.scss']
})
export class ApprovalCardComponent implements OnInit {
  @Input() approvalItem: ICertificationRequestItem;
  @Input() itemSubject: BehaviorSubject<boolean>;
  sendStatus: SendStatus;
  downloadStatus: FetchStatus;

  constructor(
    private dialog: MatDialog,
    private certificationSvc: CertificationService,
    private certificationApi: CertificationApiService,
    private fileDownloadSvc: FileDownloadService
  ) {}

  ngOnInit() {}

  downloadProof() {
    this.downloadStatus = 'fetching';

    this.certificationApi
      .getUploadedDocument(this.approvalItem.document[0].document_url)
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

  confirmAction(actionType: TCertificationActionType) {
    this.dialog
      .open<ConfirmDialogComponent, ICertificationDialogData, ICertificationDialogResult>(ConfirmDialogComponent, {
        data: {
          approvalItem: this.approvalItem,
          action: this.approvalItem.record_type,
          actionType
        }
      })
      .afterClosed()
      .pipe(
        takeWhile(dialogResult => dialogResult && dialogResult.result),
        tap(() => {
          this.sendStatus = 'sending';
        }),
        switchMap(dialogResult => this.certificationSvc.performApproverAction(dialogResult.action, dialogResult.data))
      )
      .subscribe(
        () => {
          this.itemSubject.next(true);
          this.sendStatus = 'done';
        },
        () => {
          this.sendStatus = 'error';
        }
      );
  }
}
