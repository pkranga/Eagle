/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatCardModule,
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatButtonToggleModule,
  MatDatepickerModule,
  MatChipsModule,
  MatIconModule,
  MatDialogModule,
  MatAutocompleteModule,
  MatNativeDateModule,
  MatProgressSpinnerModule,
  MatTooltipModule
} from '@angular/material';
import { CertificationTocComponent } from './components/certification-toc/certification-toc.component';
import { AccSlotBookingComponent } from './components/acc-slot-booking/acc-slot-booking.component';
import { AtDeskSlotBookingComponent } from './components/at-desk-slot-booking/at-desk-slot-booking.component';

import { ResultUploadComponent } from './components/result-upload/result-upload.component';
import { BudgetApprovalComponent } from './components/budget-approval/budget-approval.component';
import { SpinnerModule } from '../spinner/spinner.module';
import { GoBackDialogComponent } from './components/go-back-dialog/go-back-dialog.component';
import { CertificationTocSnackbarComponent } from './components/certification-toc-snackbar/certification-toc-snackbar.component';
import { UtilityModule } from '../utility/utility.module';
import { BookingCardComponent } from './components/booking-card/booking-card.component';
import { RequestCancelDialogComponent } from './components/request-cancel-dialog/request-cancel-dialog.component';
import { CertificationService } from '../../services/certification.service';
import { WINDOW_PROVIDERS } from '../../services/window.service';
import { CertificationApiService } from '../../apis/certification-api.service';
import { FileDownloadService } from '../../services/file-download.service';
@NgModule({
  declarations: [
    CertificationTocComponent,
    AccSlotBookingComponent,
    AtDeskSlotBookingComponent,
    ResultUploadComponent,
    BudgetApprovalComponent,
    GoBackDialogComponent,
    CertificationTocSnackbarComponent,
    BookingCardComponent,
    RequestCancelDialogComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonToggleModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    SpinnerModule,
    UtilityModule
  ],
  exports: [CertificationTocComponent],
  entryComponents: [GoBackDialogComponent, CertificationTocSnackbarComponent, RequestCancelDialogComponent],
  providers: [CertificationService, CertificationApiService, FileDownloadService, WINDOW_PROVIDERS]
})
export class CertificationTocModule {}
