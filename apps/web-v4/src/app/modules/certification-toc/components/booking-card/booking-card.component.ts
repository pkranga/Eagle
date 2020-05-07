/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { BehaviorSubject } from 'rxjs';
import { takeWhile, switchMap, tap } from 'rxjs/operators';
import {
  ICertificationMeta,
  TCertificationRequestType,
  TCertificationView
} from '../../../../models/certification.model';
import { RequestCancelDialogComponent } from '../request-cancel-dialog/request-cancel-dialog.component';
import { CertificationService } from '../../../../services/certification.service';
import { IContent } from '../../../../models/content.model';
import { SendStatus } from '../../../../models/status.model';

@Component({
  selector: 'ws-booking-card',
  templateUrl: './booking-card.component.html',
  styleUrls: ['./booking-card.component.scss']
})
export class BookingCardComponent implements OnInit {
  @Input() certification: ICertificationMeta;
  @Input() content: IContent;
  @Input() fetchSubject: BehaviorSubject<boolean>;
  bookingCancelStatus: SendStatus;
  currentTime: number;

  constructor(private dialog: MatDialog, private certificationSvc: CertificationService) {
    this.currentTime = new Date().getTime();
  }

  ngOnInit() {}

  openCancelDialog() {
    this.dialog
      .open<RequestCancelDialogComponent, TCertificationRequestType>(RequestCancelDialogComponent, {
        data: 'proctor_approval'
      })
      .afterClosed()
      .pipe(
        takeWhile(dialogResult => dialogResult && dialogResult.confirmCancel),
        tap(() => {
          this.bookingCancelStatus = 'sending';
        }),
        switchMap(() =>
          this.certificationSvc.cancelSlot(
            this.content.identifier,
            this.certification.booking.slotno,
            this.certification.booking.icfdId
          )
        )
      )
      .subscribe(
        () => {
          this.fetchSubject.next(true);
          this.bookingCancelStatus = 'done';
        },
        () => {
          this.bookingCancelStatus = 'error';
        }
      );
  }
}
