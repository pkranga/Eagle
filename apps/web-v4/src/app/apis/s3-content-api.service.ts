/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { slagV2, slagV4 } from '../constants/apiEndpoints.constant';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class S3ContentApiService {
  apiEndpoints = {
    setCookie: `${slagV2}/videojs/setCookie`,
    setS3Cookie: `${slagV4}/setS3Cookie/setCookie`
  };

  constructor(private http: HttpClient) {}

  setVideoCookie(path: string): Observable<any> {
    return this.http.post(this.apiEndpoints.setCookie, { path }).pipe(catchError(err => of(true)));
  }

  setS3Cookie(path: string): Observable<any> {
    return this.http.post(this.apiEndpoints.setS3Cookie, { path }).pipe(catchError(err => of(true)));
  }
}
