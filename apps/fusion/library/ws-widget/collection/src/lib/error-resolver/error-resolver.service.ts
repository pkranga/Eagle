/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { NsError } from './error-resolver.model'

@Injectable({
  providedIn: 'root',
})
export class ErrorResolverService {
  constructor(private http: HttpClient) {}

  async getErrorConfig(path: string): Promise<NsError.IErrorConfig> {
    const errorData: NsError.IErrorConfig = await this.http
      .get<NsError.IErrorConfig>(path)
      .toPromise()
    return errorData
  }
}
