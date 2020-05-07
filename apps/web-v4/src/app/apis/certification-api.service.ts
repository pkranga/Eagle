/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { slagV4 } from '../constants/apiEndpoints.constant';
import {
  IAccLocation,
  ITestCenterSlotList,
  ILHApiResponse,
  ICertificationMeta,
  ICertificationCountry,
  IAtDeskLocation,
  IAtDeskSlotItem,
  IAtDeskBooking,
  ICertificationRequestItem,
  ICertificationCurrency,
  IBudgetApprovalRequest,
  ICertificationApproverAction,
  ICertificationSubmission,
  ICertificationSendResponse,
  TCertificationResultAction,
  ICertificationResultSubmit,
  ISubmitOrWithdrawRequest,
  TCertificationCompletionStatus
} from '../models/certification.model';

const BASE = `${slagV4}/certification`;

@Injectable()
export class CertificationApiService {
  constructor(private http: HttpClient) {}

  getCertificationInfo(identifier: string, userId: string) {
    return this.http.get<ICertificationMeta>(
      `${BASE}/users/${userId}/certifications/${identifier}/booking-information`
    );
  }

  getTestCenters(certificationId: string): Observable<IAccLocation[]> {
    return this.http.get<IAccLocation[]>(`${BASE}/certifications/${certificationId}/test-centers`);
  }

  getTestCenterSlots(certificationId: string, location: string, testCenter: string): Observable<ITestCenterSlotList> {
    return this.http.get<ITestCenterSlotList>(
      `${BASE}/certifications/${certificationId}/locations/${location}/test-centers/${testCenter}/slots`
    );
  }

  bookAccSlot(userId: string, certificationId: string, slotNo: number): Observable<ILHApiResponse> {
    return this.http.post<ILHApiResponse>(
      `${BASE}/users/${userId}/certifications/${certificationId}/booking/${slotNo}`,
      {}
    );
  }

  getCountries(): Observable<ICertificationCountry[]> {
    return this.http.get<ICertificationCountry[]>(`${BASE}/countries`);
  }

  getAtDeskLocations(countryCode: string): Observable<IAtDeskLocation[]> {
    return this.http.get<IAtDeskLocation[]>(`${BASE}/countries/${countryCode}/locations`);
  }

  getAtDeskSlots(): Observable<IAtDeskSlotItem[]> {
    return this.http.get<IAtDeskSlotItem[]>(`${BASE}/slots`);
  }

  bookAtDeskSlot(
    userId: string,
    certificationId: string,
    atDeskBooking: IAtDeskBooking
  ): Observable<ICertificationSendResponse> {
    return this.http.post<ICertificationSendResponse>(
      `${BASE}/users/${userId}/certifications/${certificationId}/atdesk-booking`,
      atDeskBooking
    );
  }

  cancelSlot(userId: string, certificationId: string, slotNo: number, icfdId?: number) {
    let url = `${BASE}/users/${userId}/certifications/${certificationId}/slots/${slotNo}`;

    if (icfdId) {
      url += `?icfd_id=${icfdId}`;
    }

    return this.http.delete(url);
  }

  getCurrencies(): Observable<ICertificationCurrency[]> {
    return this.http.get<ICertificationCurrency[]>(`${BASE}/currencies`);
  }

  sendBudgetApprovalRequest(
    userId: string,
    certificationId: string,
    budgetRequest: IBudgetApprovalRequest
  ): Observable<ICertificationSendResponse> {
    return this.http.post<ICertificationSendResponse>(
      `${BASE}/users/${userId}/certifications/${certificationId}/budget-request`,
      budgetRequest
    );
  }

  cancelBudgetApprovalRequest(userId: string, certificationId: string) {
    return this.http.delete(`${BASE}/users/${userId}/certifications/${certificationId}/budget-request`);
  }

  sendExternalProof(userId: string, certificationId: string, proof: FormData): Observable<ICertificationSendResponse> {
    return this.http.post<ICertificationSendResponse>(
      `${BASE}/users/${userId}/certifications/${certificationId}/result`,
      proof
    );
  }

  deleteExternalProof(userId: string, certificationId: string, documentUrl: string) {
    return this.http.delete(
      `${BASE}/users/${userId}/certifications/${certificationId}/document?filename=${documentUrl}`
    );
  }

  getApprovalItems(userId: string, type?: string): Observable<ICertificationRequestItem[]> {
    let url = `${BASE}/users/${userId}/certification-approvals`;
    if (type) {
      url += `?type=${type}`;
    }

    return this.http.get<ICertificationRequestItem[]>(url);
  }

  getCertificationRequests(
    userId: string,
    type: string,
    startDate: number,
    endDate: number
  ): Observable<ICertificationRequestItem[]> {
    let url = `${BASE}/users/${userId}/certifications/certification-requests?start_date=${startDate}&end_date=${endDate}`;
    if (type) {
      url += `&type=${type}`;
    }

    return this.http.get<ICertificationRequestItem[]>(url);
  }

  sendAtDeskProctorAction(icfdId: number, approverAction: ICertificationApproverAction) {
    return this.http.post(`${BASE}/certification-requests/${icfdId}`, approverAction);
  }

  sendBudgetApproverAction(
    userId: string,
    certificationId: string,
    sino: number,
    ecdpId: number,
    approverAction: ICertificationApproverAction
  ) {
    return this.http.post(
      `${BASE}/users/${userId}/certifications/${certificationId}/budget-request-approval?sino=${sino}&ecdp_id=${ecdpId}`,
      approverAction
    );
  }

  sendResultVerificationAction(userId: string, certificationId: string, approverAction: ICertificationApproverAction) {
    return this.http.post(
      `${BASE}/users/${userId}/certifications/${certificationId}/result-verification-requests`,
      approverAction
    );
  }

  getPastCertifications(
    userId: string,
    status: TCertificationCompletionStatus
  ): Observable<ICertificationSubmission[]> {
    return this.http.get<ICertificationSubmission[]>(`${BASE}/users/${userId}/certifications?status=${status}`);
  }

  getCertificationSubmissions(userId: string, certificationId: string): Observable<ICertificationSubmission> {
    return this.http.get<ICertificationSubmission>(
      `${BASE}/users/${userId}/certifications/${certificationId}/submissions`
    );
  }

  getUploadedDocument(documentUrl: string) {
    return this.http.get(`${BASE}/submitted-document?document=${documentUrl}`);
  }

  submitOrWithdrawVerificationRequest(
    userId: string,
    certificationId: string,
    resultData: ISubmitOrWithdrawRequest,
    action: TCertificationResultAction
  ) {
    return this.http.patch(
      `${BASE}/users/${userId}/certifications/${certificationId}/result?action=${action}`,
      resultData
    );
  }
}
