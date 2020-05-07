/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import {
  ICertification,
  IAccLocation,
  ITestCenterSlotList,
  ICertificationMeta,
  ICertificationCountry,
  IAtDeskLocation,
  IAtDeskBooking,
  ICertificationRequestItem,
  IBudgetApprovalRequest,
  ICertificationSendResponse,
  ICertificationApproverData,
  TCertificationRequestType,
  TCertificationUserActionType,
  ISubmitOrWithdrawRequest,
  ICertificationSubmission,
  TCertificationCompletionStatus
} from '../models/certification.model';
import { UserApiService } from '../apis/user-api.service';
import { AuthService } from './auth.service';
import { CertificationApiService } from '../apis/certification-api.service';
import { FormGroup } from '../../../node_modules/@angular/forms';

@Injectable()
export class CertificationService {
  private _userId: string;

  get userId() {
    return this._userId;
  }

  private readonly genericError = {
    err: null,
    response: {
      res_code: 0,
      res_message: ''
    }
  };

  constructor(
    private userSvc: UserApiService,
    private authSvc: AuthService,
    private certificationApi: CertificationApiService
  ) {
    this._userId = this._getEmailPrefix(this.authSvc.userEmail);
  }

  fetchCertifications(): Observable<ICertification> {
    return this.userSvc.fetchCertification({
      userEmail: this.authSvc.userEmail,
      tracks: [],
      sortOrder: 'desc'
    });
  }

  getCertificationInfo(identifier: string): Observable<ICertificationMeta> {
    return this.certificationApi.getCertificationInfo(identifier, this.userId);
  }

  getTestCenters(certificationId: string): Observable<IAccLocation[]> {
    return this.certificationApi.getTestCenters(certificationId);
  }

  getTestCenterSlots(certificationId: string, location: string, testCenter: string): Observable<ITestCenterSlotList> {
    return this.certificationApi.getTestCenterSlots(certificationId, location, testCenter).pipe(
      catchError(err =>
        of({
          dc: location,
          testcenter: testCenter,
          slotdata: []
        })
      )
    );
  }

  bookAccSlot(certificationId: string, slotNo: number) {
    return this.certificationApi.bookAccSlot(this.userId, certificationId, slotNo);
  }

  getCountries(): Observable<ICertificationCountry[]> {
    return this.certificationApi.getCountries().pipe(catchError(() => of([])));
  }

  getAtDeskLocations(countryCode: string): Observable<IAtDeskLocation[]> {
    return this.certificationApi.getAtDeskLocations(countryCode).pipe(catchError(() => of([])));
  }

  bookAtDeskSlot(certificationId: string, atDeskForm: FormGroup): Observable<ICertificationSendResponse> {
    const atDeskBooking: IAtDeskBooking = {
      country_code: atDeskForm.value.country,
      location_code: atDeskForm.value.location,
      date: new Date(atDeskForm.value.date).getTime(),
      slot: atDeskForm.value.slot,
      user_contact: atDeskForm.value.userContact,
      proctor_contact: atDeskForm.value.proctorContact,
      proctor: typeof atDeskForm.value.proctorEmail === 'string' ? atDeskForm.value.proctorEmail.split('@')[0] : ''
    };

    return this.certificationApi.bookAtDeskSlot(this.userId, certificationId, atDeskBooking);
  }

  sendBudgetApprovalRequest(
    certificationId: string,
    budgetRequest: IBudgetApprovalRequest
  ): Observable<ICertificationSendResponse> {
    return this.certificationApi
      .sendBudgetApprovalRequest(this.userId, certificationId, budgetRequest)
      .pipe(catchError((err, caught) => this._getSendResponse(err, caught)));
  }

  sendExternalProof(certificationId: string, resultForm: FormGroup): Observable<ICertificationSendResponse> {
    try {
      const formData = this._toFormData(resultForm.value);
      formData.set('examDate', new Date(resultForm.value.examDate).getTime().toString());
      formData.delete('fileName');
      formData.set('verifierEmail', this._getEmailPrefix(formData.get('verifierEmail').toString()));

      return this.certificationApi.sendExternalProof(this.userId, certificationId, formData);
    } catch (e) {
      return this._getSendResponse(this.genericError.err, of(this.genericError.response));
    }
  }

  deleteExternalProof(certificationId: string, documentUrl: string) {
    return this.certificationApi.deleteExternalProof(this.userId, certificationId, documentUrl);
  }

  getApprovalItems(type: TCertificationRequestType): Observable<ICertificationRequestItem[]> {
    type = type === 'all' ? null : type;

    return this.certificationApi.getApprovalItems(this.userId, type);
  }

  getCertificationRequests(
    type: TCertificationRequestType,
    startDate: Date,
    endDate: Date
  ): Observable<ICertificationRequestItem[]> {
    type = type === 'all' ? null : type;
    const startDateMs = startDate.getTime();
    const endDateMs = endDate.getTime();

    return this.certificationApi.getCertificationRequests(this.userId, type, startDateMs, endDateMs).pipe(
      map(requestItems => {
        requestItems.forEach(requestItem => {
          if (typeof requestItem.document === 'string') {
            requestItem.document_url = requestItem.document;
          }
        });

        return requestItems;
      })
    );
  }

  performApproverAction(requestType: TCertificationRequestType, data: ICertificationApproverData): Observable<any> {
    switch (requestType) {
      case 'proctor_approval':
        return this.certificationApi.sendAtDeskProctorAction(data.icfdId, {
          status: data.status
        });

      case 'budget_approval':
        return this.certificationApi.sendBudgetApproverAction(
          this.userId,
          data.certificationId,
          data.sino,
          data.ecdpId,
          {
            status: data.status,
            reason: data.reason || ''
          }
        );

      case 'result_verification':
        return this.certificationApi.sendResultVerificationAction(this.userId, data.certificationId, {
          status: data.status,
          reason: data.reason || '',
          upload_id: data.uploadId,
          user: data.user.email
        });
    }
  }

  cancelSlot(certificationId: string, slotNo: number, icfdId?: number) {
    return this.certificationApi.cancelSlot(this.userId, certificationId, slotNo, icfdId);
  }

  cancelBudgetApprovalRequest(certificationId: string) {
    return this.certificationApi.cancelBudgetApprovalRequest(this.userId, certificationId);
  }

  withdrawVerificationRequest(
    certificationId: string,
    resultType: string,
    result: string,
    fileName: string,
    verifierEmail: string,
    examDate: number
  ) {
    const resultData: ISubmitOrWithdrawRequest = {
      result_type: resultType,
      result,
      fileName,
      verifierEmail,
      exam_date: examDate
    };

    return this.certificationApi.submitOrWithdrawVerificationRequest(
      this.userId,
      certificationId,
      resultData,
      'withdraw'
    );
  }

  submitVerificationRequest(certificationId: string, submitForm: FormGroup) {
    const resultData: ISubmitOrWithdrawRequest = {
      result_type: submitForm.value.resultType,
      result: submitForm.value.result,
      fileName: submitForm.value.fileName,
      verifierEmail: submitForm.value.verifierEmail,
      exam_date: new Date(submitForm.value.examDate).getTime()
    };

    return this.certificationApi.submitOrWithdrawVerificationRequest(
      this.userId,
      certificationId,
      resultData,
      'submit'
    );
  }

  performUserRequestAction(requestType: TCertificationRequestType, action: TCertificationUserActionType, data: any) {
    switch (requestType) {
      case 'proctor_approval':
        return this.cancelSlot(data.certificationId, data.slotNo, data.icfdId);

      case 'budget_approval':
        return this.cancelBudgetApprovalRequest(data.certificationId);
    }
  }

  getPastCertifications(status: TCertificationCompletionStatus): Observable<ICertificationSubmission[]> {
    return this.certificationApi.getPastCertifications(this.userId, status);
  }

  private _getEmailPrefix(emailId: string): string {
    try {
      const atIndex = emailId.indexOf('@');
      if (atIndex === -1) {
        return emailId;
      }

      return emailId.substring(0, atIndex);
    } catch (e) {
      return emailId;
    }
  }

  private _getSendResponse(
    err: any,
    caught: Observable<ICertificationSendResponse>
  ): Observable<ICertificationSendResponse> {
    if (err instanceof HttpErrorResponse) {
      return caught;
    }

    const response: ICertificationSendResponse = {
      res_code: 0,
      res_message: ''
    };

    return of(response);
  }

  private _toFormData(data: any): FormData {
    const formData = new FormData();

    for (const key of Object.keys(data)) {
      const value = data[key];
      formData.append(key, value);
    }

    return formData;
  }
}
