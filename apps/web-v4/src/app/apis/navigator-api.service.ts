/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NavigatorApiService {
  API_BASE = '/web-hosted/navigator/json';

  apiEndpoints = {
    NAVIGATOR_LP_DATA: `${this.API_BASE}/data.json`,
    NAVIGATOR_NSO_DATA: `${this.API_BASE}/nsodata.json`,
    NAVIGATOR_DM_DATA: `${this.API_BASE}/dmdata.json`,
    NAVIGATOR_FS_DATA: `${this.API_BASE}/fsdata.json`,
    NAVIGATOR_CG_DATA: `${this.API_BASE}/common_goal_mapping.json`,
    NAVIGATOR_IND_DATA: `${this.API_BASE}/industries_data.json`,
    NAVIGATOR_SD_DATA: `${this.API_BASE}/industries_subdomain.json`,
    NAVIGATOR_AC_DATA: `${this.API_BASE}/accounts_data.json`,
    NAVIGATOR_DPN_DATA: `${this.API_BASE}/dpn_data.json`,
    NAVIGATOR_COMMONS_DATA: `${this.API_BASE}/commonsdata.json`,
    NAVIGATOR_CDP_DATA: `${this.API_BASE}/cdp.json`,
    NAVIGATOR_CDP_LP_DATA: `${this.API_BASE}/cdp-lp.json`
  };

  constructor(private http: HttpClient) { }

  // NAVIGATOR
  fetchNsoData(): Observable<any> {
    // const nsoCache = this.cache.fetchOtherResource('NSO');
    const nsoCache = undefined;
    if (nsoCache) {
      return of(nsoCache);
    }
    return this.http.get(this.apiEndpoints.NAVIGATOR_NSO_DATA);
  }
  fetchLearningPathData(): Observable<any> {
    return this.http.get<any>(this.apiEndpoints.NAVIGATOR_LP_DATA).pipe(
      map(contents => {
        const lphash: { [id: string]: any } = {};
        contents.lp_data.map(content => {
          lphash[content.lp_id] = content;
        });
        return lphash;
      })
    );
  }

  fetchCdpData(): Observable<any> {
    return this.http.get(this.apiEndpoints.NAVIGATOR_CDP_DATA);
  }

  fetchCdpLpData(): Observable<any> {
    return this.http.get(this.apiEndpoints.NAVIGATOR_CDP_LP_DATA);
  }

  fetchDMData(): Observable<any> {
    return this.http.get(this.apiEndpoints.NAVIGATOR_DM_DATA);
  }
  fetchFullstackData(): Observable<any> {
    return this.http.get(this.apiEndpoints.NAVIGATOR_FS_DATA);
  }
  fetchCommonGoalsData(): Observable<any> {
    return this.http.get(this.apiEndpoints.NAVIGATOR_CG_DATA);
  }
  fetchCommonsData(): Observable<any> {
    return this.http.get(this.apiEndpoints.NAVIGATOR_COMMONS_DATA);
  }
  fetchIndustriesData(): Observable<any> {
    return this.http.get(this.apiEndpoints.NAVIGATOR_IND_DATA);
  }
  fetchSubDomainsData(): Observable<any> {
    return this.http.get(this.apiEndpoints.NAVIGATOR_SD_DATA);
  }
  fetchAccountsData(): Observable<any> {
    return this.http.get(this.apiEndpoints.NAVIGATOR_AC_DATA);
  }
  fetchDeliveryPartnerData(): Observable<any> {
    return this.http.get(this.apiEndpoints.NAVIGATOR_DPN_DATA);
  }
}
