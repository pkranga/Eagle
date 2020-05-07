/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { ConfigurationsService } from '@ws-widget/utils'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

const ENDPOINTS = {
path
}
@Injectable({
  providedIn: 'root',
})
export class IntranetSelectorService {
  constructor(private http: HttpClient, private configSvc: ConfigurationsService) { }

  isLoading(
    url = this.configSvc.instanceConfig && this.configSvc.instanceConfig.intranetUrlToCheck ?
      this.configSvc.instanceConfig.intranetUrlToCheck : ENDPOINTS.checkIntranet,
  ): any {
    return this.http.get<any>(url, { responseType: 'text' as 'json' }).toPromise()
  }
}
