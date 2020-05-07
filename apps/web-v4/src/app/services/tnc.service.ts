/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TncApiService } from '../apis/tnc-api.service';
import { ITncAcceptRequest, ITncAcceptResponse, ITncFetch } from '../models/user.model';

const apiEndPoints = {
  // myTnc: '/clientApi/v3/user/tnc/me'
  myTnc: '/clientApi/v4/user/tnc'
};

@Injectable({
  providedIn: 'root'
})
export class TncService {
  private userTnc: ITncFetch = null;
  constructor(private http: HttpClient, private tncApi: TncApiService) {}

  get hasAcceptedTnC(): boolean {
    return this.userTnc && this.userTnc.isAccepted;
  }

  async fetchMyTnc() {
    const tncResponse = await this.http.get<any>(apiEndPoints.myTnc).toPromise();
    // .catch(err => console.log('ERROR in my tnc fetch >', err));
    if (tncResponse) {
      this.userTnc = tncResponse.result.response as ITncFetch;
    }
    return this.userTnc;
  }

  get userHasAcceptedTnc(): boolean {
    return this.userTnc && this.userTnc.isAccepted;
  }

  acceptTnc(request: ITncAcceptRequest): Observable<ITncAcceptResponse> {
    return this.tncApi.acceptTnc(request).pipe(
      tap(tncResponse => {
        const acceptedNames = new Set(request.termsAccepted.map(u => u.docName));
        this.userTnc.isAccepted = true;
        this.userTnc.termsAndConditions.forEach(unit => {
          if (acceptedNames.has(unit.name)) {
            unit.isAccepted = true;
            unit.acceptedDate = new Date();
          }
        });
      })
    );
  }

  getPublicTnc(): Observable<ITncFetch> {
    if (this.userTnc) {
      return of(this.userTnc);
    }
    return this.tncApi.getPublicTnc().pipe(tap(tnc => (this.userTnc = tnc)));
  }
}
