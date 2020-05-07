/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatTabsModule,
  MatCardModule,
  MatIconModule,
  MatToolbarModule,
  MatFormFieldModule,
  MatSelectModule,
  MatButtonModule,
  MatDialogModule,
  MatProgressSpinnerModule,
  MatInputModule,
  MatTooltipModule,
  MatDatepickerModule,
  MatNativeDateModule
} from '@angular/material';

import { CertificationV2RoutingModule } from './certification-v2-routing.module';
import { CertificationHomeComponent } from './components/certification-home/certification-home.component';
import { CertificationRequestsComponent } from './components/certification-requests/certification-requests.component';
import { RequestItemTypeComponent } from './components/request-item-type/request-item-type.component';
import { ApprovalCardComponent } from './components/approval-card/approval-card.component';
import { SpinnerModule } from '../../modules/spinner/spinner.module';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { UtilityModule } from '../../modules/utility/utility.module';
import { MyRequestsComponent } from './components/my-requests/my-requests.component';
import { UserRequestCardComponent } from './components/user-request-card/user-request-card.component';
import { UserActionConfirmDialogComponent } from './components/user-action-confirm-dialog/user-action-confirm-dialog.component';
import { RequestFilterDialogComponent } from './components/request-filter-dialog/request-filter-dialog.component';
import { CertificationService } from '../../services/certification.service';
import { CertificationApiService } from '../../apis/certification-api.service';
import { FileDownloadService } from '../../services/file-download.service';
import { WINDOW_PROVIDERS } from '../../services/window.service';
import { PastCertificationsComponent } from './components/past-certifications/past-certifications.component';

@NgModule({
  declarations: [
    CertificationHomeComponent,
    CertificationRequestsComponent,
    RequestItemTypeComponent,
    ApprovalCardComponent,
    ConfirmDialogComponent,
    MyRequestsComponent,
    UserRequestCardComponent,
    UserActionConfirmDialogComponent,
    RequestFilterDialogComponent,
    PastCertificationsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatCardModule,
    MatIconModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatTooltipModule,
    MatNativeDateModule,
    MatDatepickerModule,
    CertificationV2RoutingModule,
    SpinnerModule,
    UtilityModule
  ],
  entryComponents: [ConfirmDialogComponent, UserActionConfirmDialogComponent, RequestFilterDialogComponent],
  providers: [CertificationService, CertificationApiService, FileDownloadService, WINDOW_PROVIDERS]
})
export class CertificationV2Module {}
