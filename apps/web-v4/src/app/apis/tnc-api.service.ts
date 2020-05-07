/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { publicSlagV3, slag, publicSlagV4, slagV4 } from '../constants/apiEndpoints.constant';
import { IApiResponse } from '../models/apiResponse';
import { ITncAcceptRequest, ITncAcceptResponse, ITncFetch } from '../models/user.model';
import { UserApiService } from './user-api.service';

const apiEndpoints = {
  // publicTnc: `${publicSlagV3}/user/tnc`,
  publicTnc: `${publicSlagV4}/user/tnc`,
  // myTnc: `${slag}/user/tnc/me`
  myTnc: `${slagV4}/user/tnc`
};
@Injectable({
  providedIn: 'root'
})
export class TncApiService {
  constructor(private http: HttpClient, private userApi: UserApiService) {}

  acceptTnc(request: ITncAcceptRequest): Observable<ITncAcceptResponse> {
    return this.userApi.addProfile().pipe(
      catchError(error => of(error)),
      switchMap(() =>
        this.http.post<IApiResponse<ITncAcceptResponse>>(apiEndpoints.myTnc, request).pipe(map(u => u.result))
      )
    );
  }

  getPublicTnc(): Observable<ITncFetch> {
    return this.http.get<any>(apiEndpoints.publicTnc).pipe(map(tncResponse => tncResponse.result.response));
  }
}
