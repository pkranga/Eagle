/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { BehaviorSubject, noop } from 'rxjs';
import { takeWhile, switchMap, tap } from 'rxjs/operators';
import {
  ICertificationRequestItem,
  IRequestFilterDialogResult,
  TCertificationRequestType
} from '../../../../models/certification.model';
import { CertificationService } from '../../../../services/certification.service';
import { FetchStatus } from '../../../../models/status.model';
import { RequestFilterDialogComponent } from '../request-filter-dialog/request-filter-dialog.component';

@Component({
  selector: 'ws-certification-requests',
  templateUrl: './certification-requests.component.html',
  styleUrls: ['./certification-requests.component.scss']
})
export class CertificationRequestsComponent implements OnInit {
  @Input() readonly pageType: 'approver' | 'user';
  approvalItems: ICertificationRequestItem[];
  itemFetchStatus: FetchStatus;
  requestType: TCertificationRequestType;
  itemSubject: BehaviorSubject<boolean>;
  startDate: Date;
  endDate: Date;

  constructor(private certificationSvc: CertificationService, private dialog: MatDialog) {
    this.requestType = 'all';
    this.itemSubject = new BehaviorSubject(true);
    this.startDate = new Date(new Date().getFullYear(), 0, 1);
    this.endDate = new Date(new Date().getFullYear() + 1, 0, 1);
  }

  ngOnInit() {
    this._subscribeToSubject();
  }

  openFilterDialog() {
    this.dialog
      .open<RequestFilterDialogComponent, 'approver' | 'user', IRequestFilterDialogResult>(
        RequestFilterDialogComponent,
        { data: this.pageType }
      )
      .afterClosed()
      .pipe(
        takeWhile(dialogResult => {
          if (this.pageType === 'user' && !(dialogResult.startDate && dialogResult.endDate)) {
            return false;
          }

          return true;
        }),
        tap(dialogResult => {
          this.requestType = dialogResult.type;
          this.startDate = dialogResult.startDate;
          this.endDate = dialogResult.endDate;
        })
      )
      .subscribe(() => {
        this.itemSubject.next(true);
      }, noop);
  }

  private _subscribeToSubject() {
    this.itemSubject
      .pipe(
        takeWhile(value => value),
        tap(() => {
          this.itemFetchStatus = 'fetching';
        }),
        switchMap(() =>
          this.pageType === 'approver'
            ? this.certificationSvc.getApprovalItems(this.requestType)
            : this.certificationSvc.getCertificationRequests(this.requestType, this.startDate, this.endDate)
        )
      )
      .subscribe(
        items => {
          this.approvalItems = items;
          this.itemFetchStatus = 'done';
        },
        () => {
          this.itemFetchStatus = 'error';
        }
      );
  }
}
