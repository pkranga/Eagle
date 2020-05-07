/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { BehaviorSubject } from 'rxjs';
import {
  ICertificationRequestItem,
  TCertificationUserActionType,
  IUserActionDialogData
} from '../../../../models/certification.model';
import { SendStatus, FetchStatus } from '../../../../models/status.model';
import { UserActionConfirmDialogComponent } from '../user-action-confirm-dialog/user-action-confirm-dialog.component';
import { takeWhile, switchMap, tap } from '../../../../../../node_modules/rxjs/operators';
import { CertificationService } from '../../../../services/certification.service';
import { FileDownloadService } from '../../../../services/file-download.service';
import { CertificationApiService } from '../../../../apis/certification-api.service';

@Component({
  selector: 'ws-user-request-card',
  templateUrl: './user-request-card.component.html',
  styleUrls: ['./user-request-card.component.scss']
})
export class UserRequestCardComponent implements OnInit {
  @Input() requestItem: ICertificationRequestItem;
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

  confirmAction(actionType: TCertificationUserActionType) {
    if (this.requestItem.record_type === 'budget_approval' || this.requestItem.record_type === 'proctor_approval') {
      this.dialog
        .open<UserActionConfirmDialogComponent, IUserActionDialogData>(UserActionConfirmDialogComponent, {
          data: {
            actionType,
            approvalItem: this.requestItem
          }
        })
        .afterClosed()
        .pipe(
          takeWhile(dialogResult => dialogResult && dialogResult.confirmAction),
          tap(() => {
            this.sendStatus = 'sending';
          }),
          switchMap(dialogResult =>
            this.certificationSvc.performUserRequestAction(this.requestItem.record_type, actionType, dialogResult)
          )
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

  downloadProof() {
    this.downloadStatus = 'fetching';
    this.certificationApi
      .getUploadedDocument(this.requestItem.document_url || this.requestItem.document[0].document_url)
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
}
